import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SiteHeader } from "@/components/site-header";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const DynamicProvider = dynamic(
  () => import("@/components/Providers").then((mod) => mod.Providers),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "ApologyStake - Tokenized Apology Protocol",
  description:
    "Make meaningful apologies with real accountability through blockchain technology. ApologyStake leverages Solana smart contracts to tokenize apologies, ensuring transparency and social accountability.",
  keywords: [
    "blockchain",
    "apology",
    "solana",
    "smart contract",
    "accountability",
    "tokenized apology",
    "crypto apologies",
    "decentralized apologies",
    "Web3",
  ],
  authors: [{ name: "Ramkumar Kushwah" }],
  metadataBase: new URL("https://apology-stake.vercel.app"),
  openGraph: {
    title: "ApologyStake - Tokenized Apology Protocol",
    description:
      "Make meaningful apologies with real accountability through blockchain technology. ApologyStake leverages Solana smart contracts to tokenize apologies, ensuring transparency and social accountability.",
    url: "https://apology-stake.vercel.app",
    siteName: "ApologyStake",
    images: [
      {
        url: "/preview.jpeg",
        width: 1200,
        height: 630,
        alt: "ApologyStake Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApologyStake - Tokenized Apology Protocol",
    description:
      "Make meaningful apologies with real accountability through blockchain technology.",
    images: ["/preview.jpeg"],
    creator: "@ramkumar_9301",
  },
  alternates: {
    canonical: "https://apology-stake.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "w-full max-w-[2000px] mx-auto",
          "px-4 sm:px-6 lg:px-8",
          inter.className
        )}
      >
        <DynamicProvider>
          <main className="flex-1 relative z-10">
            <SiteHeader />
            {children}
          </main>
          <Toaster2 />
          <Toaster richColors position="top-center" className="z-50" />
        </DynamicProvider>
      </body>
    </html>
  );
}
