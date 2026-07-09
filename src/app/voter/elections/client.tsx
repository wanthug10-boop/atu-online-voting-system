"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/use-toast";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, Shield, Vote as VoteIcon } from "lucide-react";

interface Position {
  id: string;
  title: string;
  description: string;
  maxVotes: number;
  candidates: {
    id: string;
    photoUrl: string;
    manifesto: string;
    user: { name: string; studentId: string; department: string; level: number };
  }[];
}

interface Election {
  id: string;
  title: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  department: string;
  positions: Position[];
}

export function VoterElectionsClient({
  elections,
  votedPositions,
  voterId,
}: {
  elections: Election[];
  votedPositions: string[];
  voterId: string;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const isVoted = (electionId: string, positionId: string) =>
    submitted[electionId] || votedPositions.includes(`${electionId}:${positionId}`);

  function handleSelect(positionId: string, candidateId: string, maxVotes: number) {
    if (maxVotes === 1) {
      setSelections((prev) => ({ ...prev, [positionId]: prev[positionId] === candidateId ? "" : candidateId }));
    }
  }

  async function handleSubmit(electionId: string) {
    setSubmitting(true);

    const election = elections.find((e) => e.id === electionId);
    if (!election) return;

    const votes = election.positions
      .filter((p) => selections[p.id])
      .map((p) => ({ positionId: p.id, candidateId: selections[p.id] }));

    if (votes.length === 0) {
      toast({ title: "No votes selected", description: "Please select at least one candidate.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionId, votes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cast vote");
      }

      setSubmitted((prev) => ({ ...prev, [electionId]: true }));
      toast({ title: "Vote cast successfully!", description: "Your vote has been recorded.", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to cast vote", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  if (elections.length === 0) {
    return (
      <Card className="glass rounded-2xl border-border/40">
        <CardContent className="py-16 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">No active elections at the moment.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Check back when elections are announced.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {elections.map((election) => (
        <Card key={election.id} className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardHeader className="border-b border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <p className="text-sm text-muted-foreground/70 mt-0.5">{election.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">{election.type}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ends {formatDate(election.endDate)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {election.positions.map((position) => {
              const voted = isVoted(election.id, position.id);
              const selected = selections[position.id];

              return (
                <div key={position.id}>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{position.title}</h3>
                    {position.description && (
                      <p className="text-sm text-muted-foreground/70">{position.description}</p>
                    )}
                  </div>
                  {voted ? (
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5 text-center">
                      <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                      <p className="text-sm font-medium text-emerald-400">You have voted for this position</p>
                    </div>
                  ) : position.candidates.length === 0 ? (
                    <div className="rounded-xl bg-muted/20 p-5 text-center">
                      <p className="text-sm text-muted-foreground">No approved candidates for this position.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {position.candidates.map((candidate) => (
                        <button
                          key={candidate.id}
                          type="button"
                          onClick={() => handleSelect(position.id, candidate.id, position.maxVotes)}
                          className={`rounded-xl border p-5 text-left transition-all duration-200 ${
                            selected === candidate.id
                              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30 shadow-lg shadow-primary/10"
                              : "border-border/30 bg-background/20 hover:border-border/50 hover:bg-background/30"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold bg-primary/10 text-primary">
                              {candidate.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{candidate.user.name}</p>
                              <p className="text-xs text-muted-foreground">{candidate.user.studentId}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{candidate.user.department}</p>
                          {candidate.manifesto && (
                            <p className="mt-2 text-xs text-muted-foreground/60 italic line-clamp-2 border-t border-border/20 pt-2">
                              &ldquo;{candidate.manifesto}&rdquo;
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-6 bg-border/20" />
                </div>
              );
            })}
          </CardContent>
          {!submitted[election.id] && (
            <CardFooter className="border-t border-border/20 pt-4">
              <Button
                onClick={() => handleSubmit(election.id)}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
              >
                <VoteIcon className="mr-2 h-4 w-4" />
                {submitting ? "Submitting..." : "Cast Your Votes"}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
