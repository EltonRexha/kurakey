-- CreateEnum
CREATE TYPE "StripePaymentStatus" AS ENUM ('COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ROOM_RECEIVED', 'CHEST_RECEIVED', 'XP_GAIN', 'FRIEND_REQUEST', 'TRADE_INVITE', 'TRADE_COMPLETED', 'ACHIEVEMENT', 'COIN_RECEIVED', 'OTHER');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CoinTransactionType" AS ENUM ('PURCHASE', 'REWARD', 'GIFT', 'OPEN_CHEST');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('UNCOMMON', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'SECRET');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('ZEN', 'NEON', 'MYSTIC', 'VOID', 'RAIN', 'INFERNO', 'COSMIC', 'URBAN', 'SANCTUM', 'ASCENSION', 'SECRET', 'ANIME');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "coinBalance" INTEGER NOT NULL DEFAULT 500,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "RoomCategory" NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "previewImageUrl" TEXT NOT NULL,
    "assetUrl" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoom" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChestType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "xpGain" INTEGER NOT NULL,

    CONSTRAINT "ChestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChestDropRate" (
    "id" TEXT NOT NULL,
    "chestTypeId" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "chance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChestDropRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chestTypeId" TEXT NOT NULL,
    "bundleId" TEXT,

    CONSTRAINT "Chest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "coinAmount" INTEGER NOT NULL,
    "stripePriceId" TEXT,

    CONSTRAINT "BundleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleTypeChestType" (
    "id" TEXT NOT NULL,
    "bundleTypeId" TEXT NOT NULL,
    "chestTypeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "BundleTypeChestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "bundleTypeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coinTransactionId" TEXT,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePayments" (
    "id" TEXT NOT NULL,
    "status" "StripePaymentStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "chargeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userCoinPackageId" TEXT,
    "bundleId" TEXT,
    "bundleTypeId" TEXT,
    "coinPackageId" TEXT,

    CONSTRAINT "StripePayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvents" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripePaymentsId" TEXT NOT NULL,

    CONSTRAINT "StripeEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "senderReady" BOOLEAN NOT NULL DEFAULT false,
    "receiverReady" BOOLEAN NOT NULL DEFAULT false,
    "senderConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "receiverConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "TradeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "CoinTransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chestTypeId" TEXT,

    CONSTRAINT "CoinTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendInvite" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "FriendInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "shown" BOOLEAN NOT NULL DEFAULT false,
    "xpAmount" INTEGER,
    "coinAmount" INTEGER,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chestTypeId" TEXT,
    "roomId" TEXT,
    "achievementId" TEXT,
    "tradeId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCoinPackage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coinPackageId" TEXT NOT NULL,
    "coinTransactionId" TEXT NOT NULL,

    CONSTRAINT "UserCoinPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinPackage" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stripePriceId" TEXT,
    "baseCoins" INTEGER NOT NULL,
    "bonusCoins" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unlockMessage" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_tradeSenderChests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_tradeSenderChests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_tradeReceiverChests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_tradeReceiverChests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_tradeSenderRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_tradeSenderRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_tradeReceiverRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_tradeReceiverRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AchievementToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AchievementToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_category_key" ON "Room"("name", "category");

-- CreateIndex
CREATE INDEX "UserRoom_userId_idx" ON "UserRoom"("userId");

-- CreateIndex
CREATE INDEX "UserRoom_roomId_idx" ON "UserRoom"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "ChestType_name_key" ON "ChestType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChestDropRate_chestTypeId_rarity_key" ON "ChestDropRate"("chestTypeId", "rarity");

-- CreateIndex
CREATE INDEX "Chest_userId_idx" ON "Chest"("userId");

-- CreateIndex
CREATE INDEX "Chest_chestTypeId_idx" ON "Chest"("chestTypeId");

-- CreateIndex
CREATE INDEX "Chest_bundleId_idx" ON "Chest"("bundleId");

-- CreateIndex
CREATE UNIQUE INDEX "BundleType_name_key" ON "BundleType"("name");

-- CreateIndex
CREATE INDEX "BundleTypeChestType_bundleTypeId_idx" ON "BundleTypeChestType"("bundleTypeId");

-- CreateIndex
CREATE INDEX "BundleTypeChestType_chestTypeId_idx" ON "BundleTypeChestType"("chestTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "BundleTypeChestType_bundleTypeId_chestTypeId_key" ON "BundleTypeChestType"("bundleTypeId", "chestTypeId");

-- CreateIndex
CREATE INDEX "Bundle_userId_idx" ON "Bundle"("userId");

-- CreateIndex
CREATE INDEX "Bundle_bundleTypeId_idx" ON "Bundle"("bundleTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_sessionId_key" ON "StripePayments"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_paymentIntentId_key" ON "StripePayments"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePayments_chargeId_key" ON "StripePayments"("chargeId");

-- CreateIndex
CREATE INDEX "StripePayments_userId_idx" ON "StripePayments"("userId");

-- CreateIndex
CREATE INDEX "StripePayments_bundleId_idx" ON "StripePayments"("bundleId");

-- CreateIndex
CREATE INDEX "StripePayments_bundleTypeId_idx" ON "StripePayments"("bundleTypeId");

-- CreateIndex
CREATE INDEX "StripePayments_coinPackageId_idx" ON "StripePayments"("coinPackageId");

-- CreateIndex
CREATE INDEX "StripePayments_paymentIntentId_idx" ON "StripePayments"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeEvents_eventId_key" ON "StripeEvents"("eventId");

-- CreateIndex
CREATE INDEX "Trade_senderId_idx" ON "Trade"("senderId");

-- CreateIndex
CREATE INDEX "Trade_receiverId_idx" ON "Trade"("receiverId");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "Trade"("status");

-- CreateIndex
CREATE INDEX "CoinTransaction_userId_idx" ON "CoinTransaction"("userId");

-- CreateIndex
CREATE INDEX "CoinTransaction_chestTypeId_idx" ON "CoinTransaction"("chestTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendInvite_userId_key" ON "FriendInvite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendInvite_code_key" ON "FriendInvite"("code");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_tradeId_idx" ON "Notification"("tradeId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "UserCoinPackage_coinTransactionId_key" ON "UserCoinPackage"("coinTransactionId");

-- CreateIndex
CREATE INDEX "UserCoinPackage_userId_idx" ON "UserCoinPackage"("userId");

-- CreateIndex
CREATE INDEX "UserCoinPackage_coinPackageId_idx" ON "UserCoinPackage"("coinPackageId");

-- CreateIndex
CREATE INDEX "UserCoinPackage_coinTransactionId_idx" ON "UserCoinPackage"("coinTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CoinPackage_name_key" ON "CoinPackage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_type_key" ON "Achievement"("type");

-- CreateIndex
CREATE INDEX "_tradeSenderChests_B_index" ON "_tradeSenderChests"("B");

-- CreateIndex
CREATE INDEX "_tradeReceiverChests_B_index" ON "_tradeReceiverChests"("B");

-- CreateIndex
CREATE INDEX "_tradeSenderRooms_B_index" ON "_tradeSenderRooms"("B");

-- CreateIndex
CREATE INDEX "_tradeReceiverRooms_B_index" ON "_tradeReceiverRooms"("B");

-- CreateIndex
CREATE INDEX "_AchievementToUser_B_index" ON "_AchievementToUser"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChestDropRate" ADD CONSTRAINT "ChestDropRate_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleTypeChestType" ADD CONSTRAINT "BundleTypeChestType_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleTypeChestType" ADD CONSTRAINT "BundleTypeChestType_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_coinTransactionId_fkey" FOREIGN KEY ("coinTransactionId") REFERENCES "CoinTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_userCoinPackageId_fkey" FOREIGN KEY ("userCoinPackageId") REFERENCES "UserCoinPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePayments" ADD CONSTRAINT "StripePayments_coinPackageId_fkey" FOREIGN KEY ("coinPackageId") REFERENCES "CoinPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeEvents" ADD CONSTRAINT "StripeEvents_stripePaymentsId_fkey" FOREIGN KEY ("stripePaymentsId") REFERENCES "StripePayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendInvite" ADD CONSTRAINT "FriendInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendInvite" ADD CONSTRAINT "FriendInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoinPackage" ADD CONSTRAINT "UserCoinPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoinPackage" ADD CONSTRAINT "UserCoinPackage_coinPackageId_fkey" FOREIGN KEY ("coinPackageId") REFERENCES "CoinPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoinPackage" ADD CONSTRAINT "UserCoinPackage_coinTransactionId_fkey" FOREIGN KEY ("coinTransactionId") REFERENCES "CoinTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeSenderChests" ADD CONSTRAINT "_tradeSenderChests_A_fkey" FOREIGN KEY ("A") REFERENCES "Chest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeSenderChests" ADD CONSTRAINT "_tradeSenderChests_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeReceiverChests" ADD CONSTRAINT "_tradeReceiverChests_A_fkey" FOREIGN KEY ("A") REFERENCES "Chest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeReceiverChests" ADD CONSTRAINT "_tradeReceiverChests_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeSenderRooms" ADD CONSTRAINT "_tradeSenderRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeSenderRooms" ADD CONSTRAINT "_tradeSenderRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeReceiverRooms" ADD CONSTRAINT "_tradeReceiverRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tradeReceiverRooms" ADD CONSTRAINT "_tradeReceiverRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToUser" ADD CONSTRAINT "_AchievementToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToUser" ADD CONSTRAINT "_AchievementToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
