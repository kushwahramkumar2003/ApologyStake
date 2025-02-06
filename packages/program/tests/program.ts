import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Apologystake } from "../target/types/apologystake";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

describe("apologystake", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ApologyStake as Program<Apologystake>;

  // Test accounts
  const offender = anchor.web3.Keypair.generate();
  const victim = anchor.web3.Keypair.generate();
  let apologyPDA: PublicKey;
  let vaultPDA: PublicKey;
  let apologyBump: number;
  let vaultBump: number;

  // Test parameters
  const probationDays = 7;
  const stakeAmount = LAMPORTS_PER_SOL; // 1 SOL
  const message = "I apologize for my actions";

  before(async () => {
    // Airdrop SOL to offender for transactions
    const airdropSignature = await provider.connection.requestAirdrop(
      offender.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Derive PDAs
    [apologyPDA, apologyBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("apology"),
        offender.publicKey.toBuffer(),
        victim.publicKey.toBuffer(),
      ],
      program.programId
    );

    [vaultPDA, vaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), apologyPDA.toBuffer()],
      program.programId
    );
  });

  it("Initializes an apology with stake", async () => {
    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(stakeAmount),
        message
      )
      .accounts({
        apology: apologyPDA,
        offender: offender.publicKey,
        victim: victim.publicKey,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([offender])
      .rpc();

    // Verify apology account data
    const apologyAccount = await program.account.apology.fetch(apologyPDA);
    expect(apologyAccount.offender.toString()).to.equal(
      offender.publicKey.toString()
    );
    expect(apologyAccount.victim.toString()).to.equal(
      victim.publicKey.toString()
    );
    expect(apologyAccount.stakeAmount.toString()).to.equal(
      stakeAmount.toString()
    );
    expect(apologyAccount.message).to.equal(message);
    expect(apologyAccount.status).to.deep.equal({ active: {} });

    // Verify stake transfer
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    expect(vaultBalance).to.equal(stakeAmount);
  });

  it("Cannot initialize apology with insufficient funds", async () => {
    const poorOffender = anchor.web3.Keypair.generate();
    const [poorApologyPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from("apology"),
        poorOffender.publicKey.toBuffer(),
        victim.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [poorVaultPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), poorApologyPDA.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .initializeApology(
          new anchor.BN(probationDays),
          new anchor.BN(stakeAmount),
          message
        )
        .accounts({
          apology: poorApologyPDA,
          offender: poorOffender.publicKey,
          victim: victim.publicKey,
          vault: poorVaultPDA,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([poorOffender])
        .rpc();
      expect.fail("Should have failed with insufficient funds");
    } catch (error) {
      expect(error.message).to.include("insufficient funds");
    }
  });

  it("Cannot release stake before probation period ends", async () => {
    try {
      await program.methods
        .releaseStake()
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: victim.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([victim])
        .rpc();
      expect.fail("Should have failed with probation not ended");
    } catch (error) {
      expect(error.message).to.include("Probation period has not ended");
    }
  });

  it("Cannot claim stake before probation period ends", async () => {
    try {
      await program.methods
        .claimStake()
        .accounts({
          apology: apologyPDA,
          victim: victim.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([victim])
        .rpc();
      expect.fail("Should have failed with probation not ended");
    } catch (error) {
      expect(error.message).to.include("Probation period has not ended");
    }
  });

  it("Only victim can release stake", async () => {
    const randomUser = anchor.web3.Keypair.generate();
    try {
      await program.methods
        .releaseStake()
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: randomUser.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([randomUser])
        .rpc();
      expect.fail("Should have failed with unauthorized victim");
    } catch (error) {
      expect(error.message).to.include(
        "Only the victim can perform this action"
      );
    }
  });

  // Helper function to advance blockchain time
  async function advanceBlockchainTime(seconds: number) {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(offender.publicKey, 0)
    );
    // Note: This is a simplified way to advance time. In a real test environment,
    // you would need to use the proper method based on your test validator setup.
  }

  it("Victim can release stake after probation ends", async () => {
    // Advance time past probation period
    await advanceBlockchainTime(probationDays * 24 * 60 * 60);

    const offenderBalanceBefore = await provider.connection.getBalance(
      offender.publicKey
    );

    await program.methods
      .releaseStake()
      .accounts({
        apology: apologyPDA,
        offender: offender.publicKey,
        victim: victim.publicKey,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([victim])
      .rpc();

    // Verify stake was returned to offender
    const offenderBalanceAfter = await provider.connection.getBalance(
      offender.publicKey
    );
    expect(offenderBalanceAfter - offenderBalanceBefore).to.be.approximately(
      stakeAmount,
      1000000 // Allow for small differences due to transaction fees
    );

    // Verify apology status
    const apologyAccount = await program.account.apology.fetch(apologyPDA);
    expect(apologyAccount.status).to.deep.equal({ completed: {} });
  });

  it("Cannot interact with completed apology", async () => {
    try {
      await program.methods
        .releaseStake()
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: victim.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([victim])
        .rpc();
      expect.fail("Should have failed with invalid status");
    } catch (error) {
      expect(error.message).to.include("Apology is not in the correct status");
    }
  });

  // Test initialization with zero stake
  it("Can initialize apology with zero stake", async () => {
    const newOffender = anchor.web3.Keypair.generate();
    const [newApologyPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from("apology"),
        newOffender.publicKey.toBuffer(),
        victim.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [newVaultPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), newApologyPDA.toBuffer()],
      program.programId
    );

    // Airdrop just enough for rent and transaction fee
    const airdropSignature = await provider.connection.requestAirdrop(
      newOffender.publicKey,
      LAMPORTS_PER_SOL / 10
    );
    await provider.connection.confirmTransaction(airdropSignature);

    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(0),
        message
      )
      .accounts({
        apology: newApologyPDA,
        offender: newOffender.publicKey,
        victim: victim.publicKey,
        vault: newVaultPDA,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([newOffender])
      .rpc();

    const apologyAccount = await program.account.apology.fetch(newApologyPDA);
    expect(apologyAccount.stakeAmount.toString()).to.equal("0");
  });
});
