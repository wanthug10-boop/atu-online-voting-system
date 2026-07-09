"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { History } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  user: { name: string; studentId: string; role: string };
}

const actionColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "destructive",
  VOTE: "default",
};

export function AuditClient({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-2">
      {logs.length === 0 && (
        <Card className="glass rounded-2xl border-border/40">
          <CardContent className="py-12 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No audit logs yet.</p>
          </CardContent>
        </Card>
      )}
      {logs.map((log) => (
        <Card key={log.id} className="glass rounded-2xl border-border/40 overflow-hidden">
          <CardContent className="flex items-center gap-4 py-3">
            <Badge variant={actionColors[log.action] || "default"} className="w-16 justify-center shrink-0">
              {log.action}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{log.user.name}</span>
                <span className="text-muted-foreground/60"> ({log.user.studentId})</span>
              </p>
              <p className="text-xs text-muted-foreground/60 truncate">{log.resource}</p>
              {log.details && <p className="text-xs text-muted-foreground/50 truncate">{log.details}</p>}
            </div>
            <span className="text-xs text-muted-foreground/50 shrink-0">{formatDate(log.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
