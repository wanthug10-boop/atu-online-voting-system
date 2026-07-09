import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ELECTION_COMMITTEE")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { electionId, title, description, maxVotes, order } = await req.json();

    const position = await prisma.position.create({
      data: { electionId, title, description, maxVotes: maxVotes || 1, order: order || 0 },
    });

    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Create position error:", error);
    return NextResponse.json({ error: "Failed to create position" }, { status: 500 });
  }
}
