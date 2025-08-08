-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "locationId" TEXT;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
