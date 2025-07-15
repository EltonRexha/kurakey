/*
  Warnings:

  - Made the column `bundleImageUrl` on table `BundleType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BundleType" ALTER COLUMN "bundleImageUrl" SET NOT NULL;
