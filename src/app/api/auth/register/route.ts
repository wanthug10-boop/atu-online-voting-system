import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, name, department, level, password } = await req.json();

    if (!studentId || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const email = `${studentId}@atu.edu.gh`;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ studentId }, { email }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Student ID already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        studentId,
        email,
        name,
        department: department || "",
        level: level || 1,
        passwordHash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
