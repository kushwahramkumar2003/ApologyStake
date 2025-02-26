"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Share2, Twitter, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProgram } from "../hook/use-program";
import { WalletConnect } from "@/components/wallet-connect";

// Constants from program
const MIN_PROBATION_DAYS = 1;
const MAX_PROBATION_DAYS = 60;
const MAX_MESSAGE_LENGTH = 200;

export default function CreatePage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const [loading, setLoading] = useState(false);
  const [victimWallet, setVictimWallet] = useState("");
  const [stakeAmount, setStakeAmount] = useState(1);
  const [probationDays, setProbationDays] = useState(30);
  const [message, setMessage] = useState("");
  const [shareOnTwitter, setShareOnTwitter] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [victimTwitter, setVictimTwitter] = useState("");

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!victimWallet) {
      newErrors.victim = "Victim wallet address is required";
    } else {
      try {
        new PublicKey(victimWallet);
      } catch {
        newErrors.victim = "Invalid wallet address";
      }
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    if (victimTwitter.trim() === "") {
      newErrors.victim = "Victim's Twitter handle is required";
    }

    if (stakeAmount <= 0) {
      newErrors.stake = "Stake amount must be greater than 0";
    }

    if (
      probationDays < MIN_PROBATION_DAYS ||
      probationDays > MAX_PROBATION_DAYS
    ) {
      newErrors.probation = `Probation days must be between ${MIN_PROBATION_DAYS} and ${MAX_PROBATION_DAYS}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [victimWallet, message, stakeAmount, probationDays, victimTwitter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey || !program) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setLoading(true);
      const victim = new PublicKey(victimWallet);

      const tx = await program.createApology({
        victim,
        probationDays,
        stakeAmount: stakeAmount * LAMPORTS_PER_SOL,
        message,
        victimTwitter,
      });

      toast.success("Apology created successfully!", {
        description: "Your apology has been recorded on the blockchain.",
      });

      if (shareOnTwitter) {
        const tweetText = `I've made a sincere apology and staked ${stakeAmount} SOL for ${probationDays} days to prove my commitment to change. View it on ApologyStake: ${window.location.origin}/apology/${tx}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
          "_blank"
        );
      }

      router.push("/dashboard");
      // eslint-disable-next-line
    } catch (error: any) {
      console.error("Error creating apology:", error);
      toast.error("Failed to create apology", {
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;

  if (!connected) {
    return (
      <div className="py-12">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to create an apology.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center py-12">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create Apology</CardTitle>
            <CardDescription>
              Create a tokenized apology by staking SOL and setting a probation
              period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="victim">Victim&apos;s Wallet Address</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>
                      Enter the Solana wallet address of the person you&apos;re
                      apologizing to.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="victim"
                placeholder="Enter Solana wallet address"
                value={victimWallet}
                onChange={(e) => setVictimWallet(e.target.value)}
                className={errors.victim ? "border-red-500" : ""}
                required
              />
              {errors.victim && (
                <p className="text-sm text-red-500 mt-1">{errors.victim}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="victim">Twitter Handle</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>
                      Enter the Twitter handle of the person you&apos;re
                      apologizing to.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="victimTwitter"
                placeholder="Enter Twitter handle"
                value={victimTwitter}
                onChange={(e) => setVictimTwitter(e.target.value)}
                className={errors.victim ? "border-red-500" : ""}
                required
              />
              {errors.victim && (
                <p className="text-sm text-red-500 mt-1">{errors.victim}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Apology Message</Label>
              <Textarea
                id="message"
                placeholder="Write your sincere apology here..."
                className={`min-h-[100px] ${errors.message ? "border-red-500" : ""}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{remainingChars} characters remaining</span>
                {errors.message && (
                  <span className="text-red-500">{errors.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Stake Amount (SOL)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>
                      The amount of SOL you&apos;ll stake as collateral for your
                      commitment.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[stakeAmount]}
                  onValueChange={(value) => setStakeAmount(value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className={`flex-1 ${errors.stake ? "border-red-500" : ""}`}
                />
                <span className="w-20 text-right">
                  {stakeAmount.toFixed(1)} SOL
                </span>
              </div>
              {errors.stake && (
                <p className="text-sm text-red-500 mt-1">{errors.stake}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Probation Period (Days)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p>
                      The duration you&apos;ll need to demonstrate improved
                      behavior.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[probationDays]}
                  onValueChange={(value) => setProbationDays(value[0])}
                  min={MIN_PROBATION_DAYS}
                  max={MAX_PROBATION_DAYS}
                  step={1}
                  className={`flex-1 ${errors.probation ? "border-red-500" : ""}`}
                />
                <span className="w-20 text-right">{probationDays} days</span>
              </div>
              {errors.probation && (
                <p className="text-sm text-red-500 mt-1">{errors.probation}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="share-twitter"
                checked={shareOnTwitter}
                onCheckedChange={setShareOnTwitter}
              />
              <Label
                htmlFor="share-twitter"
                className="flex items-center gap-2"
              >
                Share on Twitter <Twitter className="h-4 w-4" />
              </Label>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Once created, this apology will be recorded on the Solana
                blockchain and cannot be modified or deleted.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Dialog open={isPreview} onOpenChange={setIsPreview}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" /> Preview Apology
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preview Apology</DialogTitle>
                  <DialogDescription>
                    Review your apology before submitting
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">To</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {victimWallet}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Message</h4>
                    <p className="text-sm text-muted-foreground">{message}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Stake Amount</h4>
                      <p className="text-sm text-muted-foreground">
                        {stakeAmount} SOL
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Probation Period</h4>
                      <p className="text-sm text-muted-foreground">
                        {probationDays} days
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Apology...
                </>
              ) : (
                "Create Tokenized Apology"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
