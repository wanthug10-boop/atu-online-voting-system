import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard-shell";
import { ResultsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const elections = await prisma.election.findMany({
    where: { status: { in: ["ACTIVE", "CLOSED", "ARCHIVED"] } },
    include: {
      positions: {
        include: {
          candidates: {
            include: {
              user: { select: { name: true, studentId: true, department: true } },
              _count: { select: { votes: true } },
            },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { votes: true, voterRegistrations: true } },
    },
    orderBy: { endDate: "desc" },
  });

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Election Results</h1>
        <p className="text-muted-foreground/70">Live vote counts and winners</p>
      </div>
      <ResultsClient elections={JSON.parse(JSON.stringify(elections))} />
    </DashboardShell>
  );
}
