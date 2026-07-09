import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { UsersClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      studentId: true,
      email: true,
      name: true,
      role: true,
      department: true,
      level: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>
      <UsersClient users={JSON.parse(JSON.stringify(users))} />
    </DashboardShell>
  );
}
