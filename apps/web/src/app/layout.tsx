import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SiteHeader } from "@/components/site-header";
import dynamic from "next/dynamic";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
  author: "Ramkumar Kushwah", 
  url: "https://apology-stake.vercel.app",
  image: "/preview.jpeg", 
};

const DynamicProvider = dynamic(
  () => import("@/components/Providers").then((mod) => mod.Providers),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:url" content={metadata.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
        <link rel="canonical" href={metadata.url} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>
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