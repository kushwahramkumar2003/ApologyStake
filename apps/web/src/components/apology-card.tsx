import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSOL, truncateAddress } from "@/lib/utils";
import { Clock, Share2 } from "lucide-react";

interface ApologyCardProps {
  apology: {
    id: string;
    offenderWallet: string;
    victimWallet: string;
    message: string;
    stakeAmount: number;
    probationDays: number;
    createdAt: Date;
    status: "ACTIVE" | "COMPLETED";
  };
}

export function ApologyCard({ apology }: ApologyCardProps) {
  const daysLeft = Math.ceil(
    (new Date(apology.createdAt).getTime() +
      apology.probationDays * 24 * 60 * 60 * 1000 -
      Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Public Apology</CardTitle>
          <Badge
            variant={apology.status === "ACTIVE" ? "default" : "secondary"}
          >
            {apology.status}
          </Badge>
        </div>
        <CardDescription>
          From: {truncateAddress(apology.offenderWallet)}
          <br />
          To: {truncateAddress(apology.victimWallet)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{apology.message}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {daysLeft > 0 ? `${daysLeft} days left` : "Probation ended"}
          </div>
          <div>Stake: {formatSOL(apology.stakeAmount)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
