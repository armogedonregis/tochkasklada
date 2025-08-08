/*
  Warnings:

  - You are about to drop the column `status` on the `lists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lists" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "status" "ListStatus" NOT NULL DEFAULT 'WAITING';
