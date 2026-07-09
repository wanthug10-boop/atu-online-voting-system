import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface VoteInput {
  positionId: string;
  candidateId: string;
}

interface NewVote {
  electionId: string;
  positionId: string;
  candidateId: string;
  voterId: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { electionId, votes: voteInputs } = await req.json() as { electionId: string; votes: VoteInput[] };

    if (!electionId || !voteInputs || !Array.isArray(voteInputs) || voteInputs.length === 0) {
      return NextResponse.json({ error: "Invalid vote data" }, { status: 400 });
    }

    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { positions: true },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    if (election.status !== "ACTIVE") {
      return NextResponse.json({ error: "Election is not active" }, { status: 400 });
    }

    if (new Date() < election.startDate || new Date() > election.endDate) {
      return NextResponse.json({ error: "Voting period is not open" }, { status: 400 });
    }

    const existingVotes = await prisma.vote.findMany({
      where: { voterId: session.user.id, electionId },
      select: { positionId: true },
    });

    const votedPositionIds = new Set(existingVotes.map((v: { positionId: string }) => v.positionId));

    const newVotes: NewVote[] = [];
    for (const vote of voteInputs) {
      if (votedPositionIds.has(vote.positionId)) {
        continue;
      }

      const position = election.positions.find((p: { id: string }) => p.id === vote.positionId);
      if (!position) continue;

      const candidate = await prisma.candidate.findFirst({
        where: { id: vote.candidateId, positionId: vote.positionId, status: "APPROVED" },
      });
      if (!candidate) continue;

      newVotes.push({
        electionId,
        positionId: vote.positionId,
        candidateId: vote.candidateId,
        voterId: session.user.id,
      });
      votedPositionIds.add(vote.positionId);
    }

    if (newVotes.length === 0) {
      return NextResponse.json({ error: "No new votes to cast" }, { status: 400 });
    }

    await prisma.vote.createMany({ data: newVotes });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "VOTE",
        resource: `election:${electionId}`,
        details: `Cast ${newVotes.length} vote(s) in election "${election.title}"`,
      },
    });

    return NextResponse.json({ success: true, votesCast: newVotes.length }, { status: 201 });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}
