/*
  Warnings:

  - You are about to drop the column `stripeProcessedEventId` on the `StripePayments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StripePayments_stripeProcessedEventId_idx";

-- AlterTable
ALTER TABLE "StripePayments" DROP COLUMN "stripeProcessedEventId";
