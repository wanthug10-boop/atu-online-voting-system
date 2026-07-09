import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = session.user;
  const role = user.role;

  const activeElections = await prisma.election.count({ where: { status: "ACTIVE" } });
  const totalElections = await prisma.election.count();
  const totalCandidates = await prisma.candidate.count({ where: { status: "APPROVED" } });
  const totalVoters = await prisma.user.count({ where: { role: "STUDENT" } });

  const stats = { activeElections, totalElections, totalCandidates, totalVoters };

  if (role === "SUPER_ADMIN") redirect("/admin/elections");
  if (role === "ELECTION_COMMITTEE") redirect("/committee/elections");

  return (
    <DashboardClient
      user={{ id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.studentId }}
      stats={stats}
    />
  );
}
