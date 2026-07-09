"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

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
      <Card>
        <CardContent className="py-12 text-center">
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
          <Card key={election.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{election.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {election.positions.length} positions &middot; {totalVotes} total votes cast
                  </p>
                </div>
                <Badge variant={election.status === "CLOSED" ? "default" : "success"}>
                  {election.status}
                </Badge>
              </div>
              {election.status !== "ACTIVE" && (
                <p className="text-xs text-muted-foreground">Ended {formatDate(election.endDate)}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {election.positions.map((position) => {
                const maxVotes = Math.max(...position.candidates.map((c) => c._count.votes), 1);
                const sorted = [...position.candidates].sort((a, b) => b._count.votes - a._count.votes);

                return (
                  <div key={position.id}>
                    <h3 className="mb-3 font-semibold">{position.title}</h3>
                    <div className="space-y-2">
                      {sorted.map((candidate, index) => {
                        const percentage = Math.round((candidate._count.votes / maxVotes) * 100);
                        const isLeading = index === 0 && candidate._count.votes > 0;

                        return (
                          <div key={candidate.id} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className={isLeading ? "font-semibold" : ""}>
                                {candidate.user.name}
                                {isLeading && election.status !== "ACTIVE" && " (Winner)"}
                              </span>
                              <span className="text-muted-foreground">
                                {candidate._count.votes} vote{candidate._count.votes !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isLeading ? "bg-primary" : "bg-muted-foreground/30"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="mt-4" />
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
