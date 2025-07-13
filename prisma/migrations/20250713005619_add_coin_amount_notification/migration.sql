-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'COIN_RECEIVED';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "coinAmount" INTEGER;
