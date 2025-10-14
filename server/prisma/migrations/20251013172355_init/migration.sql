/*
  Warnings:

  - You are about to drop the column `statusId` on the `cells` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cells" DROP CONSTRAINT "cells_statusId_fkey";

-- AlterTable
ALTER TABLE "cells" DROP COLUMN "statusId";
