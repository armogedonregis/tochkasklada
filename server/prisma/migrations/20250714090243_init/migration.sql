/*
  Warnings:

  - You are about to drop the column `tinkoffPaymentId` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "tinkoffPaymentId",
ADD COLUMN     "bankPaymentId" TEXT;
