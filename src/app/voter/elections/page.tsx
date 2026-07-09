import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VoterElectionsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function VoterElectionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const elections = await prisma.election.findMany({
    where: { status: "ACTIVE" },
    include: {
      positions: {
        include: {
          candidates: {
            where: { status: "APPROVED" },
            include: { user: { select: { name: true, studentId: true, department: true, level: true } } },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { endDate: "asc" },
  });

  const voterId = session.user.id;
  const existingVotes = await prisma.vote.findMany({
    where: { voterId },
    select: { electionId: true, positionId: true },
  });

  const votedPositions = new Set(existingVotes.map((v: { electionId: string; positionId: string }) => `${v.electionId}:${v.positionId}`));

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-primary">ATU Voting</h1>
        </div>
      </header>
      <main className="container py-8">
        <h2 className="mb-6 text-2xl font-bold">Active Elections</h2>
        <VoterElectionsClient
          elections={JSON.parse(JSON.stringify(elections))}
          votedPositions={Array.from(votedPositions) as string[]}
          voterId={voterId}
        />
      </main>
    </div>
  );
}
