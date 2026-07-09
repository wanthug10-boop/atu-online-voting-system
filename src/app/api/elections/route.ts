import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const elections = await prisma.election.findMany({
    include: {
      positions: {
        include: {
          candidates: {
            where: { status: "APPROVED" },
            include: { user: { select: { name: true, studentId: true, department: true } } },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { votes: true, voterRegistrations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(elections);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ELECTION_COMMITTEE")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, type, description, startDate, endDate, department } = await req.json();

    const election = await prisma.election.create({
      data: { title, type, description, startDate: new Date(startDate), endDate: new Date(endDate), department },
      include: {
        positions: { include: { candidates: { include: { user: { select: { name: true, studentId: true } } } } } },
        _count: { select: { votes: true, voterRegistrations: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        resource: `election:${election.id}`,
        details: `Created election "${title}"`,
      },
    });

    return NextResponse.json(election, { status: 201 });
  } catch (error) {
    console.error("Create election error:", error);
    return NextResponse.json({ error: "Failed to create election" }, { status: 500 });
  }
}
