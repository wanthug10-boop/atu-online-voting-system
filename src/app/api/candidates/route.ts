import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ELECTION_COMMITTEE")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, positionId, photoUrl, manifesto } = await req.json();

    const position = await prisma.position.findUnique({ where: { id: positionId } });
    if (!position) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const existing = await prisma.candidate.findUnique({
      where: { userId_positionId: { userId, positionId } },
    });
    if (existing) {
      return NextResponse.json({ error: "User already a candidate for this position" }, { status: 409 });
    }

    const candidate = await prisma.candidate.create({
      data: { userId, positionId, photoUrl, manifesto },
      include: {
        user: { select: { name: true, studentId: true, department: true } },
        position: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        resource: `candidate:${candidate.id}`,
        details: `Created candidate for position "${position.title}"`,
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error("Create candidate error:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}
