-- CreateEnum
CREATE TYPE "StripePaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "stripePriceId" TEXT;

-- AlterTable
ALTER TABLE "CoinPackage" ADD COLUMN     "stripePriceId" TEXT;

-- CreateTable
CREATE TABLE "StripePayments" (
    "id" TEXT NOT NULL,
    "status" "StripePaymentStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coinPackageId" TEXT,
    "bundleId" TEXT,
    "stripeProcessedEventId" TEXT NOT NULL,

    CONSTRAINT "StripePayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProcessedEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeProcessedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_stripeCheckoutSessionId_key" ON "StripePayments"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "StripePayments_userId_idx" ON "StripePayments"("userId");

-- CreateIndex
CREATE INDEX "StripePayments_stripeProcessedEventId_idx" ON "StripePayments"("stripeProcessedEventId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProcessedEvent_eventId_key" ON "StripeProcessedEvent"("eventId");

-- CreateIndex
CREATE INDEX "Bundle_userId_idx" ON "Bundle"("userId");

-- CreateIndex
CREATE INDEX "Bundle_bundleTypeId_idx" ON "Bundle"("bundleTypeId");

-- CreateIndex
CREATE INDEX "BundleTypeChestType_bundleTypeId_idx" ON "BundleTypeChestType"("bundleTypeId");

-- CreateIndex
CREATE INDEX "BundleTypeChestType_chestTypeId_idx" ON "BundleTypeChestType"("chestTypeId");

-- CreateIndex
CREATE INDEX "Chest_userId_idx" ON "Chest"("userId");

-- CreateIndex
CREATE INDEX "Chest_chestTypeId_idx" ON "Chest"("chestTypeId");

-- CreateIndex
CREATE INDEX "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");

-- CreateIndex
CREATE INDEX "CoinTransaction_chestTypeId_idx" ON "CoinTransaction"("chestTypeId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_tradeId_idx" ON "Notification"("tradeId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Trade_senderId_idx" ON "Trade"("senderId");

-- CreateIndex
CREATE INDEX "Trade_receiverId_idx" ON "Trade"("receiverId");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "Trade"("status");

-- CreateIndex
CREATE INDEX "UserCoinPackage_userId_idx" ON "UserCoinPackage"("userId");

-- CreateIndex
CREATE INDEX "UserCoinPackage_coinPackageId_idx" ON "UserCoinPackage"("coinPackageId");

-- CreateIndex
CREATE INDEX "UserCoinPackage_coinTransactionId_idx" ON "UserCoinPackage"("coinTransactionId");

-- CreateIndex
CREATE INDEX "UserRoom_userId_idx" ON "UserRoom"("userId");

-- CreateIndex
CREATE INDEX "UserRoom_roomId_idx" ON "UserRoom"("roomId");

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_coinPackageId_fkey" FOREIGN KEY ("coinPackageId") REFERENCES "CoinPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_stripeProcessedEventId_fkey" FOREIGN KEY ("stripeProcessedEventId") REFERENCES "StripeProcessedEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
