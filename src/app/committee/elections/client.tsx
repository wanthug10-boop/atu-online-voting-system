"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/use-toast";
import { formatDate } from "@/lib/utils";
import { Plus, Calendar, Users, Vote } from "lucide-react";

const statusColors: Record<string, "warning" | "success" | "default" | "secondary"> = {
  PENDING: "warning",
  ACTIVE: "success",
  CLOSED: "default",
  ARCHIVED: "secondary",
};

interface Election {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  department: string;
  positions: { id: string; title: string; _count: { candidates: number } }[];
  _count: { votes: number };
}

export function CommitteeElectionsClient({ elections: initial }: { elections: Election[] }) {
  const [elections, setElections] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          type: formData.get("type"),
          description: formData.get("description"),
          startDate: new Date(formData.get("startDate") as string).toISOString(),
          endDate: new Date(formData.get("endDate") as string).toISOString(),
          department: formData.get("department"),
        }),
      });

      if (!res.ok) throw new Error("Failed");
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

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
        <Plus className="mr-2 h-4 w-4" /> New Election
      </Button>

      {showForm && (
        <Card className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground/80">Election Title</Label>
                  <Input id="title" name="title" required className="bg-background/50 border-border/30" />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground/80">Description</Label>
                <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground/80" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">{saving ? "Creating..." : "Create"}</Button>
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
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">{election.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/70">{election.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(election.startDate)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {election.positions.length} positions</span>
                    <span className="flex items-center gap-1"><Vote className="h-3 w-3" /> {election._count.votes} votes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
