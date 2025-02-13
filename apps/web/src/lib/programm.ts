import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Connection,
} from "@solana/web3.js";
import { IDL } from "./idl";
import { Apologystake } from "@/program/aplogystack";

export const PROGRAM_ID = new PublicKey(
  "BEzAB38XypEyvKauzYz6CUKhigu3jgoFSzyLSW5ykUFJ"
);
export const MAX_MESSAGE_LENGTH = 200;
export const MIN_PROBATION_DAYS = 1;
export const MAX_PROBATION_DAYS = 365;

export class ApologyError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ApologyError";
  }
}

export interface ApologyParams {
  victim: PublicKey;
  probationDays: number;
  stakeAmount: number;
  message: string;
  victimTwitter: string;
}

export interface ApologyAccount {
  offender: PublicKey;
  victim: PublicKey;
  nonce: anchor.BN;
  stakeAmount: anchor.BN;
  probationEnd: anchor.BN;
  createdAt: anchor.BN;
  // eslint-disable-next-line
  status: { active?: {} } | { completed?: {} };
  message: string;
  victimTwitter: string;
}

export class ApologyStakeProgram {
  private program: Program<Apologystake>;
  private connection: Connection;
  // eslint-disable-next-line
  private logger: (message: string, ...args: any[]) => void;

  constructor(
    provider: anchor.AnchorProvider,
    debug: boolean = false,
    // eslint-disable-next-line
    customLogger?: (message: string, ...args: any[]) => void
  ) {
    if (!provider.publicKey) {
      throw new ApologyError(
        "Provider wallet not connected",
        "WALLET_NOT_CONNECTED"
      );
    }

    this.program = new Program(IDL as unknown as Apologystake, provider);
    this.connection = provider.connection;
    this.logger = customLogger || (debug ? console.log : () => {});
  }

  /**
   * Generate a unique nonce for creating multiple apologies between same parties
   */
  private async generateUniqueNonce(
    offender: PublicKey,
    victim: PublicKey
  ): Promise<number> {
    let nonce = 0;
    let isUnique = false;

    while (!isUnique && nonce < Number.MAX_SAFE_INTEGER) {
      try {
        const [pda] = await this.findApologyPDA(offender, victim, nonce);
        const account = await this.connection.getAccountInfo(pda);

        if (!account) {
          isUnique = true;
        } else {
          nonce++;
        }
      } catch (error) {
        this.logger("Error checking nonce:", error);
        nonce++;
      }
    }

    if (!isUnique) {
      throw new ApologyError(
        "Could not generate unique nonce",
        "NONCE_GENERATION_FAILED"
      );
    }

    return nonce;
  }

