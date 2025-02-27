"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Twitter,
  Copy,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useProgram } from "@/app/hook/use-program";
import ApologyPageSkeleton from "@/components/reusable/ApologyPageSkeleton";

interface Apology {
  publicKey: PublicKey;
  account: {
    offender: PublicKey;
    victim: PublicKey;
    stakeAmount: number;
    probationEnd: number;
    createdAt: number;
    // eslint-disable-next-line
    status: { active: {} } | { completed: {} };
    message: string;
  };
}

interface TimelineEvent {
  date: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ApologyPage() {
  const params = useParams();
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const [apology, setApology] = useState<Apology | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedApologies, setRelatedApologies] = useState<Apology[]>([]);

  const apologyId = params.id as string;

  const loadApology = useCallback(async () => {
    try {
      setLoading(true);
      if (!program) return;

      const apologyPDA = new PublicKey(apologyId);
      const apologyAccount = await program.getApology(apologyPDA);

      if (!apologyAccount) {
        toast.error("Apology not found");
        return;
      }

      setApology({
        publicKey: apologyPDA,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // @ts-expect-error - Type 'Account' is not assignable to type 'ApologyAccount'
        account: apologyAccount,
      });

      const related = await program.getApologiesByOffender(
        apologyAccount.offender
      );
      setRelatedApologies(
        // @ts-expect-error - Type 'Account[]' is not assignable to type 'Apology[]'
        related.filter((a) => a.publicKey.toString() !== apologyId).slice(0, 3)
      );
    } catch (error) {
      console.error("Error loading apology:", error);
      toast.error("Failed to load apology");
    } finally {
      setLoading(false);
    }
  }, [apologyId, program]);

  useEffect(() => {
    loadApology();
  }, [apologyId, loadApology]);

  const handleRelease = async () => {
    if (!apology || !program) return;

    try {
      await program.releaseStake(apology.publicKey);
      toast.success("Stake released successfully");
      loadApology();
    } catch (error) {
      console.error("Error releasing stake:", error);
      toast.error("Failed to release stake");
    }
  };

  const handleClaim = async () => {
    if (!apology || !program) return;

    try {
      await program.claimStake(apology.publicKey);
      toast.success("Stake claimed successfully");
      loadApology();
    } catch (error) {
      console.error("Error claiming stake:", error);
      toast.error("Failed to claim stake");
    }
  };

