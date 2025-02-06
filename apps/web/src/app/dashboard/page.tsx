"use client";

import { useEffect, useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  Shield,
  MoreVertical,
  Twitter,
  Plus,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { Progress } from "@/components/ui/progress";
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
import { Skeleton } from "@/components/ui/skeleton";
import React from "react"; // Added import for React
import { useProgram } from "../hook/use-program";

interface Apology {
  publicKey: PublicKey;
  account: {
    offender: PublicKey;
    victim: PublicKey;
    stakeAmount: number;
    probationEnd: number;
    createdAt: number;
    status: { active: {} } | { completed: {} };
    message: string;
    victimTwitter: string;
  };
}

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const [loading, setLoading] = useState(true);
  const [sentApologies, setSentApologies] = useState<Apology[]>([]);
  const [receivedApologies, setReceivedApologies] = useState<Apology[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount">(
    "newest"
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (connected && publicKey && program) {
      loadApologies();
    }
  }, [connected, publicKey, program]);

  const loadApologies = async () => {
    try {
      setLoading(true);
      const [sent, received] = await Promise.all([
        program?.getApologiesByOffender(publicKey!),
        program?.getApologiesByVictim(publicKey!),
      ]);
      setSentApologies(
        (sent || []).map((item) => ({
          publicKey: item.publicKey,
          account: {
            offender: item.account.offender,
            victim: item.account.victim,
            stakeAmount: item.account.stakeAmount.toNumber(),
            probationEnd: item.account.probationEnd.toNumber(),
            createdAt: item.account.createdAt.toNumber(),
            status: item.account.status,
            message: item.account.message,
            victimTwitter: item.account.twitter,
          },
        }))
      );
      setReceivedApologies(
        (received || []).map((item) => ({
          publicKey: item.publicKey,
          account: {
            offender: item.account.offender,
            victim: item.account.victim,
            stakeAmount: item.account.stakeAmount.toNumber(),
            probationEnd: item.account.probationEnd.toNumber(),
            createdAt: item.account.createdAt.toNumber(),
            status: item.account.status,
            message: item.account.message,
            victimTwitter: item.account.twitter,
          },
        }))
      );
    } catch (error) {
      console.error("Error loading apologies:", error);
      toast.error("Failed to load apologies");
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (apology: Apology) => {
    try {
      if (!program) return;
      await toast.promise(program.releaseStake(apology.publicKey), {
        loading: "Releasing stake...",
        success: "Stake released successfully",
        error: "Failed to release stake",
      });
      await loadApologies();
    } catch (error) {
      console.error("Error releasing stake:", error);
    }
  };

  const handleClaim = async (apology: Apology) => {
    try {
      if (!program) return;
      await toast.promise(program.claimStake(apology.publicKey), {
        loading: "Claiming stake...",
        success: "Stake claimed successfully",
        error: "Failed to claim stake",
      });
      await loadApologies();
    } catch (error) {
      console.error("Error claiming stake:", error);
    }
  };

  const sortApologies = (apologies: Apology[]) => {
    return [...apologies].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return b.account.createdAt - a.account.createdAt;
        case "oldest":
          return a.account.createdAt - b.account.createdAt;
        case "amount":
          return b.account.stakeAmount - a.account.stakeAmount;
        default:
          return 0;
      }
    });
  };

  const stats = useMemo(() => {
    const active = sentApologies.filter(
      (a) => "active" in a.account.status
    ).length;
    const completed = sentApologies.filter(
      (a) => "completed" in a.account.status
    ).length;
    const totalStaked = sentApologies.reduce(
      (sum, a) => sum + a.account.stakeAmount,
      0
    );
    return { active, completed, totalStaked };
  }, [sentApologies]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApologies();
    setRefreshing(false);
  };

  if (!connected) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your apologies.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your apologies and stakes
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                New Apology
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Active Apologies"
            value={stats.active}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          />
          <StatsCard
            title="Total Staked"
            value={`${(stats.totalStaked / LAMPORTS_PER_SOL).toFixed(2)} SOL`}
            icon={<Shield className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Tabs defaultValue="sent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort by</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("amount")}>
                  Highest stake
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="sent" className="mt-6">
            <ApologyList
              apologies={sortApologies(sentApologies)}
              loading={loading}
              type="sent"
            />
          </TabsContent>

          <TabsContent value="received" className="mt-6">
            <ApologyList
              apologies={sortApologies(receivedApologies)}
              loading={loading}
              type="received"
              onRelease={handleRelease}
              onClaim={handleClaim}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function ApologyList({
  apologies,
  loading,
  type,
  onRelease,
  onClaim,
}: {
  apologies: Apology[];
  loading: boolean;
  type: "sent" | "received";
  onRelease?: (apology: Apology) => void;
  onClaim?: (apology: Apology) => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[100px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (apologies.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">No apologies {type}</p>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t {type === "sent" ? "sent" : "received"} any
            apologies yet.
          </p>
          {type === "sent" && (
            <Button asChild className="mt-4">
              <Link href="/create">Create Your First Apology</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {apologies.map((apology) => (
        <ApologyCard
          key={apology.publicKey.toString()}
          apology={apology}
          type={type}
          onRelease={onRelease}
          onClaim={onClaim}
        />
      ))}
    </div>
  );
}

function ApologyCard({
  apology,
  type,
  onRelease,
  onClaim,
}: {
  apology: Apology;
  type: "sent" | "received";
  onRelease?: (apology: Apology) => void;
  onClaim?: (apology: Apology) => void;
}) {
  const now = Date.now() / 1000;
  const probationEnded = now >= apology.account.probationEnd;
  const isActive = "active" in apology.account.status;

  const probationProgress = useMemo(() => {
    if (probationEnded) return 100;
    const total = apology.account.probationEnd - apology.account.createdAt;
    const elapsed = now - apology.account.createdAt;
    return Math.min(100, (elapsed / total) * 100);
  }, [apology, now, probationEnded]);

  const daysRemaining = useMemo(() => {
    if (probationEnded) return 0;
    return Math.ceil((apology.account.probationEnd - now) / (24 * 60 * 60));
  }, [apology, now, probationEnded]);

  const shareOnTwitter = () => {
    const tweetText = `I've ${type === "sent" ? "sent" : "received"} an apology on ApologyStake with ${(
      apology.account.stakeAmount / LAMPORTS_PER_SOL
    ).toFixed(2)} SOL staked for ${differenceInDays(
      apology.account.probationEnd * 1000,
      apology.account.createdAt * 1000
    )} days. ${
      type === "sent" ? `To: @${apology.account.victimTwitter}` : ""
    } Check it out: ${window.location.origin}/apology/${apology.publicKey.toString()}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
      "_blank"
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Apology
              <Badge variant={isActive ? "secondary" : "default"}>
                {isActive ? "Active" : "Completed"}
              </Badge>
            </CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-2">
                {type === "sent" ? "To: " : "From: "}
                <span className="font-mono">
                  {(type === "sent"
                    ? apology.account.victim
                    : apology.account.offender
                  )
                    .toString()
                    .slice(0, 8)}
                  ...
                </span>
                {type === "sent" && (
                  <span className="font-mono">
                    Twitter: @{apology.account.victimTwitter}
                  </span>
                )}
              </div>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={shareOnTwitter}>
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/apology/${apology.publicKey.toString()}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {apology.account.message}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Probation Progress</span>
            <span>{Math.floor(probationProgress)}%</span>
          </div>
          <Progress value={probationProgress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Created {formatDistanceToNow(apology.account.createdAt * 1000)}{" "}
              ago
            </span>
            <span>
              {probationEnded
                ? "Probation ended"
                : `${daysRemaining} days remaining`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Ends {format(apology.account.probationEnd * 1000, "PPP")}
            </span>
          </div>
          <div>
            Stake: {(apology.account.stakeAmount / LAMPORTS_PER_SOL).toFixed(2)}{" "}
            SOL
          </div>
        </div>
      </CardContent>

      {type === "received" && isActive && probationEnded && (
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => onRelease?.(apology)}
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
                <AlertDialogTitle>Claim Stake Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to claim the staked SOL? This action
                  cannot be undone and indicates that the offender has not shown
                  sufficient improvement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onClaim?.(apology)}>
                  Claim Stake
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
