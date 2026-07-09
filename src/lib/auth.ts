import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        studentId: { label: "Student ID", type: "text" },
        email: { label: "University Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.studentId || !credentials?.email || !credentials?.password) {
          return null;
        }

        const { compare } = await import("bcryptjs");

        const user = await prisma.user.findUnique({
          where: { studentId: credentials.studentId as string },
        });

        if (!user || user.email !== credentials.email) {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          studentId: user.studentId,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
