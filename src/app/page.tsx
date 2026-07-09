import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UNIVERSITY_NAME, UNIVERSITY_SHORT } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            {UNIVERSITY_SHORT} Voting
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {UNIVERSITY_NAME}
            <span className="block text-primary">Online Voting System</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A secure and transparent platform for student elections. Cast your vote for SRC,
            departmental, hall, and class representatives.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border p-6 text-center">
                  <div className="mb-4 text-3xl">{feature.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {UNIVERSITY_NAME}. All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Secure Voting",
    description: "Your vote is encrypted and anonymous. One student, one vote per position.",
    icon: "🔒",
  },
  {
    title: "Multiple Elections",
    description: "Supports SRC, departmental, hall, and class-level elections simultaneously.",
    icon: "🗳️",
  },
  {
    title: "Real-time Results",
    description: "View live results with interactive charts when elections conclude.",
    icon: "📊",
  },
];
