import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { victimWallet, contractAddr, stakeAmount, probationDays, nftCID } =
      data;

    const apology = await prisma.apology.create({
      data: {
        offender: { connect: { id: session.user.id } },
        victimWallet,
        contractAddr,
        stakeAmount,
        probationDays,
        nftCID,
      },
    });

    return NextResponse.json(apology);
  } catch (error) {
    console.error("Error creating apology:", error);
    return NextResponse.json(
      { error: "Failed to create apology" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("wallet");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const apologies = await prisma.apology.findMany({
      where: {
        OR: [
          { offender: { wallet: walletAddress } },
          { victimWallet: walletAddress },
        ],
      },
      include: {
        offender: {
          select: {
            wallet: true,
          },
        },
      },
    });

    return NextResponse.json(apologies);
  } catch (error) {
    console.error("Error fetching apologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch apologies" },
      { status: 500 }
    );
  }
}