  const shareOnTwitter = () => {
    if (!apology) return;
    const tweetText = `Viewing an apology on ApologyStake with ${(apology.account.stakeAmount / LAMPORTS_PER_SOL).toFixed(2)} SOL staked. Check it out: ${window.location.href}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank"
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const now = Date.now() / 1000;
  const probationProgress = useMemo(() => {
    if (!apology) return 0;
    if (now >= apology.account.probationEnd) return 100;
    const total = apology.account.probationEnd - apology.account.createdAt;
    const elapsed = now - apology.account.createdAt;
    return Math.min(100, (elapsed / total) * 100);
  }, [apology, now]);

  const daysRemaining = useMemo(() => {
    if (!apology) return 0;
    if (now >= apology.account.probationEnd) return 0;
    return Math.ceil((apology.account.probationEnd - now) / (24 * 60 * 60));
  }, [apology, now]);

  const timeline: TimelineEvent[] = useMemo(() => {
    if (!apology) return [];

    const events: TimelineEvent[] = [
      {
        date: apology.account.createdAt,
        title: "Apology Created",
        description: "The apology was created and SOL was staked",
        icon: <Shield className="h-4 w-4" />,
      },
    ];

    if (now >= apology.account.probationEnd) {
      events.push({
        date: apology.account.probationEnd,
        title: "Probation Ended",
        description: "The probation period has concluded",
        icon: <Clock className="h-4 w-4" />,
      });
    }

    if ("completed" in apology.account.status) {
      events.push({
        date: apology.account.probationEnd,
        title: "Apology Completed",
        description: "The stake was released or claimed",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    }

    return events.sort((a, b) => b.date - a.date);
  }, [apology, now]);

  const isVictim = useMemo(() => {
    if (!apology || !publicKey) return false;
    return apology.account.victim.equals(publicKey);
  }, [apology, publicKey]);

  // eslint-disable-next-line
  const isOffender = useMemo(() => {
    if (!apology || !publicKey) return false;
    return apology.account.offender.equals(publicKey);
  }, [apology, publicKey]);

  if (loading) {
    return <ApologyPageSkeleton />;
  }

  if (!connected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to interact with this apology
              </p>
            </div>
          </div>
          <Button>Connect Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  if (!apology) {
    return (
      <div className="py-12 flex items-center justify-between">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">Apology Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The apology you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = "active" in apology.account.status;
  const probationEnded = now >= apology.account.probationEnd;

  return (
    <div className="flex flex-col items-center justify-between py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy link</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnTwitter}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on Twitter</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    Apology Details
                    <Badge variant={isActive ? "secondary" : "default"}>
                      {isActive ? "Active" : "Completed"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Created{" "}
                    {formatDistanceToNow(apology.account.createdAt * 1000)} ago
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    From
                  </h3>
                  <HoverCard>
                    <HoverCardTrigger className="flex items-center gap-2">
                      <div className="font-mono">
                        {apology.account.offender.toString()}
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <p className="text-sm">View on Solana Explorer</p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <a
                            href={`https://explorer.solana.com/address/${apology.account.offender.toString()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Explorer
                          </a>
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    To
                  </h3>
                  <HoverCard>
                    <HoverCardTrigger className="flex items-center gap-2">
                      <div className="font-mono">
                        {apology.account.victim.toString()}
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <p className="text-sm">View on Solana Explorer</p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <a
                            href={`https://explorer.solana.com/address/${apology.account.victim.toString()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Explorer
                          </a>
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Message
                </h3>
                <p className="text-sm rounded-lg border bg-muted/50 p-4">
                  {apology.account.message}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Probation Progress
                  </h3>
                  <span className="text-sm">
                    {Math.floor(probationProgress)}%
                  </span>
                </div>
                <Progress value={probationProgress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Started {format(apology.account.createdAt * 1000, "PPP")}
                  </span>
                  <span>
                    {probationEnded
                      ? "Probation ended"
                      : `${daysRemaining} days remaining`}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Staked Amount</h3>
                    <p className="text-2xl font-bold">
                      {(apology.account.stakeAmount / LAMPORTS_PER_SOL).toFixed(
                        2
                      )}{" "}
                      SOL
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Timeline
                </h3>
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 rounded-full bg-muted p-1">
                        {event.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date * 1000, "PPP")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            {isVictim && isActive && probationEnded && (
              <CardFooter className="flex gap-2">
                <Button
                  onClick={handleRelease}
                  className="flex-1"
                  variant="outline"
                >
                  Release Stake
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      Claim Stake
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Claim Stake Confirmation
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to claim the staked SOL? This
                        action cannot be undone and indicates that the offender
                        has not shown sufficient improvement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClaim}>
                        Claim Stake
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {relatedApologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Related Apologies</CardTitle>
                <CardDescription>
                  Other apologies between these parties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedApologies.map((related) => (
                    <Link
                      key={related.publicKey.toString()}
                      href={`/apology/${related.publicKey.toString()}`}
                      className="block"
                    >
                      <Card>
                        <CardHeader className="space-y-0 p-4">
                          <CardDescription>
                            Created{" "}
                            {formatDistanceToNow(
                              related.account.createdAt * 1000
                            )}{" "}
                            ago
                          </CardDescription>
                          <CardTitle className="text-sm">
                            {(
                              related.account.stakeAmount / LAMPORTS_PER_SOL
                            ).toFixed(2)}{" "}
                            SOL Staked
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!connected && (
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to interact with this apology
                  </p>
                </div>
              </div>
              <Button>Connect Wallet</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
