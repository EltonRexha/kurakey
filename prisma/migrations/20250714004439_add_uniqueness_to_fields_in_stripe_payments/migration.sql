/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntentId]` on the table `StripePayments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chargeId]` on the table `StripePayments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_paymentIntentId_key" ON "StripePayments"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_chargeId_key" ON "StripePayments"("chargeId");
