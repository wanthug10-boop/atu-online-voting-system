"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/use-toast";
import { Check, X, Plus } from "lucide-react";

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
      <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Candidate</Button>

      {showForm && (
        <Card><CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Election</label>
              <select name="electionId" className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" required
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
              <label className="text-sm font-medium">Position</label>
              <select name="positionId" className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" required>
                <option value="">Select election first</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Student</label>
              <select name="userId" className="flex h-10 w-full rounded-md border bg-background px-3 text-sm" required>
                <option value="">Select</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Manifesto</label>
              <textarea name="manifesto" className="flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Adding..." : "Add"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      <div className="space-y-4">
        {candidates.map((c) => (
          <Card key={c.id}><CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.user.name}</h3>
                  <Badge variant={c.status === "APPROVED" ? "success" : c.status === "REJECTED" ? "destructive" : "warning"}>{c.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.user.studentId} &middot; {c.user.department}</p>
                <p className="text-sm">{c.position.title} &mdash; {c.position.election.title}</p>
              </div>
              <div className="flex gap-2">
                {c.status === "PENDING" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleStatus(c.id, "APPROVED")}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatus(c.id, "REJECTED")}><X className="mr-1 h-4 w-4" /> Reject</Button>
                  </>
                )}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
