"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/use-toast";
import { formatDate } from "@/lib/utils";
import { Shield, ShieldCheck, UserCheck, Users } from "lucide-react";

interface User {
  id: string;
  studentId: string;
  email: string;
  name: string;
  role: string;
  department: string;
  level: number;
  isVerified: boolean;
  createdAt: string;
}

const roleColors: Record<string, "default" | "secondary" | "warning"> = {
  STUDENT: "secondary",
  ELECTION_COMMITTEE: "warning",
  SUPER_ADMIN: "default",
};

export function UsersClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial);

  async function updateRole(id: string, role: string) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed");
      setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
      toast({ title: `User role updated to ${role}`, variant: "success" });
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      {users.length === 0 && (
        <Card className="glass rounded-2xl border-border/40">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No users registered yet.</p>
          </CardContent>
        </Card>
      )}
      {users.map((user) => (
        <Card key={user.id} className="glass rounded-2xl border-border/40 card-3d card-hover overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold bg-primary/10 text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <Badge variant={roleColors[user.role]}>{user.role}</Badge>
                  {user.isVerified && <UserCheck className="h-4 w-4 text-emerald-400" />}
                </div>
                <p className="text-sm text-muted-foreground/70">
                  {user.studentId} &middot; {user.email}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {user.department} &middot; Level {user.level} &middot; Joined {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {user.role !== "SUPER_ADMIN" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => updateRole(user.id, "ELECTION_COMMITTEE")} className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                      <Shield className="mr-1 h-4 w-4" /> Make Committee
                    </Button>
                    {user.role === "ELECTION_COMMITTEE" && (
                      <Button size="sm" variant="secondary" onClick={() => updateRole(user.id, "STUDENT")} className="bg-muted-foreground/10 hover:bg-muted-foreground/20">
                        <ShieldCheck className="mr-1 h-4 w-4" /> Demote
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
