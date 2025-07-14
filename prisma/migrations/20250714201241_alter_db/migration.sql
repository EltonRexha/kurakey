/*
  Warnings:

  - The values [PENDING,CANCELLED] on the enum `StripePaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StripePaymentStatus_new" AS ENUM ('COMPLETED', 'FAILED');
ALTER TABLE "StripePayments" ALTER COLUMN "status" TYPE "StripePaymentStatus_new" USING ("status"::text::"StripePaymentStatus_new");
ALTER TYPE "StripePaymentStatus" RENAME TO "StripePaymentStatus_old";
ALTER TYPE "StripePaymentStatus_new" RENAME TO "StripePaymentStatus";
DROP TYPE "StripePaymentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Chest" ADD COLUMN     "bundleId" TEXT;

-- CreateIndex
CREATE INDEX "Chest_bundleId_idx" ON "Chest"("bundleId");

-- CreateIndex
CREATE INDEX "StripePayments_bundleId_idx" ON "StripePayments"("bundleId");

-- CreateIndex
CREATE INDEX "StripePayments_bundleTypeId_idx" ON "StripePayments"("bundleTypeId");

-- CreateIndex
CREATE INDEX "StripePayments_coinPackageId_idx" ON "StripePayments"("coinPackageId");

-- CreateIndex
CREATE INDEX "StripePayments_paymentIntentId_idx" ON "StripePayments"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
