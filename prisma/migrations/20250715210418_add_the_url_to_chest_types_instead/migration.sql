/*
  Warnings:

  - You are about to drop the column `chestImageUrl` on the `Chest` table. All the data in the column will be lost.
  - You are about to drop the column `chestOpenedImageUrl` on the `Chest` table. All the data in the column will be lost.
  - You are about to drop the column `chestOpeningGifUrl` on the `Chest` table. All the data in the column will be lost.
  - Added the required column `chestImageUrl` to the `ChestType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chestOpenedImageUrl` to the `ChestType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chestOpeningGifUrl` to the `ChestType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chest" DROP COLUMN "chestImageUrl",
DROP COLUMN "chestOpenedImageUrl",
DROP COLUMN "chestOpeningGifUrl";

-- AlterTable
ALTER TABLE "ChestType" ADD COLUMN     "chestImageUrl" TEXT NOT NULL,
ADD COLUMN     "chestOpenedImageUrl" TEXT NOT NULL,
ADD COLUMN     "chestOpeningGifUrl" TEXT NOT NULL;
