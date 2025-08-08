-- DropForeignKey
ALTER TABLE "cell_rentals" DROP CONSTRAINT "cell_rentals_cellId_fkey";

-- DropIndex
DROP INDEX "unique_active_rental";

-- CreateTable
CREATE TABLE "_CellRentalToCells" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CellRentalToCells_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CellRentalToCells_B_index" ON "_CellRentalToCells"("B");

-- AddForeignKey
ALTER TABLE "_CellRentalToCells" ADD CONSTRAINT "_CellRentalToCells_A_fkey" FOREIGN KEY ("A") REFERENCES "cell_rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CellRentalToCells" ADD CONSTRAINT "_CellRentalToCells_B_fkey" FOREIGN KEY ("B") REFERENCES "cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ПЕРЕНОС ДАННЫХ: копируем существующие связи из cellId в новую таблицу
INSERT INTO "_CellRentalToCells" ("A", "B")
SELECT cr.id, cr."cellId"
FROM "cell_rentals" cr
WHERE cr."cellId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "_CellRentalToCells" 
    WHERE "A" = cr.id AND "B" = cr."cellId"
  );