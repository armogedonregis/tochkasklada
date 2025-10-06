-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'ASSIGN_ROLE', 'REVOKE_ROLE', 'ASSIGN_RESOURCE_ACCESS', 'REVOKE_RESOURCE_ACCESS', 'OTHER');

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AdminAction" NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "requestId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_audit_logs_adminId_createdAt_idx" ON "admin_audit_logs"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entity_entityId_idx" ON "admin_audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
