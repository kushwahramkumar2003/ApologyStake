use anchor_lang::prelude::*;

declare_id!("6W2YxRyMJoDEWWRsTmh8KdkAuz4AahY2WLMXh3ZEigBf");

#[program]
pub mod apologystake {
    use super::*;

    pub fn initialize_apology(
        ctx: Context<InitializeApology>,
        probation_days: u64,
        stake_amount: u64,
        message: String,
        nonce: i64,
        twitter: String,
    ) -> Result<()> {
        let apology = &mut ctx.accounts.apology;
        let clock = Clock::get()?;

        // Validate inputs
        require!(probation_days > 0, ApologyError::InvalidProbationDays);
        require!(!message.is_empty(), ApologyError::EmptyMessage);
        require!(
            ctx.accounts.offender.key() != ctx.accounts.victim.key(),
            ApologyError::InvalidVictim
        );

        // Initialize apology account
        apology.offender = ctx.accounts.offender.key();
        apology.twitter = twitter.clone();
        apology.nonce = nonce;
        apology.victim = ctx.accounts.victim.key();
        apology.stake_amount = stake_amount;
        apology.probation_end = clock.unix_timestamp + (probation_days * 24 * 60 * 60) as i64;
        apology.created_at = clock.unix_timestamp;
        apology.status = ApologyStatus::Active;
        apology.message = message;

        // Transfer SOL to PDA
        if stake_amount > 0 {
            let transfer_instruction = anchor_lang::system_program::Transfer {
                from: ctx.accounts.offender.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            };

            let transfer_ctx = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
            );

            anchor_lang::system_program::transfer(transfer_ctx, stake_amount)?;
        }

        emit!(ApologyCreated {
            apology_id: apology.key(),
            offender: ctx.accounts.offender.key(),
            victim: ctx.accounts.victim.key(),
            stake_amount,
            twitter,
            probation_days,
        });

        Ok(())
    }

    pub fn release_stake(ctx: Context<ReleaseStake>) -> Result<()> {
        let apology = &mut ctx.accounts.apology;
        let clock = Clock::get()?;

        require!(
            apology.status == ApologyStatus::Active,
            ApologyError::InvalidStatus
        );

        require!(
            clock.unix_timestamp >= apology.probation_end,
            ApologyError::ProbationNotEnded
        );

        require!(
            ctx.accounts.victim.key() == apology.victim,
            ApologyError::UnauthorizedVictim
        );

        // Transfer SOL back to offender
        if apology.stake_amount > 0 {
            let transfer_instruction = anchor_lang::system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.offender.to_account_info(),
            };

            let seeds = &[
                b"vault".as_ref(),
                apology.to_account_info().key.as_ref(),
                &[ctx.bumps.vault],
            ];

            let seeds_slice = &[&seeds[..]];
            let transfer_ctx = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
                seeds_slice,
            );

            anchor_lang::system_program::transfer(transfer_ctx, apology.stake_amount)?;
        }

        apology.status = ApologyStatus::Completed;

        emit!(ApologyCompleted {
            apology_id: apology.key(),
            resolution: ApologyResolution::Released,
        });

        Ok(())
    }

    pub fn claim_stake(ctx: Context<ClaimStake>) -> Result<()> {
        let apology = &mut ctx.accounts.apology;
        let clock = Clock::get()?;

        require!(
            apology.status == ApologyStatus::Active,
            ApologyError::InvalidStatus
        );

        require!(
            clock.unix_timestamp >= apology.probation_end,
            ApologyError::ProbationNotEnded
        );

        require!(
            ctx.accounts.victim.key() == apology.victim,
            ApologyError::UnauthorizedVictim
        );

        // Transfer SOL to victim
        if apology.stake_amount > 0 {
            let transfer_instruction = anchor_lang::system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.victim.to_account_info(),
            };

            let seeds = &[
                b"vault".as_ref(),
                apology.to_account_info().key.as_ref(),
                &[ctx.bumps.vault],
            ];

            let signer_seeds = &[&seeds[..]];
            let transfer_ctx = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
                signer_seeds,
            );

            anchor_lang::system_program::transfer(transfer_ctx, apology.stake_amount)?;
        }

        apology.status = ApologyStatus::Completed;

        emit!(ApologyCompleted {
            apology_id: apology.key(),
            resolution: ApologyResolution::Claimed,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(probation_days: u64, stake_amount: u64, message: String, nonce: i64)]
pub struct InitializeApology<'info> {
    #[account(
        init,
        payer = offender,
        space = Apology::LEN,
        seeds = [
            b"apology",
            offender.key().as_ref(),
            victim.key().as_ref(),
            &nonce.to_le_bytes()
        ],
        bump
    )]
    pub apology: Account<'info, Apology>,

    #[account(mut)]
    pub offender: Signer<'info>,

    /// CHECK: This is not written to, only used as a reference for the PDA
    pub victim: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReleaseStake<'info> {
    #[account(
        mut,
        seeds = [b"apology", apology.offender.as_ref(), apology.victim.as_ref()],
        bump,
        constraint = apology.status == ApologyStatus::Active,
        constraint = Clock::get()?.unix_timestamp >= apology.probation_end,
    )]
    pub apology: Account<'info, Apology>,

    /// CHECK: This is not written to, only used as a destination for transfers
    #[account(mut)]
    pub offender: AccountInfo<'info>,

    #[account(mut)]
    pub victim: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimStake<'info> {
    #[account(
        mut,
        seeds = [b"apology", apology.offender.as_ref(), apology.victim.as_ref()],
        bump,
        constraint = apology.status == ApologyStatus::Active,
        constraint = Clock::get()?.unix_timestamp >= apology.probation_end,
    )]
    pub apology: Account<'info, Apology>,

    #[account(mut)]
    pub victim: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Apology {
    pub offender: Pubkey,
    pub victim: Pubkey,
    pub nonce: i64,
    pub stake_amount: u64,
    pub probation_end: i64,
    pub created_at: i64,
    pub status: ApologyStatus,
    pub message: String,
    pub twitter: String,
}

impl Apology {
    const LEN: usize = 8 + // discriminator
        32 + // offender
        32 + // victim
        8 + // stake_amount
        8 + // probation_end
        8 + // created_at
        1 + // status
        8 + // nonce
        4 + 200; // message (max 200 chars)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ApologyStatus {
    Active,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ApologyResolution {
    Released,
    Claimed,
}

#[event]
pub struct ApologyCreated {
    pub apology_id: Pubkey,
    pub offender: Pubkey,
    pub victim: Pubkey,
    pub stake_amount: u64,
    pub probation_days: u64,
    pub twitter: String,
}

#[event]
pub struct ApologyCompleted {
    pub apology_id: Pubkey,
    pub resolution: ApologyResolution,
}

#[error_code]
pub enum ApologyError {
    #[msg("Apology is not in the correct status")]
    InvalidStatus,
    #[msg("Probation period has not ended")]
    ProbationNotEnded,
    #[msg("Only the victim can perform this action")]
    UnauthorizedVictim,
    #[msg("Probation days must be greater than zero")]
    InvalidProbationDays,
    #[msg("Message cannot be empty")]
    EmptyMessage,
    #[msg("Cannot apologize to self")]
    InvalidVictim,
}
