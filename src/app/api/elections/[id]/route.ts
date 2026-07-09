import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const election = await prisma.election.findUnique({
    where: { id: params.id },
    include: {
      positions: {
        include: {
          candidates: {
            include: { user: { select: { name: true, studentId: true, department: true, level: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { votes: true, voterRegistrations: true } },
    },
  });

  if (!election) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(election);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ELECTION_COMMITTEE")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const election = await prisma.election.update({
      where: { id: params.id },
      data: body,
      include: {
        positions: { include: { _count: { select: { candidates: true } } } },
        _count: { select: { votes: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        resource: `election:${election.id}`,
        details: `Updated election "${election.title}" - ${JSON.stringify(body)}`,
      },
    });

    return NextResponse.json(election);
  } catch (error) {
    console.error("Update election error:", error);
    return NextResponse.json({ error: "Failed to update election" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.election.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        resource: `election:${params.id}`,
        details: "Deleted election",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete election error:", error);
    return NextResponse.json({ error: "Failed to delete election" }, { status: 500 });
  }
}
