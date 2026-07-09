"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/use-toast";
import { formatDate } from "@/lib/utils";
import { Plus, Calendar, Users, Vote, Sparkles, Timer, Archive, XCircle, CheckCircle } from "lucide-react";

const statusColors: Record<string, "warning" | "success" | "default" | "secondary"> = {
  PENDING: "warning",
  ACTIVE: "success",
  CLOSED: "default",
  ARCHIVED: "secondary",
};

const typeColors: Record<string, "default" | "secondary" | "outline" | "secondary"> = {
  SRC: "default",
  DEPARTMENTAL: "secondary",
  HALL: "outline",
  CLASS: "secondary",
};

interface Election {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  department: string;
  description: string;
  positions: { id: string; title: string; _count: { candidates: number } }[];
  _count: { votes: number };
}

export function ElectionsClient({ elections: initial }: { elections: Election[] }) {
  const [elections, setElections] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      type: formData.get("type"),
      description: formData.get("description"),
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: new Date(formData.get("endDate") as string).toISOString(),
      department: formData.get("department"),
    };

    try {
      const res = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create");

      const election = await res.json();
      setElections([election, ...elections]);
      setShowForm(false);
      toast({ title: "Election created", variant: "success" });
    } catch {
      toast({ title: "Failed to create election", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(election: Election, newStatus: string) {
    try {
      const res = await fetch(`/api/elections/${election.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setElections(elections.map((e) => (e.id === updated.id ? updated : e)));
      toast({ title: `Election ${newStatus.toLowerCase()}`, variant: "success" });
    } catch {
      toast({ title: "Failed to update election", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
          <Plus className="mr-2 h-4 w-4" /> New Election
        </Button>
      </div>

      {showForm && (
        <Card className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground/80">Election Title</Label>
                  <Input id="title" name="title" placeholder="SRC Elections 2025" required className="bg-background/50 border-border/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground/80">Type</Label>
                  <select id="type" name="type" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required>
                    <option value="SRC">SRC</option>
                    <option value="DEPARTMENTAL">Departmental</option>
                    <option value="HALL">Hall</option>
                    <option value="CLASS">Class</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-foreground/80">Start Date</Label>
                  <Input id="startDate" name="startDate" type="datetime-local" required className="bg-background/50 border-border/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-foreground/80">End Date</Label>
                  <Input id="endDate" name="endDate" type="datetime-local" required className="bg-background/50 border-border/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-foreground/80">Department (if applicable)</Label>
                  <Input id="department" name="department" placeholder="Computer Science" className="bg-background/50 border-border/30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground/80">Description</Label>
                <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground/80 placeholder:text-muted-foreground/50" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">{saving ? "Creating..." : "Create Election"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-border/30 hover:bg-background/50">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {elections.map((election) => (
          <Card key={election.id} className="glass rounded-2xl border-border/40 card-3d card-hover overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{election.title}</h3>
                    <Badge variant={statusColors[election.status]}>{election.status}</Badge>
                    <Badge variant={typeColors[election.type]} className="bg-primary/5 border-primary/20 text-primary">{election.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/70">{election.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(election.startDate)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {election.positions.length} positions</span>
                    <span className="flex items-center gap-1"><Vote className="h-3 w-3" /> {election._count.votes} votes</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {election.status === "PENDING" && (
                    <Button size="sm" onClick={() => toggleStatus(election, "ACTIVE")} className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25">
                      <Sparkles className="mr-1 h-4 w-4" /> Activate
                    </Button>
                  )}
                  {election.status === "ACTIVE" && (
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(election, "CLOSED")} className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                      <XCircle className="mr-1 h-4 w-4" /> Close
                    </Button>
                  )}
                  {election.status !== "ARCHIVED" && election.status !== "PENDING" && (
                    <Button size="sm" variant="secondary" onClick={() => toggleStatus(election, "ARCHIVED")} className="bg-muted-foreground/10 hover:bg-muted-foreground/20">
                      <Archive className="mr-1 h-4 w-4" /> Archive
                    </Button>
                  )}
                </div>
              </div>
              {election.positions.length > 0 && (
                <div className="mt-4 border-t border-border/20 pt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground/60">POSITIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {election.positions.map((pos) => (
                      <Badge key={pos.id} variant="outline" className="border-border/30 bg-background/30">{pos.title} ({pos._count.candidates})</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
