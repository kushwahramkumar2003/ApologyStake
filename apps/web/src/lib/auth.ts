import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";

import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import config from "@/config";

const SigninSchema = z.object({
  publicKey: z.string(),
  signature: z.any(),
  nonce: z.string(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "signin",
      id: "signin",
      credentials: {
        publicKey: { label: "PublicKey", type: "string" },
        signature: { label: "Signature", type: "string" },
        nonce: { label: "Nonce", type: "string" },
      },
      async authorize(credentials) {
        try {
          const parsedData = SigninSchema.safeParse(credentials);

          if (!parsedData.success) {
            console.error("Invalid input fields:", parsedData.error);
            return null;
          }

          const { publicKey, signature, nonce } = parsedData.data;

          const message = new TextEncoder().encode(
            `Sign this message to authenticate with ApologyStake\nNonce: ${nonce}`
          );

          const signatureUint8 = bs58.decode(signature);
          const publicKeyBytes = new PublicKey(publicKey).toBytes();

          const verified = nacl.sign.detached.verify(
            message,
            signatureUint8,
            publicKeyBytes
          );

          if (!verified) {
            console.error("Invalid signature");
            return null;
          }
          console.log("Signature verified");
          return {
            id: publicKey,
            name: "User",
            email: "",
            publicKey,
          };
        } catch (error) {
          console.error("Failed to sign in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // console.log("JWT Callback", token, user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.publicKey = user.publicKey;
      }
      return token;
    },
    session({ session, token }) {
      // console.log("Session Callback", session, token);
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.publicKey = token.publicKey;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge:
      typeof config?.authTokenExpirationTime === "number"
        ? config.authTokenExpirationTime
        : 60 * 60 * 24 * 7, // 7 days
  },
  secret: config.nextAuthSecret,
};
