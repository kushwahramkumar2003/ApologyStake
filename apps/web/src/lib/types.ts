export interface Apology {
  id: string;
  offenderWallet: string;
  victimWallet: string;
  message: string;
  stakeAmount: number;
  probationDays: number;
  createdAt: Date;
  status: "ACTIVE" | "COMPLETED";
  nftMetadataCID?: string;
}
