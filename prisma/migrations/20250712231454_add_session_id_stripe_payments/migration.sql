/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `StripePayments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `StripePayments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripePayments" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_sessionId_key" ON "StripePayments"("sessionId");
