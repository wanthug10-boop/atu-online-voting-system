import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-primary">ATU Voting - Results</h1>
        </div>
      </header>
      <main className="container py-8">
        <h2 className="mb-6 text-2xl font-bold">Election Results</h2>
        <ResultsClient elections={JSON.parse(JSON.stringify(elections))} />
      </main>
    </div>
  );
}
