-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_bundleId_fkey";

-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_userCoinPackageId_fkey";

-- AlterTable
ALTER TABLE "StripePayments" ALTER COLUMN "bundleId" DROP NOT NULL,
ALTER COLUMN "userCoinPackageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_userCoinPackageId_fkey" FOREIGN KEY ("userCoinPackageId") REFERENCES "UserCoinPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
