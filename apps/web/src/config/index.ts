// import idl from "@repo/patreonix_programms/idl";
// import { PublicKey } from "@solana/web3.js";

export const config = {
  // rpcEndpoint:
  //   process.env.NODE_ENV === "development"
  //     ? "http://127.0.0.1:8899"
  //     : process.env.RPC_URL || "https://api.devnet.solana.com",
  rpcEndpoint: "https://api.devnet.solana.com",

  //   programId: new PublicKey(idl.address),
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "next-auth-secret",
  authTokenExpirationTime:
    process.env.AUTH_TOKEN_EXPIRATION_TIME || 60 * 60 * 24 * 1,
  pinataApiKey: process.env.PINATA_API_KEY || "pinata-api-key",
  pinataApiSecret: process.env.PINATA_API_SECRET || "pinata",
  pinataJwt: process.env.PINATA_JWT || "",
};

export default config;
