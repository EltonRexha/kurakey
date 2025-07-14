-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_bundleTypeId_fkey";

-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_coinPackageId_fkey";

-- AlterTable
ALTER TABLE "StripePayments" ALTER COLUMN "bundleTypeId" DROP NOT NULL,
ALTER COLUMN "coinPackageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_coinPackageId_fkey" FOREIGN KEY ("coinPackageId") REFERENCES "CoinPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