  /**
   * Find PDA for apology account
   */
  async findApologyPDA(
    offender: PublicKey,
    victim: PublicKey,
    nonce: number
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("apology"),
        offender.toBuffer(),
        victim.toBuffer(),
        new anchor.BN(nonce).toArrayLike(Buffer, "le", 8),
      ],
      this.program.programId
    );
  }

  /**
   * Find PDA for vault account
   */
  async findVaultPDA(apology: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), apology.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Validate apology parameters
   */
  private validateApologyParams({
    victim,
    probationDays,
    stakeAmount,
    message,
  }: ApologyParams): void {
    if (!victim) {
      throw new ApologyError("Victim public key is required", "INVALID_VICTIM");
    }

    if (
      probationDays < MIN_PROBATION_DAYS ||
      probationDays > MAX_PROBATION_DAYS
    ) {
      throw new ApologyError(
        `Probation days must be between ${MIN_PROBATION_DAYS} and ${MAX_PROBATION_DAYS}`,
        "INVALID_PROBATION_DAYS"
      );
    }

    if (stakeAmount < 0) {
      throw new ApologyError(
        "Stake amount cannot be negative",
        "INVALID_STAKE_AMOUNT"
      );
    }

    if (!message || message.trim().length === 0) {
      throw new ApologyError("Message cannot be empty", "EMPTY_MESSAGE");
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new ApologyError(
        `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
        "MESSAGE_TOO_LONG"
      );
    }
  }

  /**
   * Create a new apology with automatic nonce generation
   */
  async createApology(params: ApologyParams): Promise<string> {
    this.logger("Creating apology", params);

    try {
      // Validate parameters
      this.validateApologyParams(params);

      const offender = this.program.provider.publicKey;
      if (!offender) {
        throw new ApologyError(
          "Provider wallet not connected",
          "WALLET_NOT_CONNECTED"
        );
      }

      if (offender.equals(params.victim)) {
        throw new ApologyError("Cannot apologize to self", "SELF_APOLOGY");
      }

      const nonce = await this.generateUniqueNonce(offender, params.victim);

      const [apologyPDA] = await this.findApologyPDA(
        offender,
        params.victim,
        nonce
      );
      const [vaultPDA] = await this.findVaultPDA(apologyPDA);

      const balance = await this.connection.getBalance(offender);
      if (balance < params.stakeAmount) {
        throw new ApologyError(
          "Insufficient balance for stake amount",
          "INSUFFICIENT_BALANCE"
        );
      }

      const tx = await this.program.methods
        .initializeApology(
          new anchor.BN(params.probationDays),
          new anchor.BN(params.stakeAmount),
          params.message,
          new anchor.BN(nonce),
          params.victimTwitter
        )
        .accounts({
          // @ts-expect-error - Error expected
          apology: apologyPDA,
          offender,
          victim: params.victim,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      this.logger("Apology created successfully", { tx, nonce });
      return tx;
    } catch (error) {
      this.logger("Error creating apology", error);
      if (error instanceof ApologyError) {
        throw error;
      }
      throw new ApologyError(
        // @ts-expect-error - Error expected
        `Failed to create apology: ${error.message}`,
        "CREATE_FAILED"
      );
    }
  }

  /**
   * Check if an apology exists and is active
   */
  private async validateApologyAccount(
    apologyPDA: PublicKey
  ): Promise<ApologyAccount> {
    const apology = await this.getApology(apologyPDA);
    if (!apology) {
      throw new ApologyError("Apology not found", "NOT_FOUND");
    }

    if ("completed" in apology.status) {
      throw new ApologyError(
        "Apology has already been completed",
        "ALREADY_COMPLETED"
      );
    }

    return apology;
  }

  /**
   * Release stake back to offender
   */
  async releaseStake(apologyPDA: PublicKey): Promise<string> {
    this.logger("Releasing stake for apology", apologyPDA.toBase58());

    try {
      const apology = await this.validateApologyAccount(apologyPDA);
      const currentVictim = this.program.provider.publicKey;

      if (!currentVictim || !currentVictim.equals(apology.victim)) {
        throw new ApologyError(
          "Only the victim can release the stake",
          "UNAUTHORIZED"
        );
      }

      const [vaultPDA] = await this.findVaultPDA(apologyPDA);

      const tx = await this.program.methods
        .releaseStake()
        .accounts({
          // @ts-expect-error - Error expected
          apology: apologyPDA,
          offender: apology.offender,
          victim: currentVictim,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      this.logger("Stake released successfully", { tx });
      return tx;
    } catch (error) {
      this.logger("Error releasing stake", error);
      if (error instanceof ApologyError) {
        throw error;
      }
      throw new ApologyError(
        // @ts-expect-error - Error expected
        `Failed to release stake: ${error.message}`,
        "RELEASE_FAILED"
      );
    }
  }

  /**
   * Claim stake as victim
   */
  async claimStake(apologyPDA: PublicKey): Promise<string> {
    this.logger("Claiming stake for apology", apologyPDA.toBase58());

    try {
      const apology = await this.validateApologyAccount(apologyPDA);
      const currentVictim = this.program.provider.publicKey;

      if (!currentVictim || !currentVictim.equals(apology.victim)) {
        throw new ApologyError(
          "Only the victim can claim the stake",
          "UNAUTHORIZED"
        );
      }

      const [vaultPDA] = await this.findVaultPDA(apologyPDA);

      const tx = await this.program.methods
        .claimStake()
        .accounts({
          // @ts-expect-error - Error expected
          apology: apologyPDA,
          victim: currentVictim,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      this.logger("Stake claimed successfully", { tx });
      return tx;
    } catch (error) {
      this.logger("Error claiming stake", error);
      if (error instanceof ApologyError) {
        throw error;
      }
      throw new ApologyError(
        // @ts-expect-error - Error expected
        `Failed to claim stake: ${error.message}`,
        "CLAIM_FAILED"
      );
    }
  }

  /**
   * Get apology account data
   */
  async getApology(apologyPDA: PublicKey): Promise<ApologyAccount | null> {
    try {
      // @ts-expect-error - Error expected
      return await this.program.account.apology.fetch(apologyPDA);
      // eslint-disable-next-line
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all apologies by offender with pagination
   */
  async getApologiesByOffender(
    offender: PublicKey,
    // eslint-disable-next-line
    limit?: number,
    // eslint-disable-next-line
    beforePubkey?: PublicKey
  ) {
    try {
      const filters = [
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: offender.toBase58(),
          },
        },
      ];

      return await this.program.account.apology.all(filters);
    } catch (error) {
      throw new ApologyError(
        // @ts-expect-error - Error expected
        `Failed to fetch apologies: ${error.message}`,
        "FETCH_FAILED"
      );
    }
  }

  /**
   * Get all apologies by victim with pagination
   */
  async getApologiesByVictim(
    victim: PublicKey,
    // eslint-disable-next-line
    limit?: number,
    // eslint-disable-next-line
    beforePubkey?: PublicKey
  ) {
    try {
      const filters = [
        {
          memcmp: {
            offset: 40, // After discriminator + offender
            bytes: victim.toBase58(),
          },
        },
      ];

      return await this.program.account.apology.all(filters);
    } catch (error) {
      throw new ApologyError(
        // @ts-expect-error - Error expected
        `Failed to fetch apologies: ${error.message}`,
        "FETCH_FAILED"
      );
    }
  }
}
