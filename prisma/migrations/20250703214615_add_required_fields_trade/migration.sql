/*
  Warnings:

  - You are about to drop the column `userAId` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_userAId_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "userAId",
ADD COLUMN     "receiverConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiverReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "senderReady" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
