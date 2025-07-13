/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `Bundle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bundle" DROP COLUMN "stripePriceId",
ADD COLUMN     "coinTransactionId" TEXT;

-- AlterTable
ALTER TABLE "BundleType" ADD COLUMN     "stripePriceId" TEXT;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_coinTransactionId_fkey" FOREIGN KEY ("coinTransactionId") REFERENCES "CoinTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
