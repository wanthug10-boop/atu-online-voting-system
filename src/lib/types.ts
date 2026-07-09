import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    studentId?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      studentId: string;
      role: string;
      email: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    studentId: string;
    role: string;
  }
}
