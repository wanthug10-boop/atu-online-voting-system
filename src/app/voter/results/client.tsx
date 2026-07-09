"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { BarChart3, Trophy } from "lucide-react";

interface CandidateResult {
  id: string;
  user: { name: string; studentId: string; department: string };
  _count: { votes: number };
}

interface PositionResult {
  id: string;
  title: string;
  candidates: CandidateResult[];
}

interface ElectionResult {
  id: string;
  title: string;
  type: string;
  status: string;
  endDate: string;
  positions: PositionResult[];
  _count: { votes: number; voterRegistrations: number };
}

export function ResultsClient({ elections }: { elections: ElectionResult[] }) {
  if (elections.length === 0) {
    return (
      <Card className="glass rounded-2xl border-border/40">
        <CardContent className="py-16 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">No election results available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {elections.map((election) => {
        const totalVotes = election._count.votes;

        return (
          <Card key={election.id} className="glass rounded-2xl border-border/40 overflow-hidden">
            <CardHeader className="border-b border-border/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{election.title}</CardTitle>
                  <p className="text-sm text-muted-foreground/70 mt-0.5">
                    {election.positions.length} positions &middot; {totalVotes} total votes cast
                  </p>
                </div>
                <Badge variant={election.status === "CLOSED" ? "default" : "success"} className="bg-primary/5 border-primary/20 text-primary">
                  {election.status}
                </Badge>
              </div>
              {election.status !== "ACTIVE" && (
                <p className="text-xs text-muted-foreground/60">Ended {formatDate(election.endDate)}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {election.positions.map((position) => {
                const maxVotes = Math.max(...position.candidates.map((c) => c._count.votes), 1);
                const sorted = [...position.candidates].sort((a, b) => b._count.votes - a._count.votes);

                return (
                  <div key={position.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-semibold text-lg">{position.title}</h3>
                      {sorted[0]?._count.votes > 0 && election.status !== "ACTIVE" && (
                        <Trophy className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <div className="space-y-3">
                      {sorted.map((candidate, index) => {
                        const percentage = Math.round((candidate._count.votes / maxVotes) * 100);
                        const isLeading = index === 0 && candidate._count.votes > 0;

                        return (
                          <div key={candidate.id} className="rounded-xl bg-background/20 border border-border/20 p-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                  {candidate.user.name.charAt(0)}
                                </div>
                                <div>
                                  <span className={isLeading ? "font-semibold text-foreground" : "text-foreground/80"}>
                                    {candidate.user.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground/60 ml-2">{candidate.user.studentId}</span>
                                </div>
                              </div>
                              <span className="text-muted-foreground/70 font-medium">
                                {candidate._count.votes} vote{candidate._count.votes !== 1 ? "s" : ""}
                                {isLeading && election.status !== "ACTIVE" && (
                                  <span className="text-emerald-400 ml-1 text-xs">(Winner)</span>
                                )}
                              </span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-background/30">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isLeading ? "bg-gradient-to-r from-emerald-400 to-cyan-400" : "bg-muted-foreground/20"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="mt-4 bg-border/20" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
