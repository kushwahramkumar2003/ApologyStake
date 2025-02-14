//! ApologyStake Program
//!
//! A Solana program that enables users to make public apologies with financial stakes.
//! The program implements a mechanism where users can make formal apologies backed by
//! SOL stakes, demonstrating sincerity through financial commitment.
//!
//! # Program Overview
//! - Offender creates an apology and optionally stakes SOL
//! - Stake is locked for a specified probation period
//! - After probation, victim can either:
//!   - Release stake back to offender (forgiveness)
//!   - Claim the stake (consequence enforcement)
//!
//! # Account Structure
//! - Apology Account: Stores apology details and status
//! - Vault Account: Holds staked SOL during probation
//!
//! # Security Considerations
//! - All stake operations require victim signature
//! - Time-locked operations through probation period
//! - Protected stake withdrawal through PDA derivation

use anchor_lang::prelude::*;

declare_id!("BEzAB38XypEyvKauzYz6CUKhigu3jgoFSzyLSW5ykUFJ");

#[program]
pub mod apologystake {
    use super::*;

    /*
    # Instructions

    The program provides three main instructions:
    1. initialize_apology: Create new apology with optional stake
       - Sets up apology account
       - Transfers stake to vault
       - Starts probation period

    2. release_stake: Victim releases stake to offender
       - Only callable after probation
       - Requires victim signature
       - Returns stake to offender

    3. claim_stake: Victim claims the stake
       - Only callable after probation
       - Requires victim signature
       - Transfers stake to victim

    # Workflow
    1. Offender initializes apology + stakes SOL
    2. Probation period passes
    3. Victim decides to release or claim stake
    4. Apology marked as completed with resolution
    */

    /// Creates a new apology with an optional SOL stake
    ///
    /// # Arguments
    /// * `ctx` - Context containing all required accounts
    /// * `probation_days` - Duration of probation period in days
    /// * `stake_amount` - Amount of SOL to stake (in lamports)
    /// * `message` - The apology message text
    /// * `nonce` - Unique identifier for this apology
    /// * `twitter` - Victim's Twitter handle for public reference
    ///
    /// # Returns
    /// * `Result<()>` - Success or error result
    ///
    /// # Errors
    /// - `InvalidProbationDays` if probation days is zero
    /// - `EmptyMessage` if message is empty
    /// - `InvalidVictim` if offender and victim are same
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
        require!(
            stake_amount <= ctx.accounts.offender.lamports(),
            ApologyError::InsufficientFunds
        );
        require!(stake_amount > 0, ApologyError::InvalidStakeAmount);

        // Initialize apology account
        apology.offender = ctx.accounts.offender.key();
        apology.twitter = twitter.clone();
        apology.nonce = nonce;
        apology.victim = ctx.accounts.victim.key();
        apology.stake_amount = stake_amount;
        apology.probation_end = clock.unix_timestamp + (probation_days * 24 * 60 * 60) as i64;
        // apology.probation_end = clock.unix_timestamp + (probation_days * 60) as i64;
        apology.created_at = clock.unix_timestamp;
        apology.status = ApologyStatus::Active;
        apology.message = message;

        // Transfer SOL to PDA if stake amount > 0
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

    /// Releases staked SOL back to the offender
    ///
    /// Can only be called by the victim after probation period ends.
    /// Represents forgiveness/acceptance of the apology.
    ///
    /// # Arguments
    /// * `ctx` - Context containing all required accounts
    ///
    /// # Returns
    /// * `Result<()>` - Success or error result
    ///
    /// # Errors
    /// - `InvalidStatus` if apology not active
    /// - `ProbationNotEnded` if called too early
    /// - `UnauthorizedVictim` if caller not victim
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

        // Transfer SOL back to offender if stake exists
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

    /// Allows victim to claim the staked SOL
    ///
    /// Can only be called by the victim after probation period ends.
    /// Represents enforcement of consequences for the offense.
    ///
    /// # Arguments
    /// * `ctx` - Context containing all required accounts
    ///
    /// # Returns
    /// * `Result<()>` - Success or error result
    ///
    /// # Errors
    /// - `InvalidStatus` if apology not active
    /// - `ProbationNotEnded` if called too early
    /// - `UnauthorizedVictim` if caller not victim
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

        // Transfer SOL to victim if stake exists
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

/// Account validation for initializing a new apology
#[derive(Accounts)]
#[instruction(probation_days: u64, stake_amount: u64, message: String, nonce: i64)]
pub struct InitializeApology<'info> {
    /// The apology account to be created
    /// PDA derived from offender, victim, and nonce
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

    /// The account making the apology and paying for account creation
    #[account(mut)]
    pub offender: Signer<'info>,

    /// The account receiving the apology
    /// CHECK: Only used as a reference for PDA derivation
    pub victim: AccountInfo<'info>,

    /// Vault account to hold staked SOL
    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    /// Required for system operations
    pub system_program: Program<'info, System>,

