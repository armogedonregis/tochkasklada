/*
  Warnings:

  - You are about to drop the column `description` on the `requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "description",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "sizeform" TEXT;
