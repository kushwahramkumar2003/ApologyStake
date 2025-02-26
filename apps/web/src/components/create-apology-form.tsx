"use client";

import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";

export function CreateApologyForm() {
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(1);
  const [probationDays, setProbationDays] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast({
        title: "Apology Created",
        description:
          "Your apology has been tokenized and the stake has been locked.",
      });
    } catch (error) {
      console.error("Error creating apology:", error);
      toast({
        title: "Error",
        description: "Failed to create apology. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
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
            <Label htmlFor="victim">Victim&apos;s Wallet Address</Label>
            <Input
              id="victim"
              placeholder="Enter Solana wallet address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apology">Apology Message</Label>
            <Textarea
              id="apology"
              placeholder="Write your sincere apology here..."
              className="min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Stake Amount (SOL)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[stakeAmount]}
                onValueChange={(value) => setStakeAmount(value[0])}
                min={0.1}
                max={10}
                step={0.1}
                className="flex-1"
              />
              <span className="w-20 text-right">
                {stakeAmount.toFixed(1)} SOL
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Probation Period (Days)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[probationDays]}
                onValueChange={(value) => setProbationDays(value[0])}
                min={1}
                max={60}
                step={1}
                className="flex-1"
              />
              <span className="w-20 text-right">{probationDays} days</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Apology..." : "Create Tokenized Apology"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
