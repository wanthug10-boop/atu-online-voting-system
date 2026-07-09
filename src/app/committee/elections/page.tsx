import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { CommitteeElectionsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CommitteeElectionsPage() {
  const elections = await prisma.election.findMany({
    include: {
      positions: { include: { _count: { select: { candidates: true } } } },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Elections</h1>
        <p className="text-muted-foreground">Manage elections as committee member</p>
      </div>
      <CommitteeElectionsClient elections={JSON.parse(JSON.stringify(elections))} />
    </DashboardShell>
  );
}
