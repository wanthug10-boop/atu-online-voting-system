import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ELECTION_COMMITTEE")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: body,
      include: {
        user: { select: { name: true, studentId: true, department: true } },
        position: { include: { election: { select: { title: true } } } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        resource: `candidate:${candidate.id}`,
        details: `Updated candidate ${candidate.user.name} - ${JSON.stringify(body)}`,
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Update candidate error:", error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}
