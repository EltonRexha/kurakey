/*
  Warnings:

  - You are about to drop the column `bundleId` on the `StripePayments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_bundleId_fkey";

-- AlterTable
ALTER TABLE "StripePayments" DROP COLUMN "bundleId",
ADD COLUMN     "bundleTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
