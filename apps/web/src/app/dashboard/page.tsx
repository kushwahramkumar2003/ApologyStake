"use client";

import { ApologyCard } from "@/components/apology-card";
import { WalletConnect } from "@/components/wallet-connect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This would normally come from your database
const mockApologies = [
  {
    id: "1",
    offenderWallet: "8xk3h2x9j2m1n5b7v4c8",
    victimWallet: "3k2j4h5g6f7d8s9a1",
    message: "I sincerely apologize for my actions during the team meeting...",
    stakeAmount: 2.5,
    probationDays: 30,
    createdAt: new Date(),
    status: "ACTIVE",
  },
  {
    id: "2",
    offenderWallet: "9m2n3b4v5c6x7z8",
    victimWallet: "1a2s3d4f5g6h7j8k9l",
    message:
      "I apologize for the miscommunication regarding the project deadline...",
    stakeAmount: 1.5,
    probationDays: 14,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "COMPLETED",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-2xl font-bold">TAP</div>
          <WalletConnect />
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your apologies and stakes
            </p>
          </div>
          <Tabs defaultValue="sent">
            <TabsList>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="sent" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {mockApologies.map((apology) => (
                  <ApologyCard key={apology.id} apology={apology} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="received" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* This would show apologies received by the current user */}
                <p className="text-muted-foreground col-span-2 text-center py-12">
                  No apologies received yet
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
