"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  className?: string;
  variant?: "default" | "large";
}

const WalletButton = ({
  className,
  variant = "default",
}: WalletButtonProps) => {
  const variants = {
    default: cn(
      "!bg-primary hover:!bg-primary/90",
      "!h-10 !px-4 !rounded-md",
      "!transition-all !duration-200"
    ),
    large: cn(
      "!bg-primary hover:!bg-primary/90",
      "!h-12 !px-6 !rounded-lg !text-lg",
      "!transition-all !duration-200"
    ),
  };

  return (
    <WalletMultiButton
      className={cn(
        variants[variant],
        "!font-medium !text-primary-foreground",
        "!border !border-primary/10",
        "!shadow-sm hover:!shadow-md",
        className
      )}
    />
  );
};

export { WalletButton };
