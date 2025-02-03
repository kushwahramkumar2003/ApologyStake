-- CreateEnum
CREATE TYPE "ApologyStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "twitterId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apology" (
    "id" TEXT NOT NULL,
    "offenderId" TEXT NOT NULL,
    "victimWallet" TEXT NOT NULL,
    "contractAddr" TEXT NOT NULL,
    "stakeAmount" INTEGER NOT NULL,
    "nftCID" TEXT,
    "probationDays" INTEGER NOT NULL,
    "status" "ApologyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterId_key" ON "User"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Apology_contractAddr_key" ON "Apology"("contractAddr");

-- AddForeignKey
ALTER TABLE "Apology" ADD CONSTRAINT "Apology_offenderId_fkey" FOREIGN KEY ("offenderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
