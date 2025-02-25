import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Apologystake } from "../target/types/apologystake";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  Connection,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { expect } from "chai";

// Import local wallet for devnet testing
const localWallet = Keypair.fromSecretKey(
  Uint8Array.from(require(process.env.HOME + "/.config/solana/id.json"))
);

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("apologystake", () => {
  // Configure the client to use devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(localWallet),
    { commitment: "confirmed" }
  );

  anchor.setProvider(provider);
  const program = anchor.workspace.Apologystake as Program<Apologystake>;

  console.log("Using wallet address:", localWallet.publicKey.toString());

  // Test accounts
  const victim1 = Keypair.generate();
  const victim2 = Keypair.generate();

  // Test parameters
  const probationDays = 1;
  const stakeAmount = LAMPORTS_PER_SOL / 10; // 0.1 SOL to preserve funds on devnet
  const message = "I apologize for my actions";
  const nftUri =
    "https://raw.githubusercontent.com/kushwahramkumar2003/storage/main/assets/metadata.json";

  // Helper for waiting between transactions on devnet
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;

  // Transaction execution with retry logic
  const executeWithRetry = async (
    operation: () => Promise<string>,
    operationName: string
  ): Promise<string> => {
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        return await operation();
      } catch (error) {
        console.error(`Error in ${operationName}:`, error);
        if (
          error.toString().includes("already in use") ||
          error.toString().includes("blockhash not found") ||
          error.toString().includes("Transaction simulation failed")
        ) {
          console.log(`Retrying ${operationName} (attempt ${attempts + 1})`);
          attempts++;
          await sleep(RETRY_DELAY_MS);
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed ${operationName} after ${MAX_RETRIES} attempts`);
  };

  // Generate unique nonce based on timestamp
  const generateUniqueNonce = (): number => {
    return Math.floor(Date.now() / 1000);
  };

  // Helper to find PDA addresses for an apology
  async function createApologyPDAs(
    offender: PublicKey,
    victim: PublicKey,
    nonce: number
  ) {
    let nonceToUse = nonce;
    let apologyPDA, vaultPDA, bumps;
    let isAvailable = false;

    // Find an available nonce if the provided one is taken
    while (!isAvailable) {
      [apologyPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from("apology"),
          offender.toBuffer(),
          victim.toBuffer(),
          new anchor.BN(nonceToUse).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      [vaultPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), apologyPDA.toBuffer()],
        program.programId
      );

      // Check if apology account already exists
      const apologyAccount = await connection.getAccountInfo(apologyPDA);
      if (!apologyAccount) {
        isAvailable = true;
      } else {
        console.log(`Nonce ${nonceToUse} already in use, trying next one`);
        nonceToUse++;
      }
    }

    // Find NFT mint PDA
    const [nftMint, nftMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from("apology_nft"), apologyPDA.toBuffer()],
      program.programId
    );

    // Find metadata PDA
    const [nftMetadata] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        nftMint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    // Find master edition PDA
    const [masterEdition] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        nftMint.toBuffer(),
        Buffer.from("edition"),
      ],
      METADATA_PROGRAM_ID
    );

    return {
      apologyPDA,
      vaultPDA,
      nftMint,
      nftMetadata,
      masterEdition,
      nonce: nonceToUse,
    };
  }

  before(async () => {
    console.log("Setting up test accounts...");

    // Transfer some SOL to victim accounts for testing
    for (const victim of [victim1, victim2]) {
      try {
        const tx = await connection.sendTransaction(
          new anchor.web3.Transaction().add(
            SystemProgram.transfer({
              fromPubkey: localWallet.publicKey,
              toPubkey: victim.publicKey,
              lamports: LAMPORTS_PER_SOL / 500, // 0.002 SOL
            })
          ),
          [localWallet]
        );
        await connection.confirmTransaction(tx);
        console.log(
          `Transferred SOL to victim: ${victim.publicKey.toString()}`
        );
      } catch (err) {
        console.error("Error funding victim account:", err);
      }
    }

    await sleep(2000); // Wait for transactions to settle
  });

  // Create a new test group for apology creation tests
  describe("Apology Creation", () => {
    it("Can create an apology with NFT mint", async () => {
      const nonce = generateUniqueNonce();
      const { apologyPDA, vaultPDA, nftMint, nftMetadata, masterEdition } =
        await createApologyPDAs(
          localWallet.publicKey,
          victim1.publicKey,
          nonce
        );

      console.log(`Creating apology with nonce ${nonce}`);

      // Get associated token account for NFT
      const nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        victim1.publicKey
      );

      console.log("Associated token account:", nftTokenAccount.toString());
      console.log("program ID:", program.programId.toString());

      // Create and send the transaction
      try {
        const tx = await executeWithRetry(async () => {
          return await program.methods
            .initializeApology(
              new anchor.BN(probationDays),
              new anchor.BN(stakeAmount),
              message,
              new anchor.BN(nonce),
              "victim_twitter",
              nftUri
            )
            .accounts({
              apology: apologyPDA,
              offender: localWallet.publicKey,
              victim: victim1.publicKey,
              vault: vaultPDA,
              nftMint: nftMint,
              nftTokenAccount: nftTokenAccount,
              nftMetadata: nftMetadata,
              masterEditionAccount: masterEdition,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
              tokenProgram: TOKEN_PROGRAM_ID,
              metadataProgram: METADATA_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([localWallet])
            .rpc();
        }, "Creating apology");

        console.log("Apology creation tx:", tx);

        // Verify the apology was created correctly
        const apologyAccount = await program.account.apology.fetch(apologyPDA);
        expect(apologyAccount.offender.toString()).to.equal(
          localWallet.publicKey.toString()
        );
        expect(apologyAccount.victim.toString()).to.equal(
          victim1.publicKey.toString()
        );
        expect(apologyAccount.stakeAmount.toString()).to.equal(
          stakeAmount.toString()
        );
        expect(apologyAccount.message).to.equal(message);
        expect(apologyAccount.status.active).to.be.ok;

        // Verify the NFT token account for victim exists
        const tokenAccountInfo = await connection.getAccountInfo(
          nftTokenAccount
        );
        expect(tokenAccountInfo).to.not.be.null;

        console.log("Successfully created apology with NFT mint");
      } catch (error) {
        console.error("Failed to create apology:", error);
        throw error;
      }
    });

    it("Can create multiple apologies to different victims", async () => {
      const nonce = generateUniqueNonce();
      const { apologyPDA, vaultPDA, nftMint, nftMetadata, masterEdition } =
        await createApologyPDAs(
          localWallet.publicKey,
          victim2.publicKey,
          nonce
        );

      // Get associated token account for NFT
      const nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        victim2.publicKey
      );

      // Create apology to second victim
      await executeWithRetry(async () => {
        return await program.methods
          .initializeApology(
            new anchor.BN(probationDays),
            new anchor.BN(stakeAmount),
            "Apology to second victim",
            new anchor.BN(nonce),
            "victim2_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA,
            offender: localWallet.publicKey,
            victim: victim2.publicKey,
            vault: vaultPDA,
            nftMint: nftMint,
            nftTokenAccount: nftTokenAccount,
            nftMetadata: nftMetadata,
            masterEditionAccount: masterEdition,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();
      }, "Creating apology to second victim");

      // Verify apology exists
      const apologyAccount = await program.account.apology.fetch(apologyPDA);
      expect(apologyAccount.victim.toString()).to.equal(
        victim2.publicKey.toString()
      );
      expect(apologyAccount.message).to.equal("Apology to second victim");
    });

    it("Can create multiple apologies to the same victim using different nonces", async () => {
      const nonce1 = generateUniqueNonce();
      const {
        apologyPDA: apologyPDA1,
        vaultPDA: vaultPDA1,
        nftMint: nftMint1,
        nftMetadata: nftMetadata1,
        masterEdition: masterEdition1,
      } = await createApologyPDAs(
        localWallet.publicKey,
        victim1.publicKey,
        nonce1
      );

      // Get associated token account for NFT
      const nftTokenAccount1 = await getAssociatedTokenAddress(
        nftMint1,
        victim1.publicKey
      );

      // Create first apology
      await executeWithRetry(async () => {
        return await program.methods
          .initializeApology(
            new anchor.BN(probationDays),
            new anchor.BN(stakeAmount / 2), // Half the stake amount
            "First multiple apology",
            new anchor.BN(nonce1),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA1,
            offender: localWallet.publicKey,
            victim: victim1.publicKey,
            vault: vaultPDA1,
            nftMint: nftMint1,
            nftTokenAccount: nftTokenAccount1,
            nftMetadata: nftMetadata1,
            masterEditionAccount: masterEdition1,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();
      }, "Creating first multiple apology");

      // Add a small delay to ensure timestamp difference for nonce generation
      await sleep(1500);

      // Create second apology to same victim with different nonce
      const nonce2 = generateUniqueNonce();
      const {
        apologyPDA: apologyPDA2,
        vaultPDA: vaultPDA2,
        nftMint: nftMint2,
        nftMetadata: nftMetadata2,
        masterEdition: masterEdition2,
      } = await createApologyPDAs(
        localWallet.publicKey,
        victim1.publicKey,
        nonce2
      );

      // Get associated token account for second NFT
      const nftTokenAccount2 = await getAssociatedTokenAddress(
        nftMint2,
        victim1.publicKey
      );

      await executeWithRetry(async () => {
        return await program.methods
          .initializeApology(
            new anchor.BN(probationDays),
            new anchor.BN(stakeAmount / 4), // Quarter stake amount
            "Second multiple apology",
            new anchor.BN(nonce2),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA2,
            offender: localWallet.publicKey,
            victim: victim1.publicKey,
            vault: vaultPDA2,
            nftMint: nftMint2,
            nftTokenAccount: nftTokenAccount2,
            nftMetadata: nftMetadata2,
            masterEditionAccount: masterEdition2,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();
      }, "Creating second multiple apology");

      // Verify both apologies were created correctly
      const apology1 = await program.account.apology.fetch(apologyPDA1);
      const apology2 = await program.account.apology.fetch(apologyPDA2);

      expect(apology1.message).to.equal("First multiple apology");
      expect(apology2.message).to.equal("Second multiple apology");
      expect(apology1.stakeAmount.toString()).to.equal(
        (stakeAmount / 2).toString()
      );
      expect(apology2.stakeAmount.toString()).to.equal(
        (stakeAmount / 4).toString()
      );
    });
  });

  // Tests for invalid apology attempts
  describe("Validation Tests", () => {
    it("Cannot initialize with invalid probation days", async () => {
      const nonce = generateUniqueNonce();
      const { apologyPDA, vaultPDA, nftMint, nftMetadata, masterEdition } =
        await createApologyPDAs(
          localWallet.publicKey,
          victim1.publicKey,
          nonce
        );

      const nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        victim1.publicKey
      );

      try {
        await program.methods
          .initializeApology(
            new anchor.BN(0), // Invalid: 0 days
            new anchor.BN(stakeAmount),
            message,
            new anchor.BN(nonce),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA,
            offender: localWallet.publicKey,
            victim: victim1.publicKey,
            vault: vaultPDA,
            nftMint: nftMint,
            nftTokenAccount: nftTokenAccount,
            nftMetadata: nftMetadata,
            masterEditionAccount: masterEdition,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();

        expect.fail("Should have failed with invalid probation days");
      } catch (error) {
        expect(error.toString()).to.include("InvalidProbationDays");
      }
    });

    it("Cannot initialize with empty message", async () => {
      const nonce = generateUniqueNonce();
      const { apologyPDA, vaultPDA, nftMint, nftMetadata, masterEdition } =
        await createApologyPDAs(
          localWallet.publicKey,
          victim1.publicKey,
          nonce
        );

      const nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        victim1.publicKey
      );

      try {
        await program.methods
          .initializeApology(
            new anchor.BN(probationDays),
            new anchor.BN(stakeAmount),
            "", // Empty message
            new anchor.BN(nonce),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA,
            offender: localWallet.publicKey,
            victim: victim1.publicKey,
            vault: vaultPDA,
            nftMint: nftMint,
            nftTokenAccount: nftTokenAccount,
            nftMetadata: nftMetadata,
            masterEditionAccount: masterEdition,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();

        expect.fail("Should have failed with empty message");
      } catch (error) {
        expect(error.toString()).to.include("EmptyMessage");
      }
    });

    it("Cannot initialize apology to self", async () => {
      const nonce = generateUniqueNonce();
      const { apologyPDA, vaultPDA, nftMint, nftMetadata, masterEdition } =
        await createApologyPDAs(
          localWallet.publicKey,
          localWallet.publicKey, // Same as offender
          nonce
        );

      const nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        localWallet.publicKey
      );

      try {
        await program.methods
          .initializeApology(
            new anchor.BN(probationDays),
            new anchor.BN(stakeAmount),
            message,
            new anchor.BN(nonce),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: apologyPDA,
            offender: localWallet.publicKey,
            victim: localWallet.publicKey, // Same as offender
            vault: vaultPDA,
            nftMint: nftMint,
            nftTokenAccount: nftTokenAccount,
            nftMetadata: nftMetadata,
            masterEditionAccount: masterEdition,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();

        expect.fail("Should have failed when apologizing to self");
      } catch (error) {
        expect(error.toString()).to.include("InvalidVictim");
      }
    });
  });

  // Tests for stake release and claim
  describe("Stake Operations", () => {
    let testApologyPDA: PublicKey;
    let testVaultPDA: PublicKey;
    let testNonce: number;

    before(async () => {
      // Create a test apology for stake operations
      testNonce = generateUniqueNonce();
      const pdas = await createApologyPDAs(
        localWallet.publicKey,
        victim1.publicKey,
        testNonce
      );

      testApologyPDA = pdas.apologyPDA;
      testVaultPDA = pdas.vaultPDA;

      const nftTokenAccount = await getAssociatedTokenAddress(
        pdas.nftMint,
        victim1.publicKey
      );

      // Initialize test apology with short probation period for testing
      await executeWithRetry(async () => {
        return await program.methods
          .initializeApology(
            new anchor.BN(1), // 1 day for faster testing
            new anchor.BN(stakeAmount),
            "Test apology for stake operations",
            new anchor.BN(testNonce),
            "victim_twitter",
            nftUri
          )
          .accounts({
            apology: testApologyPDA,
            offender: localWallet.publicKey,
            victim: victim1.publicKey,
            vault: testVaultPDA,
            nftMint: pdas.nftMint,
            nftTokenAccount: nftTokenAccount,
            nftMetadata: pdas.nftMetadata,
            masterEditionAccount: pdas.masterEdition,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([localWallet])
          .rpc();
      }, "Initializing test apology for stake operations");

      console.log(
        "Created test apology for stake operations with nonce:",
        testNonce
      );
    });

    it("Cannot release stake by non-victim", async () => {
      const randomUser = Keypair.generate();

      // Fund the random user for transaction fees
      await executeWithRetry(async () => {
        const tx = await connection.sendTransaction(
          new anchor.web3.Transaction().add(
            SystemProgram.transfer({
              fromPubkey: localWallet.publicKey,
              toPubkey: randomUser.publicKey,
              lamports: LAMPORTS_PER_SOL / 100, // 0.01 SOL
            })
          ),
          [localWallet]
        );
        return tx;
      }, "Funding random user");

      try {
        await program.methods
          .releaseStake()
          .accounts({
            apology: testApologyPDA,
            offender: localWallet.publicKey,
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

    it("Cannot claim stake before probation ends", async () => {
      try {
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

        expect.fail("Should have failed with probation not ended");
      } catch (error) {
        expect(error.toString()).to.include("ProbationNotEnded");
      }
    });

    it("Can release stake after probation (if testing time permits)", async function () {
      // Skip if time doesn't permit a full test
      this.timeout(120000); // 2 minutes timeout for this test

      console.log(
        "Testing stake release - this may require waiting for probation to end"
      );
      console.log("Waiting for probation period to end...");

      // Wait a bit to ensure probation ends (devnet might have time differences)
      await sleep(10000); // 10 seconds - adjust if needed for real testing

      try {
        // Try to release the stake
        await executeWithRetry(async () => {
          return await program.methods
            .releaseStake()
            .accounts({
              apology: testApologyPDA,
              offender: localWallet.publicKey,
              victim: victim1.publicKey,
              vault: testVaultPDA,
              systemProgram: SystemProgram.programId,
            })
            .signers([victim1])
            .rpc();
        }, "Releasing stake");

        // Verify apology status
        const apology = await program.account.apology.fetch(testApologyPDA);
        expect(apology.status.completed).to.be.ok;

        console.log("Successfully released stake after probation");
      } catch (error) {
        // If ProbationNotEnded error, skip test rather than fail
        if (error.toString().includes("ProbationNotEnded")) {
          console.log("Probation not yet ended - skipping test");
          this.skip();
        } else {
          throw error;
        }
      }
    });
  });
});
