-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ACHIEVEMENT';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "achievementId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
