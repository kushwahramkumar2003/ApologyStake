"use client";

import config from "@/config";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SessionProvider } from "next-auth/react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";

const WalletModalProviderDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletModalProvider
    ),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  return (
    <SessionProvider>
      <ConnectionProvider endpoint={config.rpcEndpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProviderDynamic>{children}</WalletModalProviderDynamic>
        </WalletProvider>
      </ConnectionProvider>
    </SessionProvider>
  );
}
