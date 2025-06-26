/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unlockMessage` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Achievement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "unlockMessage" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AchievementTypes";

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_type_key" ON "Achievement"("type");
