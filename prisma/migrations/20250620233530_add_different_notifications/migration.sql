/*
  Warnings:

  - The values [SYSTEM] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `url` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('ROOM_RECEIVED', 'CHEST_RECEIVED', 'XP_GAIN', 'FRIEND_REQUEST', 'TRADE_INVITE');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "url",
ADD COLUMN     "chestTypeId" TEXT,
ADD COLUMN     "roomId" TEXT,
ADD COLUMN     "xpAmount" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
