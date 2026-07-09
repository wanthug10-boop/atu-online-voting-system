"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/use-toast";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

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
      toast({ title: "Vote cast successfully!", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to cast vote", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  if (elections.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No active elections at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {elections.map((election) => (
        <Card key={election.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{election.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{election.description}</p>
              </div>
              <Badge variant="outline">{election.type}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ends {formatDate(election.endDate)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {election.positions.map((position) => {
              const voted = isVoted(election.id, position.id);
              const selected = selections[position.id];

              return (
                <div key={position.id}>
                  <div className="mb-3">
                    <h3 className="font-semibold">{position.title}</h3>
                    {position.description && (
                      <p className="text-sm text-muted-foreground">{position.description}</p>
                    )}
                  </div>
                  {voted ? (
                    <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-700 dark:bg-green-950 dark:text-green-100">
                      <CheckCircle className="mx-auto mb-1 h-5 w-5" />
                      You have voted for this position
                    </div>
                  ) : position.candidates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No approved candidates for this position.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {position.candidates.map((candidate) => (
                        <button
                          key={candidate.id}
                          type="button"
                          onClick={() => handleSelect(position.id, candidate.id, position.maxVotes)}
                          className={`rounded-lg border p-4 text-left transition-all ${
                            selected === candidate.id
                              ? "border-primary bg-primary/5 ring-2 ring-primary"
                              : "hover:border-muted-foreground/25"
                          }`}
                        >
                          <p className="font-medium">{candidate.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {candidate.user.studentId} &middot; {candidate.user.department}
                          </p>
                          {candidate.manifesto && (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{candidate.manifesto}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-6" />
                </div>
              );
            })}
          </CardContent>
          {!submitted[election.id] && (
            <CardFooter>
              <Button onClick={() => handleSubmit(election.id)} disabled={submitting}>
                {submitting ? "Submitting..." : "Cast Votes"}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
