import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Apologystake } from "../target/types/apologystake";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

describe("apologystake", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Apologystake as Program<Apologystake>;

  // Test accounts
  const offender = anchor.web3.Keypair.generate();
  const victim1 = anchor.web3.Keypair.generate();
  const victim2 = anchor.web3.Keypair.generate();

  // Test parameters
  const probationDays = 7;
  const stakeAmount = LAMPORTS_PER_SOL; // 1 SOL
  const message = "I apologize for my actions";

  before(async () => {
    // Airdrop SOL to offender for multiple transactions
    const airdropSignature = await provider.connection.requestAirdrop(
      offender.publicKey,
      10 * LAMPORTS_PER_SOL // Increased to 10 SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Airdrop to victims
    for (const victim of [victim1, victim2]) {
      const victimAirdrop = await provider.connection.requestAirdrop(
        victim.publicKey,
        LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(victimAirdrop);
    }
  });

  async function createApologyPDAs(
    offender: PublicKey,
    victim: PublicKey,
    nonce: number
  ) {
    const [apologyPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from("apology"),
        offender.toBuffer(),
        victim.toBuffer(),
        new anchor.BN(nonce).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const [vaultPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("vault"), apologyPDA.toBuffer()],
      program.programId
    );

    return { apologyPDA, vaultPDA };
  }

  it("Can create multiple apologies to different victims", async () => {
    // Create first apology to victim1
    const { apologyPDA: apologyPDA1, vaultPDA: vaultPDA1 } =
      await createApologyPDAs(offender.publicKey, victim1.publicKey, 0);

    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(stakeAmount),
        message,
        new anchor.BN(0),
        "ramkumar_9301"
      )
      .accounts({
        apology: apologyPDA1,
        offender: offender.publicKey,
        victim: victim1.publicKey,
        vault: vaultPDA1,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([offender])
      .rpc();

    // Create second apology to victim2
    const { apologyPDA: apologyPDA2, vaultPDA: vaultPDA2 } =
      await createApologyPDAs(offender.publicKey, victim2.publicKey, 0);

    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(stakeAmount),
        message,
        new anchor.BN(0),
        "ramkumar_9301"
      )
      .accounts({
        apology: apologyPDA2,
        offender: offender.publicKey,
        victim: victim2.publicKey,
        vault: vaultPDA2,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([offender])
      .rpc();

    // Verify both apologies exist
    const apology1 = await program.account.apology.fetch(apologyPDA1);
    const apology2 = await program.account.apology.fetch(apologyPDA2);

    expect(apology1.victim.toString()).to.equal(victim1.publicKey.toString());
    expect(apology2.victim.toString()).to.equal(victim2.publicKey.toString());
  });

  it("Can create multiple apologies to same victim using nonce", async () => {
    // Create first apology with nonce 1
    const { apologyPDA: apologyPDA1, vaultPDA: vaultPDA1 } =
      await createApologyPDAs(offender.publicKey, victim1.publicKey, 1);

    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(stakeAmount / 2), // Different stake amount
        "First apology",
        new anchor.BN(1),
        "ramkumar_9301"
      )
      .accounts({
        apology: apologyPDA1,
        offender: offender.publicKey,
        victim: victim1.publicKey,
        vault: vaultPDA1,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([offender])
      .rpc();

    // Create second apology with nonce 2
    const { apologyPDA: apologyPDA2, vaultPDA: vaultPDA2 } =
      await createApologyPDAs(offender.publicKey, victim1.publicKey, 2);

    await program.methods
      .initializeApology(
        new anchor.BN(probationDays),
        new anchor.BN(stakeAmount / 4), // Different stake amount
        "Second apology",
        new anchor.BN(2),
        "ramkumar_9301"
      )
      .accounts({
        apology: apologyPDA2,
        offender: offender.publicKey,
        victim: victim1.publicKey,
        vault: vaultPDA2,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([offender])
      .rpc();

    // Verify both apologies exist with different messages
    const apology1 = await program.account.apology.fetch(apologyPDA1);
    const apology2 = await program.account.apology.fetch(apologyPDA2);

    expect(apology1.message).to.equal("First apology");
    expect(apology2.message).to.equal("Second apology");
    expect(apology1.nonce.toString()).to.equal("1");
    expect(apology2.nonce.toString()).to.equal("2");
  });

  it("Cannot initialize with invalid probation days", async () => {
    const { apologyPDA, vaultPDA } = await createApologyPDAs(
      offender.publicKey,
      victim1.publicKey,
      3
    );

    try {
      await program.methods
        .initializeApology(
          new anchor.BN(0), // Invalid probation days
          new anchor.BN(stakeAmount),
          message,
          new anchor.BN(3),
          "ramkumar_9301"
        )
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: victim1.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([offender])
        .rpc();
      expect.fail("Should have failed with invalid probation days");
    } catch (error) {
      expect(error.toString()).to.include("InvalidProbationDays");
    }
  });

  it("Cannot initialize with empty message", async () => {
    const { apologyPDA, vaultPDA } = await createApologyPDAs(
      offender.publicKey,
      victim1.publicKey,
      4
    );

    try {
      await program.methods
        .initializeApology(
          new anchor.BN(probationDays),
          new anchor.BN(stakeAmount),
          "", // Empty message
          new anchor.BN(4),
          "ramkumar_9301"
        )
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: victim1.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([offender])
        .rpc();
      expect.fail("Should have failed with empty message");
    } catch (error) {
      expect(error.toString()).to.include("EmptyMessage");
    }
  });

  it("Cannot initialize apology to self", async () => {
    const { apologyPDA, vaultPDA } = await createApologyPDAs(
      offender.publicKey,
      offender.publicKey,
      5
    );

    try {
      await program.methods
        .initializeApology(
          new anchor.BN(probationDays),
          new anchor.BN(stakeAmount),
          message,
          new anchor.BN(5),
          "ramkumar_9301"
        )
        .accounts({
          apology: apologyPDA,
          offender: offender.publicKey,
          victim: offender.publicKey, // Same as offender
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([offender])
        .rpc();
      expect.fail("Should have failed when apologizing to self");
    } catch (error) {
      expect(error.toString()).to.include("InvalidVictim");
    }
  });

  describe("Stake Release and Claim Tests", () => {
    let testApologyPDA: PublicKey;
    let testVaultPDA: PublicKey;

    before(async () => {
      const pdas = await createApologyPDAs(
        offender.publicKey,
        victim1.publicKey,
        6
      );
      testApologyPDA = pdas.apologyPDA;
      testVaultPDA = pdas.vaultPDA;

      // Create a test apology
      await program.methods
        .initializeApology(
          new anchor.BN(probationDays),
          new anchor.BN(stakeAmount),
          message,
          new anchor.BN(6),
          "ramkumar_9301"
        )
        .accounts({
          apology: testApologyPDA,
          offender: offender.publicKey,
          victim: victim1.publicKey,
          vault: testVaultPDA,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([offender])
        .rpc();
    });

    it("Cannot release or claim stake by non-victim", async () => {
      const randomUser = anchor.web3.Keypair.generate();

      // Try to release stake
      try {
        await program.methods
          .releaseStake()
          .accounts({
            apology: testApologyPDA,
            offender: offender.publicKey,
            victim: randomUser.publicKey,
            vault: testVaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([randomUser])
          .rpc();
        expect.fail("Should have failed with unauthorized victim");
      } catch (error) {
        expect(error.toString()).to.include("UnauthorizedVictim");
      }

      // Try to claim stake
      try {
        await program.methods
          .claimStake()
          .accounts({
            apology: testApologyPDA,
            victim: randomUser.publicKey,
            vault: testVaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([randomUser])
          .rpc();
        expect.fail("Should have failed with unauthorized victim");
      } catch (error) {
        expect(error.toString()).to.include("UnauthorizedVictim");
      }
    });

    it("Victim can claim stake after probation", async () => {
      // Fast-forward time (simulate probation end)
      await provider.connection.sleep(
        probationDays * 24 * 60 * 60 * 1000 + 1000
      );

      await program.methods
        .claimStake()
        .accounts({
          apology: testApologyPDA,
          victim: victim1.publicKey,
          vault: testVaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([victim1])
        .rpc();

      const apology = await program.account.apology.fetch(testApologyPDA);
      expect(apology.status.completed).to.be.true;
    });

    it("Offender cannot release stake before probation ends", async () => {
      try {
        await program.methods
          .releaseStake()
          .accounts({
            apology: testApologyPDA,
            offender: offender.publicKey,
            victim: victim1.publicKey,
            vault: testVaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([victim1])
          .rpc();
        expect.fail("Should have failed: probation not ended");
      } catch (error) {
        expect(error.message).to.include("ProbationNotEnded");
      }
    });
  });
});
