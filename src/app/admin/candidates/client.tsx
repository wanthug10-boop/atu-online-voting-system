"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/use-toast";
import { Check, X, Plus, User } from "lucide-react";

const statusColors: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

interface Candidate {
  id: string;
  status: string;
  photoUrl: string;
  manifesto: string;
  user: { name: string; studentId: string; department: string; level: number };
  position: { title: string; election: { title: string; type: string } };
}

interface Election {
  id: string;
  title: string;
  type: string;
  positions: { id: string; title: string }[];
}

interface Student {
  id: string;
  name: string;
  studentId: string;
}

export function CandidatesClient({
  candidates: initial,
  elections,
  students,
}: {
  candidates: Candidate[];
  elections: Election[];
  students: Student[];
}) {
  const [candidates, setCandidates] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setCandidates(candidates.map((c) => (c.id === updated.id ? { ...c, status: updated.status } : c)));
      toast({ title: `Candidate ${status.toLowerCase()}`, variant: "success" });
    } catch {
      toast({ title: "Failed to update candidate", variant: "destructive" });
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.get("userId"),
          positionId: formData.get("positionId"),
          manifesto: formData.get("manifesto"),
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const candidate = await res.json();
      setCandidates([candidate, ...candidates]);
      setShowForm(false);
      toast({ title: "Candidate added", variant: "success" });
    } catch {
      toast({ title: "Failed to add candidate", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
          <Plus className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      {showForm && (
        <Card className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="electionId" className="text-foreground/80">Election</Label>
                <select id="electionId" name="electionId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80"
                  onChange={(e) => {
                    const sel = document.getElementById("positionId") as HTMLSelectElement;
                    if (sel) {
                      sel.innerHTML = "";
                      const election = elections.find((el) => el.id === e.target.value);
                      if (election) {
                        election.positions.forEach((p) => {
                          sel.add(new Option(p.title, p.id));
                        });
                      }
                    }
                  }}
                  required
                >
                  <option value="">Select election</option>
                  {elections.map((el) => (
                    <option key={el.id} value={el.id}>{el.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionId" className="text-foreground/80">Position</Label>
                <select id="positionId" name="positionId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required>
                  <option value="">Select election first</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-foreground/80">Student</Label>
                <select id="userId" name="userId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required>
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manifesto" className="text-foreground/80">Manifesto</Label>
                <textarea id="manifesto" name="manifesto" className="flex min-h-[100px] w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground/80 placeholder:text-muted-foreground/50" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">{saving ? "Adding..." : "Add Candidate"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-border/30 hover:bg-background/50">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {candidates.length === 0 && (
          <Card className="glass rounded-2xl border-border/40">
            <CardContent className="py-12 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No candidates yet.</p>
            </CardContent>
          </Card>
        )}
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="glass rounded-2xl border-border/40 card-3d card-hover overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold bg-primary/10 text-primary">
                      {candidate.user.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold">{candidate.user.name}</h3>
                    <Badge variant={statusColors[candidate.status]}>{candidate.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/70">
                    {candidate.user.studentId} &middot; {candidate.user.department} &middot; Level {candidate.user.level}
                  </p>
                  <p className="text-sm text-muted-foreground/60">
                    <span className="font-medium text-foreground/80">{candidate.position.title}</span> &mdash;{" "}
                    {candidate.position.election.title} ({candidate.position.election.type})
                  </p>
                  {candidate.manifesto && (
                    <p className="mt-2 text-sm italic text-muted-foreground/50 line-clamp-2 border-t border-border/20 pt-2">&ldquo;{candidate.manifesto}&rdquo;</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {candidate.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(candidate.id, "APPROVED")} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatus(candidate.id, "REJECTED")}>
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
