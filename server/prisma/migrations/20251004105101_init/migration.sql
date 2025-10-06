-- DropForeignKey
ALTER TABLE "admin_audit_logs" DROP CONSTRAINT "admin_audit_logs_adminId_fkey";

-- AlterTable
ALTER TABLE "admin_audit_logs" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
