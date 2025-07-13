/*
  Warnings:

  - A unique constraint covering the columns `[coinTransactionId]` on the table `UserCoinPackage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCoinPackage_coinTransactionId_key" ON "UserCoinPackage"("coinTransactionId");
