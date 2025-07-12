/*
  Warnings:

  - You are about to drop the column `stripeCheckoutSessionId` on the `StripePayments` table. All the data in the column will be lost.
  - Added the required column `stripePaymentsId` to the `StripeProcessedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StripePayments" DROP CONSTRAINT "StripePayments_stripeProcessedEventId_fkey";

-- DropIndex
DROP INDEX "StripePayments_stripeCheckoutSessionId_key";

-- AlterTable
ALTER TABLE "StripePayments" DROP COLUMN "stripeCheckoutSessionId";

-- AlterTable
ALTER TABLE "StripeProcessedEvent" ADD COLUMN     "stripePaymentsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StripeProcessedEvent" ADD CONSTRAINT "StripeProcessedEvent_stripePaymentsId_fkey" FOREIGN KEY ("stripePaymentsId") REFERENCES "StripePayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
