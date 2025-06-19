-- AlterTable
ALTER TABLE "CoinTransaction" ADD COLUMN     "chestTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
