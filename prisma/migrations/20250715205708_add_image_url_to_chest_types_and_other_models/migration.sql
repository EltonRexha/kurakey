/*
  Warnings:

  - You are about to drop the column `image` on the `Achievement` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chestImageUrl` to the `Chest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chestOpenedImageUrl` to the `Chest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chestOpeningGifUrl` to the `Chest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `CoinPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BundleType" ADD COLUMN     "bundleImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Chest" ADD COLUMN     "chestImageUrl" TEXT NOT NULL,
ADD COLUMN     "chestOpenedImageUrl" TEXT NOT NULL,
ADD COLUMN     "chestOpeningGifUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CoinPackage" ADD COLUMN     "imageUrl" TEXT NOT NULL;
