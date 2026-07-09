import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { CandidatesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    include: {
      user: { select: { name: true, studentId: true, department: true, level: true } },
      position: { include: { election: { select: { title: true, type: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const elections = await prisma.election.findMany({
    where: { status: { in: ["PENDING", "ACTIVE"] } },
    include: { positions: true },
    orderBy: { createdAt: "desc" },
  });

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, studentId: true },
    orderBy: { name: "asc" },
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Candidate Management</h1>
        <p className="text-muted-foreground">Approve or reject candidate applications</p>
      </div>
      <CandidatesClient
        candidates={JSON.parse(JSON.stringify(candidates))}
        elections={JSON.parse(JSON.stringify(elections))}
        students={JSON.parse(JSON.stringify(students))}
      />
    </DashboardShell>
  );
}
