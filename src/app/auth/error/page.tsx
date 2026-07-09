import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Something went wrong during authentication.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Please try signing in again. If the problem persists, contact the IT support team.
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/auth/login">
            <Button>Back to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
