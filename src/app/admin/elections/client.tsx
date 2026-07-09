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

const statusColors: Record<string, "default" | "warning" | "success" | "secondary"> = {
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
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> New Election
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title</Label>
                  <Input id="title" name="title" placeholder="SRC Elections 2025" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select id="type" name="type" className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" required>
                    <option value="SRC">SRC</option>
                    <option value="DEPARTMENTAL">Departmental</option>
                    <option value="HALL">Hall</option>
                    <option value="CLASS">Class</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department (if applicable)</Label>
                  <Input id="department" name="department" placeholder="Computer Science" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Election"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{election.title}</h3>
                    <Badge variant={statusColors[election.status]}>{election.status}</Badge>
                    <Badge variant={typeColors[election.type]}>{election.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{election.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(election.startDate)}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {election.positions.length} positions</span>
                    <span className="flex items-center gap-1"><Vote className="h-3 w-3" /> {election._count.votes} votes</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {election.status === "PENDING" && (
                    <Button size="sm" onClick={() => toggleStatus(election, "ACTIVE")}>Activate</Button>
                  )}
                  {election.status === "ACTIVE" && (
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(election, "CLOSED")}>Close</Button>
                  )}
                  {election.status !== "ARCHIVED" && election.status !== "PENDING" && (
                    <Button size="sm" variant="secondary" onClick={() => toggleStatus(election, "ARCHIVED")}>Archive</Button>
                  )}
                </div>
              </div>
              {election.positions.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">POSITIONS</p>
                  <div className="flex flex-wrap gap-2">
                    {election.positions.map((pos) => (
                      <Badge key={pos.id} variant="outline">{pos.title} ({pos._count.candidates})</Badge>
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
