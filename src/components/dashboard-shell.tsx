import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="orb h-[600px] w-[600px] bg-emerald-500/8 -left-80 -top-80 animate-float fixed pointer-events-none" />
      <div className="orb h-[400px] w-[400px] bg-cyan-500/6 right-0 bottom-0 animate-float-delayed fixed pointer-events-none" />
      <div className="mesh-bg fixed inset-0 pointer-events-none" />
      <AppNav role={session.user.role} />
      <main className="relative flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
