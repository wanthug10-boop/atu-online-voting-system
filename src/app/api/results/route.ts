import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const electionId = searchParams.get("electionId");

  const where = electionId ? { id: electionId } : {};
  const elections = await prisma.election.findMany({
    where,
    include: {
      positions: {
        include: {
          candidates: {
            include: {
              user: { select: { name: true, studentId: true, department: true } },
              _count: { select: { votes: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(elections);
}
