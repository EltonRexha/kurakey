/*
  Warnings:

  - The values [CANCELLED] on the enum `StripePaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StripePaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
ALTER TABLE "StripePayments" ALTER COLUMN "status" TYPE "StripePaymentStatus_new" USING ("status"::text::"StripePaymentStatus_new");
ALTER TYPE "StripePaymentStatus" RENAME TO "StripePaymentStatus_old";
ALTER TYPE "StripePaymentStatus_new" RENAME TO "StripePaymentStatus";
DROP TYPE "StripePaymentStatus_old";
COMMIT;
