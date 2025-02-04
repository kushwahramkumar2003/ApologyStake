"use client";

import config from "@/config";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SessionProvider } from "next-auth/react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  return (
    <SessionProvider>
      <ConnectionProvider endpoint={config.rpcEndpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SessionProvider>
  );
}
