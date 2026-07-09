import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { ElectionsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminElectionsPage() {
  const elections = await prisma.election.findMany({
    include: { positions: { include: { _count: { select: { candidates: true } } } }, _count: { select: { votes: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Election Management</h1>
        <p className="text-muted-foreground">Create and manage all elections</p>
      </div>
      <ElectionsClient elections={JSON.parse(JSON.stringify(elections))} />
    </DashboardShell>
  );
}
