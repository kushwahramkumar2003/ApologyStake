import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ApologyStake - Tokenized Apology Protocol",
  description:
    "Make meaningful apologies with real accountability through blockchain technology",
  keywords: [
    "blockchain",
    "apology",
    "solana",
    "smart contract",
    "accountability",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "w-full max-w-[2000px] mx-auto",
          "px-4 sm:px-6 lg:px-8",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <main className="flex-1 relative z-10">
              <SiteHeader />
              {children}
            </main>
            <Toaster2 />
            <Toaster richColors position="top-center" className="z-50" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
