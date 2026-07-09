import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UNIVERSITY_NAME, UNIVERSITY_SHORT } from "@/lib/constants";
import { Vote, Shield, BarChart3, Users, Calendar, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <div className="orb h-[500px] w-[500px] bg-emerald-500/20 -left-64 -top-64 animate-float" />
      <div className="orb h-[400px] w-[400px] bg-cyan-500/15 right-0 top-1/3 animate-float-delayed" />
      <div className="orb h-[600px] w-[600px] bg-emerald-500/10 left-1/3 -bottom-96 animate-float-slow" />

      {/* Mesh gradient overlay */}
      <div className="mesh-bg fixed inset-0" />

      {/* Navbar */}
      <header className="relative z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 glow-sm">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-gradient">{UNIVERSITY_SHORT} Voting</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16 text-center md:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" />
            Secure Online Voting Platform
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {UNIVERSITY_NAME}
            <br />
            <span className="text-gradient">Online Voting System</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A secure, transparent, and modern platform for student elections.
            Cast your vote for SRC, departmental, hall, and class representatives
            with confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105">
                <Vote className="mr-2 h-5 w-5" /> Start Voting
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 pb-16">
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card-3d group relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/50"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {UNIVERSITY_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const stats = [
  { label: "Students Registered", value: "3,000+" },
  { label: "Elections Held", value: "50+" },
  { label: "Votes Cast", value: "15,000+" },
];

const features = [
  {
    title: "Secure & Anonymous",
    description: "Your vote is encrypted and anonymous. One student, one vote per position with blockchain-grade security.",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Multiple Election Types",
    description: "Supports SRC, departmental, hall, and class-level elections simultaneously with independent management.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Real-time Results",
    description: "View live results with interactive charts and detailed analytics when elections conclude.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "Candidate Profiles",
    description: "Candidates can upload photos, share manifestos, and connect with voters before elections.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Voter Verification",
    description: "Secure student identity verification ensures only eligible students can participate.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Audit Trail",
    description: "Complete transparency with a full audit log of all system actions and voting activity.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
];
