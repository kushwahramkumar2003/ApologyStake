import {
  type Connection,
  type Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export async function airdropSol(
  connection: Connection,
  wallet: Keypair,
  amount = 10
) {
  const signature = await connection.requestAirdrop(
    wallet.publicKey,
    amount * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
}

export async function createNftForTesting(
  connection: Connection,
  payer: Keypair,
  owner: Keypair
) {
  // Implementation for creating test NFTs
  // This would include minting an NFT and setting up token accounts
}

export function mockProgramError(name: string, msg: string, code: string) {
  return new Error(`Program Error: ${name} - ${msg} (${code})`);
}