    /// Required for rent calculations
    pub rent: Sysvar<'info, Rent>,
}

/// Account validation for releasing stake back to offender
#[derive(Accounts)]
pub struct ReleaseStake<'info> {
    /// The apology account containing stake details
    #[account(
        mut,
        seeds = [b"apology", apology.offender.as_ref(), apology.victim.as_ref(),&apology.nonce.to_le_bytes()],
        bump,
        constraint = apology.status == ApologyStatus::Active,
        constraint = Clock::get()?.unix_timestamp >= apology.probation_end,
    )]
    pub apology: Account<'info, Apology>,

    /// The original offender's account to receive returned stake
    /// CHECK: Only used as destination for stake return
    #[account(mut)]
    pub offender: AccountInfo<'info>,

    /// The victim must sign to release stake
    #[account(mut)]
    pub victim: Signer<'info>,

    /// Vault holding the staked SOL
    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    /// Required for transfer operations
    pub system_program: Program<'info, System>,
}

/// Account validation for victim claiming stake
#[derive(Accounts)]
pub struct ClaimStake<'info> {
    /// The apology account containing stake details
    #[account(
        mut,
        seeds = [b"apology", apology.offender.as_ref(), apology.victim.as_ref(), &apology.nonce.to_le_bytes()],
        bump,
        constraint = apology.status == ApologyStatus::Active,
        constraint = Clock::get()?.unix_timestamp >= apology.probation_end,
    )]
    pub apology: Account<'info, Apology>,

    /// The victim must sign to claim stake
    #[account(mut)]
    pub victim: Signer<'info>,

    /// Vault holding the staked SOL
    #[account(
        mut,
        seeds = [b"vault", apology.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    /// Required for transfer operations
    pub system_program: Program<'info, System>,
}

/// Main account structure storing apology data
#[account]
pub struct Apology {
    /// Public key of the apologizing party
    pub offender: Pubkey,
    /// Public key of the party receiving the apology
    pub victim: Pubkey,
    /// Unique identifier for this apology
    pub nonce: i64,
    /// Amount of SOL staked in lamports
    pub stake_amount: u64,
    /// Unix timestamp when probation period ends
    pub probation_end: i64,
    /// Unix timestamp when apology was created
    pub created_at: i64,
    /// Current status of the apology
    pub status: ApologyStatus,
    /// The apology message text
    pub message: String,
    /// Victim's Twitter handle
    pub twitter: String,
}

impl Apology {
    /// Calculate total space needed for account
    const LEN: usize = 8 +    // discriminator
        32 +   // offender pubkey
        32 +   // victim pubkey
        8 +    // stake_amount
        8 +    // probation_end
        8 +    // created_at
        1 +    // status enum
        8 +    // nonce
        4 + 200; // message (4 bytes length + max 200 chars)
}

/// Status of an apology
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ApologyStatus {
    /// Apology is active and stake is locked
    Active,
    /// Apology completed and stake has been released/claimed
    Completed,
}

/// How an apology was resolved
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ApologyResolution {
    /// Stake was released back to offender
    Released,
    /// Stake was claimed by victim
    Claimed,
}

/// Event emitted when new apology is created
#[event]
pub struct ApologyCreated {
    /// Public key of the apology account
    pub apology_id: Pubkey,
    /// Public key of the apologizing party
    pub offender: Pubkey,
    /// Public key of the party receiving apology
    pub victim: Pubkey,
    /// Amount of SOL staked in lamports
    pub stake_amount: u64,
    /// Length of probation in days
    pub probation_days: u64,
    /// Victim's Twitter handle
    pub twitter: String,
}

/// Event emitted when apology is completed
#[event]
pub struct ApologyCompleted {
    /// Public key of the apology account
    pub apology_id: Pubkey,
    /// How the apology was resolved
    pub resolution: ApologyResolution,
}

/// Program-specific error codes
#[error_code]
pub enum ApologyError {
    /// Attempted operation invalid for current apology status
    #[msg("Apology is not in the correct status")]
    InvalidStatus,

    /// Attempted to release/claim stake before probation period ended
    #[msg("Probation period has not ended")]
    ProbationNotEnded,

    /// Non-victim attempted to perform victim-only action
    #[msg("Only the victim can perform this action")]
    UnauthorizedVictim,

    /// Zero or negative probation days specified
    #[msg("Probation days must be greater than zero")]
    InvalidProbationDays,

    /// Attempted to create apology with empty message
    #[msg("Message cannot be empty")]
    EmptyMessage,

    /// Attempted to create apology to self
    #[msg("Cannot apologize to self")]
    InvalidVictim,

    /// Insufficient funds to stake specified amount
    #[msg("Insufficient funds to stake")]
    InsufficientFunds,

    /// amount must be greater then 0
    #[msg("Stake amount must be greater than 0")]
    InvalidStakeAmount,
}
