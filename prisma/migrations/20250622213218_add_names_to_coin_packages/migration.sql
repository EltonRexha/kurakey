/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CoinPackage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CoinPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoinPackage" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CoinPackage_name_key" ON "CoinPackage"("name");
