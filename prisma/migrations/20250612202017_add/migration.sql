-- CreateTable
CREATE TABLE "ChestDropRate" (
    "id" TEXT NOT NULL,
    "chestTypeId" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "chance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChestDropRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChestDropRate_chestTypeId_rarity_key" ON "ChestDropRate"("chestTypeId", "rarity");

-- AddForeignKey
ALTER TABLE "ChestDropRate" ADD CONSTRAINT "ChestDropRate_chestTypeId_fkey" FOREIGN KEY ("chestTypeId") REFERENCES "ChestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
