/*
  Warnings:

  - You are about to drop the column `price` on the `Chest` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Chest` table. All the data in the column will be lost.
  - Added the required column `chestTypeId` to the `Chest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chest" DROP COLUMN "price",
DROP COLUMN "type",
ADD COLUMN     "chestTypeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ChestType";

-- CreateTable
CREATE TABLE "ChestType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "ChestType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChestType_name_key" ON "ChestType"("name");

-- AddForeignKey
ALTER TABLE "Chest" ADD CONSTRAINT "Chest_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
