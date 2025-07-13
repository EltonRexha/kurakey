/*
  Warnings:

  - You are about to drop the `StripeProcessedEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeProcessedEvent" DROP CONSTRAINT "StripeProcessedEvent_stripePaymentsId_fkey";

-- DropTable
DROP TABLE "StripeProcessedEvent";

-- CreateTable
CREATE TABLE "StripeEvents" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripePaymentsId" TEXT NOT NULL,

    CONSTRAINT "StripeEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeEvents_eventId_key" ON "StripeEvents"("eventId");

-- AddForeignKey
ALTER TABLE "StripeEvents" ADD CONSTRAINT "StripeEvents_stripePaymentsId_fkey" FOREIGN KEY ("stripePaymentsId") REFERENCES "StripePayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
