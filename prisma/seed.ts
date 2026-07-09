import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { studentId: "ADMIN001" },
    update: {},
    create: {
      studentId: "ADMIN001",
      email: "admin@atu.edu.gh",
      name: "System Admin",
      department: "IT",
      level: 1,
      role: "SUPER_ADMIN",
      passwordHash,
      isVerified: true,
    },
  });

  const committee = await prisma.user.upsert({
    where: { studentId: "COM001" },
    update: {},
    create: {
      studentId: "COM001",
      email: "committee@atu.edu.gh",
      name: "Election Committee",
      department: "Administration",
      level: 1,
      role: "ELECTION_COMMITTEE",
      passwordHash,
      isVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { studentId: "2023001" },
    update: {},
    create: {
      studentId: "2023001",
      email: "student@atu.edu.gh",
      name: "John Student",
      department: "Computer Science",
      level: 2,
      role: "STUDENT",
      passwordHash,
      isVerified: true,
    },
  });

  console.log({ admin, committee, student });
  console.log("Default password for all seeds: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
