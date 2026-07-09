"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Vote,
  Users,
  UserCheck,
  ClipboardList,
  BarChart3,
  Shield,
  LogOut,
  FileText,
} from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface AppSidebarProps {
  role: "SUPER_ADMIN" | "ELECTION_COMMITTEE" | "STUDENT";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();

  const adminItems: SidebarItem[] = [
    { href: "/admin/elections", label: "Elections", icon: <Vote className="h-4 w-4" /> },
    { href: "/admin/candidates", label: "Candidates", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/users", label: "Users", icon: <UserCheck className="h-4 w-4" /> },
    { href: "/admin/audit", label: "Audit Logs", icon: <FileText className="h-4 w-4" /> },
  ];

  const committeeItems: SidebarItem[] = [
    { href: "/committee/elections", label: "Elections", icon: <Vote className="h-4 w-4" /> },
    { href: "/committee/candidates", label: "Candidates", icon: <Users className="h-4 w-4" /> },
  ];

  const voterItems: SidebarItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/voter/elections", label: "Vote", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/voter/results", label: "Results", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const items = role === "SUPER_ADMIN" ? adminItems : role === "ELECTION_COMMITTEE" ? committeeItems : voterItems;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ATU Voting</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </aside>
  );
}
