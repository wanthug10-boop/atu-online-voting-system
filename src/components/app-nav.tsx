"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Vote,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  LogOut,
  Shield,
  BarChart3,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function AppNav({ role }: { role: string }) {
  const pathname = usePathname();

  const adminNav: NavItem[] = [
    { label: "Elections", href: "/admin/elections", icon: <Calendar className="h-4 w-4" /> },
    { label: "Candidates", href: "/admin/candidates", icon: <Users className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <ClipboardList className="h-4 w-4" /> },
    { label: "Audit Trail", href: "/admin/audit", icon: <FileText className="h-4 w-4" /> },
  ];

  const committeeNav: NavItem[] = [
    { label: "Elections", href: "/committee/elections", icon: <Calendar className="h-4 w-4" /> },
    { label: "Candidates", href: "/committee/candidates", icon: <Users className="h-4 w-4" /> },
  ];

  const voterNav: NavItem[] = [
    { label: "Vote", href: "/voter/elections", icon: <Vote className="h-4 w-4" /> },
    { label: "Results", href: "/voter/results", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  let nav: NavItem[] = [];
  if (role === "SUPER_ADMIN") nav = adminNav;
  else if (role === "ELECTION_COMMITTEE") nav = committeeNav;
  else nav = voterNav;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/20 glass-strong">
      <div className="flex h-16 items-center border-b border-border/20 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-gradient">
          <Shield className="h-5 w-5 text-primary" />
          ATU Voting
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
          Navigation
        </p>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border/20 p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </aside>
  );
}
