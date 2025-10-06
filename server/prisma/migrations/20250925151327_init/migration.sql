/*
  Warnings:

  - You are about to drop the column `permissionId` on the `admin_resource_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `cell_rentals` table. All the data in the column will be lost.
  - You are about to drop the column `rentalStatus` on the `cell_rentals` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `relay_access` table. All the data in the column will be lost.
  - You are about to drop the `admin_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminId,resourceType,resourceId]` on the table `admin_resource_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[statusType]` on the table `cell_statuses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `statusType` on table `cell_statuses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "admin_permissions" DROP CONSTRAINT "admin_permissions_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_permissions" DROP CONSTRAINT "admin_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "admin_resource_permissions" DROP CONSTRAINT "admin_resource_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_roles" DROP CONSTRAINT "admin_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropIndex
DROP INDEX "admin_resource_permissions_adminId_permissionId_resourceTyp_key";

-- AlterTable
ALTER TABLE "admin_resource_permissions" DROP COLUMN "permissionId";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "roleId" TEXT;

-- AlterTable
ALTER TABLE "cell_rentals" DROP COLUMN "isActive",
DROP COLUMN "rentalStatus";

-- AlterTable
ALTER TABLE "cell_statuses" ALTER COLUMN "statusType" SET NOT NULL;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "status" "ListStatus" NOT NULL DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "relay_access" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "admin_permissions";

-- DropTable
DROP TABLE "admin_roles";

-- DropTable
DROP TABLE "role_permissions";

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "admin_resource_permissions_adminId_resourceType_resourceId_key" ON "admin_resource_permissions"("adminId", "resourceType", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "cell_statuses_statusType_key" ON "cell_statuses"("statusType");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
