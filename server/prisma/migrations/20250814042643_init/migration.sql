-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "sizeId" TEXT;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size_cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;
