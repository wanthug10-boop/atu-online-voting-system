"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/use-toast";
import { Check, X, Plus, User } from "lucide-react";

interface Candidate {
  id: string;
  status: string;
  photoUrl: string;
  manifesto: string;
  user: { name: string; studentId: string; department: string };
  position: { title: string; election: { title: string; type: string } };
}

interface Election { id: string; title: string; positions: { id: string; title: string }[] }
interface Student { id: string; name: string; studentId: string }

export function CommitteeCandidatesClient({
  candidates: initial, elections, students,
}: { candidates: Candidate[]; elections: Election[]; students: Student[] }) {
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
      setCandidates(candidates.map((c) => (c.id === id ? { ...c, status } : c)));
      toast({ title: `Candidate ${status.toLowerCase()}`, variant: "success" });
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: fd.get("userId"), positionId: fd.get("positionId"), manifesto: fd.get("manifesto") }),
      });
      if (!res.ok) throw new Error("Failed");
      setCandidates([await res.json(), ...candidates]);
      setShowForm(false);
      toast({ title: "Candidate added", variant: "success" });
    } catch { toast({ title: "Failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
        <Plus className="mr-2 h-4 w-4" /> Add Candidate
      </Button>

      {showForm && (
        <Card className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Election</label>
                <select name="electionId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required
                  onChange={(e) => {
                    const sel = document.getElementsByName("positionId")[0] as HTMLSelectElement;
                    if (sel) {
                      sel.innerHTML = "";
                      const el = elections.find((el) => el.id === e.target.value);
                      if (el) el.positions.forEach((p) => sel.add(new Option(p.title, p.id)));
                    }
                  }}>
                  <option value="">Select</option>
                  {elections.map((el) => <option key={el.id} value={el.id}>{el.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Position</label>
                <select name="positionId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required>
                  <option value="">Select election first</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Student</label>
                <select name="userId" className="flex h-10 w-full rounded-md border border-border/30 bg-background/50 px-3 text-sm text-foreground/80" required>
                  <option value="">Select</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Manifesto</label>
                <textarea name="manifesto" className="flex min-h-[80px] w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground/80" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">{saving ? "Adding..." : "Add"}</Button>
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
        {candidates.map((c) => (
          <Card key={c.id} className="glass rounded-2xl border-border/40 card-3d card-hover overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold bg-primary/10 text-primary">
                      {c.user.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold">{c.user.name}</h3>
                    <Badge variant={c.status === "APPROVED" ? "success" : c.status === "REJECTED" ? "destructive" : "warning"}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/70">{c.user.studentId} &middot; {c.user.department}</p>
                  <p className="text-sm text-muted-foreground/60">{c.position.title} &mdash; {c.position.election.title}</p>
                </div>
                <div className="flex gap-2">
                  {c.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(c.id, "APPROVED")} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatus(c.id, "REJECTED")}>
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
