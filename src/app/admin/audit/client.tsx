"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  createdAt: string;
  user: { name: string; studentId: string; role: string };
}

const actionColors: Record<string, "default" | "warning" | "success" | "destructive"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "destructive",
  VOTE: "default",
};

export function AuditClient({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-2">
      {logs.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No audit logs yet.</p>
      )}
      {logs.map((log) => (
        <Card key={log.id}>
          <CardContent className="flex items-center gap-4 py-3">
            <Badge variant={actionColors[log.action] || "default"} className="w-16 justify-center">
              {log.action}
            </Badge>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{log.user.name}</span> ({log.user.studentId})
              </p>
              <p className="text-xs text-muted-foreground">{log.resource}</p>
              {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
