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
import { Wallet, Copy, LogOut, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const truncateAddress = (address: PublicKey | null): string => {
  if (!address) return "";
  const addressString = address.toBase58();
  return `${addressString.slice(0, 4)}...${addressString.slice(-4)}`;
};

export function WalletConnect() {
  const { publicKey, disconnect, connected } = useWallet();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58());
        setIsCopied(true);
        toast({
          title: "Address copied",
          description: "Wallet address copied to clipboard",
          className: "bg-background/95 backdrop-blur",
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

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setDropdownOpen(false);
      toast({
        title: "Disconnected",
        description: "Wallet disconnected successfully",
        className: "bg-background/95 backdrop-blur",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  }, [disconnect, toast]);

  const handleExplorerLink = useCallback(() => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
        "_blank"
      );
    }
  }, [publicKey]);

  const showMainnetInfo = () => {
    toast({
      title: "Mainnet Coming Soon",
      description:
        "We're currently running on Devnet. Mainnet support coming soon!",
      className: "bg-background/95 backdrop-blur",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {connected && (
        <Button
          variant="outline"
          size="sm"
          onClick={showMainnetInfo}
          className="hidden sm:flex hover:bg-primary/10 animate-pulse bg-background/50 backdrop-blur-sm border-primary/20"
        >
          Devnet
        </Button>
      )}

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={connected ? "outline" : "default"}
            className={`flex flex-row items-center justify-center transition-all duration-200 
              ${connected ? "hover:bg-background/80 hover:border-primary/30" : "hover:bg-primary/90"}
              ${dropdownOpen ? "ring-2 ring-primary/20" : ""}`}
            size="sm"
            onClick={() => !connected && setIsWalletDialogOpen(true)}
          >
            <Wallet
              className={`h-4 w-4 ${connected ? "text-primary/80" : ""}`}
            />
            {connected ? (
              <span className="ml-2 truncate font-medium">
                {truncateAddress(publicKey)}
              </span>
            ) : (
              <span className="ml-2 font-medium">Connect Wallet</span>
            )}
          </Button>
        </DropdownMenuTrigger>

        {connected && (
          <DropdownMenuContent
            // align="end"
            className="w-56 bg-background/95 backdrop-blur-lg border border-primary/20 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
          >
            <div className="px-2 pt-2 pb-1">
              <p className="text-xs text-muted-foreground">Connected wallet</p>
              <p className="text-sm font-medium truncate">
                {publicKey?.toBase58()}
              </p>
            </div>

            <DropdownMenuSeparator className="bg-primary/10" />

            <DropdownMenuItem
              onClick={handleCopyAddress}
              className="gap-2 focus:bg-primary/10 cursor-pointer"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{isCopied ? "Copied!" : "Copy Address"}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleExplorerLink}
              className="gap-2 focus:bg-primary/10 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Explorer</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-primary/10" />

            <DropdownMenuItem
              onClick={handleDisconnect}
              className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold">
              {connected ? "Change Wallet" : "Connect Wallet"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <WalletMultiButton className="wallet-adapter-button-trigger" />
            <Button
              variant="outline"
              onClick={() => setIsWalletDialogOpen(false)}
              className="hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
