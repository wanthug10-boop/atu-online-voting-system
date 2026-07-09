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
    <div className="relative min-h-screen overflow-hidden">
      <div className="orb h-[400px] w-[400px] bg-emerald-500/10 -left-48 -top-48 animate-float fixed" />
      <div className="orb h-[300px] w-[300px] bg-cyan-500/6 right-0 top-1/3 animate-float-delayed fixed" />
      <div className="mesh-bg fixed inset-0" />
      <header className="relative z-10 border-b border-border/20 glass-strong">
        <div className="container mx-auto flex h-16 items-center">
          <h1 className="text-lg font-bold text-gradient">ATU Voting — Cast Your Vote</h1>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-4 py-8">
        <VoterElectionsClient
          elections={JSON.parse(JSON.stringify(elections))}
          votedPositions={Array.from(votedPositions) as string[]}
          voterId={voterId}
        />
      </main>
    </div>
  );
}
