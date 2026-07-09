"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/lib/use-toast";
import { UNIVERSITY_SHORT } from "@/lib/constants";
import { Shield, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: formData.get("studentId"),
          name: formData.get("name"),
          department: formData.get("department"),
          level: parseInt(formData.get("level") as string),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      toast({ title: "Account created!", description: "You can now sign in.", variant: "success" });
      router.push("/auth/login");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="orb h-[400px] w-[400px] bg-emerald-500/15 -right-48 -top-48 animate-float" />
      <div className="orb h-[350px] w-[350px] bg-cyan-500/10 left-0 bottom-0 animate-float-delayed" />
      <div className="mesh-bg fixed inset-0" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 glow">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">{UNIVERSITY_SHORT} Voting</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your student account</p>
        </div>

        <Card className="glass-strong rounded-2xl">
          <CardHeader className="text-center pb-2">
            <CardDescription className="text-muted-foreground/80">Fill in your details to register</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-muted-foreground">Student ID</Label>
                  <Input id="studentId" name="studentId" placeholder="2023001" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-muted-foreground">Level</Label>
                  <Input id="level" name="level" type="number" min={1} max={4} placeholder="1" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-muted-foreground">Department</Label>
                <Input id="department" name="department" placeholder="Computer Science" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a password" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-muted-foreground">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" required className="bg-background/50 border-border/50 focus:border-primary/50 h-11" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full h-11 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30" disabled={loading}>
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
