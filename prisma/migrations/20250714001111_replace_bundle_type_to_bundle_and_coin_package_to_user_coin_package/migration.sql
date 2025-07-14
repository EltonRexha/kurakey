/*
  Warnings:

  - You are about to drop the column `bundleTypeId` on the `StripePayments` table. All the data in the column will be lost.
  - You are about to drop the column `coinPackageId` on the `StripePayments` table. All the data in the column will be lost.
  - Added the required column `bundleId` to the `StripePayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCoinPackageId` to the `StripePayments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_bundleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_coinPackageId_fkey";

-- AlterTable
ALTER TABLE "StripePayments" DROP COLUMN "bundleTypeId",
DROP COLUMN "coinPackageId",
ADD COLUMN     "bundleId" TEXT NOT NULL,
ADD COLUMN     "userCoinPackageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_userCoinPackageId_fkey" FOREIGN KEY ("userCoinPackageId") REFERENCES "UserCoinPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
