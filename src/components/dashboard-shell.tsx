import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <AppNav role={session.user.role} />
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
