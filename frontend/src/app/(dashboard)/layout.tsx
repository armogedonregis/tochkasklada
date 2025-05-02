"use client";

import { MainLayout } from "@/components/Layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
