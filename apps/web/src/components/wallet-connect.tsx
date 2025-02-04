"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, Copy, LogOut, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";

// Improved type-safe truncate function
const truncateAddress = (address: PublicKey | null): string => {
  if (!address) return "";
  const addressString = address.toBase58();
  return `${addressString.slice(0, 4)}...${addressString.slice(-4)}`;
};

export function WalletConnect() {
  const { publicKey, disconnect, connected } = useWallet();

  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Improved copy address handler
  const handleCopyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58());
        setIsCopied(true);
        toast({
          title: "Address copied",
          description: "Wallet address copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        toast({
          title: "Error",
          description: "Failed to copy address",
          variant: "destructive",
        });
      }
    }
  }, [publicKey, toast]);

  // Disconnect handler with error handling
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      // setBalance(null);
      toast({
        title: "Disconnected",
        description: "Wallet disconnected successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  }, [disconnect, toast]);

  return (
    <div className="flex items-center gap-2">
      {connected && (
        <Badge variant="outline" className="hidden sm:flex">
          Devnet
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={connected ? "outline" : "default"}
            className="min-w-[180px] justify-between"
            size="sm"
            onClick={() => setIsWalletDialogOpen(true)}
          >
            <Wallet className="h-4 w-4" />
            {connected ? (
              <span className="ml-2 truncate">
                {truncateAddress(publicKey)}
              </span>
            ) : (
              <span className="ml-2">Connect Wallet</span>
            )}
          </Button>
        </DropdownMenuTrigger>

        {connected && (
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleCopyAddress} className="gap-2">
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{isCopied ? "Copied!" : "Copy Address"}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleDisconnect}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {connected ? "Change Wallet" : "Connect Wallet"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <WalletMultiButton className="wallet-adapter-button-trigger" />
            <Button
              variant="outline"
              onClick={() => setIsWalletDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
