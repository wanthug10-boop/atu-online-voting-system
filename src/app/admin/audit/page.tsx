import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { AuditClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true, studentId: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">Complete log of all system actions</p>
      </div>
      <AuditClient logs={JSON.parse(JSON.stringify(logs))} />
    </DashboardShell>
  );
}
