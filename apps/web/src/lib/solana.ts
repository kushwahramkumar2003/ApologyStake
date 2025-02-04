import {
  type Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";

// This would be your deployed program ID
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID");

export async function initializeApology(
  connection: Connection,
  wallet: any,
  victim: string,
  probationDays: number,
  stakeAmount: number
) {
  try {
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, PROGRAM_ID, provider);

    const [apologyPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("apology"),
        provider.wallet.publicKey.toBuffer(),
        new PublicKey(victim).toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .initializeApology(
        new PublicKey(victim),
        probationDays,
        stakeAmount * LAMPORTS_PER_SOL
      )
      .accounts({
        apologyAccount: apologyPDA,
        offender: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { success: true, txId: tx };
  } catch (error) {
    console.error("Error initializing apology:", error);
    return { success: false, error };
  }
}

export async function releaseStake(
  connection: Connection,
  wallet: any,
  apologyId: string
) {
  try {
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, PROGRAM_ID, provider);

    const tx = await program.methods
      .releaseStake()
      .accounts({
        apologyAccount: new PublicKey(apologyId),
        victim: provider.wallet.publicKey,
      })
      .rpc();

    return { success: true, txId: tx };
  } catch (error) {
    console.error("Error releasing stake:", error);
    return { success: false, error };
  }
}

// Add your program's IDL here
const IDL = {
  // Your program's interface definition
};
