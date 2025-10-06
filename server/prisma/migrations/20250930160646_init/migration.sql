-- AlterTable
ALTER TABLE "cell_rentals" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "cell_statuses" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "cells" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "citys" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "client_phones" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "containers" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "panels" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "relay_access" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "relays" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "size_cells" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "cell_rentals_isDeleted_idx" ON "cell_rentals"("isDeleted");

-- CreateIndex
CREATE INDEX "cell_statuses_isDeleted_idx" ON "cell_statuses"("isDeleted");

-- CreateIndex
CREATE INDEX "cells_isDeleted_idx" ON "cells"("isDeleted");

-- CreateIndex
CREATE INDEX "citys_isDeleted_idx" ON "citys"("isDeleted");

-- CreateIndex
CREATE INDEX "client_phones_isDeleted_idx" ON "client_phones"("isDeleted");

-- CreateIndex
CREATE INDEX "clients_isDeleted_idx" ON "clients"("isDeleted");

-- CreateIndex
CREATE INDEX "containers_isDeleted_idx" ON "containers"("isDeleted");

-- CreateIndex
CREATE INDEX "lists_isDeleted_idx" ON "lists"("isDeleted");

-- CreateIndex
CREATE INDEX "locations_isDeleted_idx" ON "locations"("isDeleted");

-- CreateIndex
CREATE INDEX "panels_isDeleted_idx" ON "panels"("isDeleted");

-- CreateIndex
CREATE INDEX "payments_isDeleted_idx" ON "payments"("isDeleted");

-- CreateIndex
CREATE INDEX "relay_access_isDeleted_idx" ON "relay_access"("isDeleted");

-- CreateIndex
CREATE INDEX "relays_isDeleted_idx" ON "relays"("isDeleted");

-- CreateIndex
CREATE INDEX "requests_isDeleted_idx" ON "requests"("isDeleted");

-- CreateIndex
CREATE INDEX "roles_isDeleted_idx" ON "roles"("isDeleted");

-- CreateIndex
CREATE INDEX "size_cells_isDeleted_idx" ON "size_cells"("isDeleted");

-- CreateIndex
CREATE INDEX "users_isDeleted_idx" ON "users"("isDeleted");
