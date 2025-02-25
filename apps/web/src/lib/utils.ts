import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatSOL(amount: number) {
  return `${amount.toFixed(2)} SOL`;
}

/**
 * Helper function to generate a complete Metaplex metadata URI
 * @param cid IPFS Content Identifier
 * @returns Complete URI to the metadata
 */
export function getMetaplexURI(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}
