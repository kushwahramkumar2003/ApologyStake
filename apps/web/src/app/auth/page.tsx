"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WalletConnect } from "@/components/wallet-connect";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import bs from "bs58";

type AuthStage =
  | "initial"
  | "connecting"
  | "signing"
  | "verifying"
  | "success"
  | "error";

export default function AuthPage() {
  const router = useRouter();
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("initial");
  const [error, setError] = useState<string | null>(null);

  const generateNonce = useCallback(() => {
    try {
      return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (error) {
      console.error("Failed to generate nonce:", error);
      throw new Error("Failed to generate secure nonce");
    }
  }, []);

  const handleAuth = useCallback(async () => {
    // Reset states at the start
    setError(null);
    setIsLoading(true);
    setAuthStage("initial");

    try {
      // Check wallet connection
      if (!connected) {
        throw new Error("Please connect your wallet first");
      }

      // Check wallet capabilities
      if (!publicKey || !signMessage) {
        throw new Error("Wallet doesn't support message signing");
      }

      // Generate and sign message
      setAuthStage("signing");
      const nonce = generateNonce();
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with ApologyStake\nNonce: ${nonce}`
      );

      let signature;
      try {
        signature = await signMessage(message);
      } catch {
        // Handle user rejection or signing failure
        throw new Error("Message signing was cancelled or failed");
      }

      // Convert signature to base58
      const signatureBase58 = bs.encode(signature);

      // Verify signature
      setAuthStage("verifying");
      const response = await signIn("signin", {
        publicKey: publicKey.toBase58(),
        signature: signatureBase58,
        nonce,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      // Handle success
      setAuthStage("success");
      toast.success("Successfully authenticated");

      // Navigate to dashboard
      try {
        setTimeout(() => router.push("/dashboard"), 1000);
      } catch (routeError) {
        console.error("Navigation failed:", routeError);
        toast.error("Navigation failed, please try again");
      }
    } catch (error) {
      // Handle all errors
      console.error("Authentication error:", error);
      setAuthStage("error");
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );

      // Disconnect wallet on critical errors
      if (
        error instanceof Error &&
        (error.message.includes("support") ||
          error.message.includes("Authentication failed"))
      ) {
        disconnect();
      }
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signMessage, connected, generateNonce, router, disconnect]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setAuthStage("initial");
      setError(null);
      setIsLoading(false);
    }
  }, [connected]);

  const renderAuthStatus = () => {
    if (!connected) return null;

    switch (authStage) {
      case "signing":
        return (
          <Alert className="mb-4">
            <KeyRound className="h-4 w-4" />
            <AlertTitle>Signature Required</AlertTitle>
            <AlertDescription>
              Please sign the message in your wallet
            </AlertDescription>
          </Alert>
        );
      case "verifying":
        return (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Verifying Signature</AlertTitle>
            <AlertDescription>Confirming ownership...</AlertDescription>
          </Alert>
        );
      case "success":
        return (
          <Alert className="mb-4 border-green-500/50 bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Authentication Successful</AlertTitle>
            <AlertDescription>Redirecting to dashboard...</AlertDescription>
          </Alert>
        );
      case "error":
        return (
          error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center  min-h-screen  px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to ApologyStake</CardTitle>
          <CardDescription className="text-balance">
            Connect your wallet to continue. You&apos;ll need to sign a message
            to verify ownership.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {renderAuthStatus()}

          {!connected ? (
            <div className="space-y-4">
              <WalletConnect />
              {authStage === "error" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setAuthStage("initial");
                    setError(null);
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">
                  Connected Wallet
                </div>
                <div className="mt-1 font-mono text-sm break-all">
                  {publicKey?.toBase58()}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={isLoading || authStage === "success"}
                onClick={handleAuth}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {authStage === "signing"
                      ? "Waiting for Signature..."
                      : authStage === "verifying"
                        ? "Verifying..."
                        : "Authenticating..."}
                  </>
                ) : (
                  <>
                    Sign Message to Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            By connecting, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
