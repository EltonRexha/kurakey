/*
  Warnings:

  - Added the required column `bundleTypeId` to the `StripePayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coinPackageId` to the `StripePayments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripePayments" ADD COLUMN     "bundleTypeId" TEXT NOT NULL,
ADD COLUMN     "coinPackageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_coinPackageId_fkey" FOREIGN KEY ("coinPackageId") REFERENCES "CoinPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
