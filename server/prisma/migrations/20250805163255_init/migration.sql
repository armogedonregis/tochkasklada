-- CreateEnum
CREATE TYPE "ListStatus" AS ENUM ('WAITING', 'CLOSED');

-- AlterTable
ALTER TABLE "client_phones" ADD COLUMN     "comment" TEXT;

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "ListStatus" NOT NULL DEFAULT 'WAITING',
    "comment" TEXT,
    "closedById" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
