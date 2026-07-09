"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Vote, Users, BarChart3, Calendar, Shield, ChevronRight } from "lucide-react";

interface DashboardClientProps {
  user: { id: string; name: string; email: string; role: string; studentId: string };
  stats: { activeElections: number; totalElections: number; totalCandidates: number; totalVoters: number };
}

export function DashboardClient({ user, stats }: DashboardClientProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="orb h-[500px] w-[500px] bg-emerald-500/10 -left-64 -top-64 animate-float" />
      <div className="orb h-[400px] w-[400px] bg-cyan-500/8 right-0 top-1/3 animate-float-delayed" />
      <div className="mesh-bg fixed inset-0" />

      <header className="relative z-10 border-b border-border/20">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow-sm">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-gradient">ATU Voting</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name} <span className="text-xs opacity-60">({user.studentId})</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="text-muted-foreground hover:text-foreground">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h2>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening across the platform</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Elections", value: stats.activeElections, icon: <Calendar className="h-4 w-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Total Elections", value: stats.totalElections, icon: <Vote className="h-4 w-4" />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { label: "Candidates", value: stats.totalCandidates, icon: <Users className="h-4 w-4" />, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Registered Voters", value: stats.totalVoters, icon: <BarChart3 className="h-4 w-4" />, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map((stat) => (
            <Card key={stat.label} className="glass rounded-xl border-border/40 card-3d group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/voter/elections" className="group">
            <Card className="glass rounded-xl border-border/40 card-3d p-6 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Vote className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Cast Your Vote</h3>
                    <p className="text-sm text-muted-foreground">View active elections and vote securely</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          </Link>
          <Link href="/voter/results" className="group">
            <Card className="glass rounded-xl border-border/40 card-3d p-6 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">View Results</h3>
                    <p className="text-sm text-muted-foreground">See live results and election outcomes</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
