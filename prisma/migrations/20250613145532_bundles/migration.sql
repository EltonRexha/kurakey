-- CreateTable
CREATE TABLE "BundleType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "coinAmount" INTEGER NOT NULL,

    CONSTRAINT "BundleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "bundleTypeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BundleTypeToChestType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BundleTypeToChestType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BundleType_name_key" ON "BundleType"("name");

-- CreateIndex
CREATE INDEX "_BundleTypeToChestType_B_index" ON "_BundleTypeToChestType"("B");

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_bundleTypeId_fkey" FOREIGN KEY ("bundleTypeId") REFERENCES "BundleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleTypeToChestType" ADD CONSTRAINT "_BundleTypeToChestType_A_fkey" FOREIGN KEY ("A") REFERENCES "BundleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleTypeToChestType" ADD CONSTRAINT "_BundleTypeToChestType_B_fkey" FOREIGN KEY ("B") REFERENCES "ChestType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
