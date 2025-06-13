/*
  Warnings:

  - You are about to drop the `_BundleTypeToChestType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BundleTypeToChestType" DROP CONSTRAINT "_BundleTypeToChestType_A_fkey";

-- DropForeignKey
ALTER TABLE "_BundleTypeToChestType" DROP CONSTRAINT "_BundleTypeToChestType_B_fkey";

-- DropTable
DROP TABLE "_BundleTypeToChestType";

-- CreateTable
CREATE TABLE "BundleTypeChestType" (
    "id" TEXT NOT NULL,
    "bundleTypeId" TEXT NOT NULL,
    "chestTypeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "BundleTypeChestType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BundleTypeChestType_bundleTypeId_chestTypeId_key" ON "BundleTypeChestType"("bundleTypeId", "chestTypeId");

-- AddForeignKey
ALTER TABLE "BundleTypeChestType" ADD CONSTRAINT "BundleTypeChestType_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleTypeChestType" ADD CONSTRAINT "BundleTypeChestType_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
