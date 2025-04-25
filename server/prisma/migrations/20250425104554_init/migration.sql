-- CreateEnum
CREATE TYPE "RelayType" AS ENUM ('SECURITY', 'LIGHT', 'GATE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "containers" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "locId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cells" (
    "id" TEXT NOT NULL,
    "size_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "len_height" TEXT,
    "containerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size_cells" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relays" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "relayNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RelayType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relay_access" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "relayId" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relay_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "citys_short_name_key" ON "citys"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "locations_short_name_key" ON "locations"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "relays_panelId_relayNumber_key" ON "relays"("panelId", "relayNumber");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "citys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_locId_fkey" FOREIGN KEY ("locId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "containers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size_cells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relays" ADD CONSTRAINT "relays_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "panels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relay_access" ADD CONSTRAINT "relay_access_relayId_fkey" FOREIGN KEY ("relayId") REFERENCES "relays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
