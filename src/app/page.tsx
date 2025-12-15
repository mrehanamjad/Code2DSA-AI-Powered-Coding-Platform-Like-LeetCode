import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Sparkles,
  Brain,
  Trophy,
  ArrowRight,
  Terminal,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { ImageCarousel } from "@/components/HomePg/ImageCarousel";
import Container from "@/components/Container";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Container>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/80"></div>

          <div className="w-full relative px-4 md:px-8">
            <div className="flex flex-col items-center gap-6 md:gap-8 py-16 md:py-24 lg:py-32 text-center">
              <Badge variant="secondary" className="gap-1.5 text-xs md:text-sm">
                <Sparkles className="h-3 w-3" />
                AI-Powered Coding Platform
              </Badge>

              <h1 className="max-w-4xl text-balance text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight sm:text-6xl lg:text-7xl">
                Master Algorithms with{" "}
                <span className="text-blue-600">AI-Powered</span> Learning
              </h1>

              <p className="max-w-2xl text-pretty text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed px-4">
                Practice data structures and algorithms with instant AI
                feedback. Run code in multiple languages, track your progress,
                and level up your skills.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4 w-full sm:w-auto px-4">
                <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/problems">
                    Start Solving
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="gap-2 bg-transparent w-full sm:w-auto"
                >
                  <Link href="/code">
                    <Terminal className="h-4 w-4" />
                    Try Code Editor
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* Image Carousel Section */}
      <Container>
        <section className="w-full py-7 lg:py-0 px-4 md:px-8">
          <ImageCarousel />
        </section>
      </Container>

      {/* Features Section */}
      <Container>
        <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
            <Badge variant="secondary" className="text-xs md:text-sm">
              Features
            </Badge>
            <h2 className="max-w-2xl text-balance text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              Everything you need to ace your interviews
            </h2>
            <p className="max-w-2xl text-pretty text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed px-4">
              A complete platform designed to help you master data structures
              and algorithms
            </p>
          </div>

          <div className="mt-12 md:mt-16 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  AI Code Analyzer
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Get instant AI-powered feedback on your code with time
                  complexity analysis, bug detection, and optimization
                  suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Terminal className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Multi-Language Support
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Code in Python, JavaScript, Java, C++, and 10+ more languages.
                  Run and test your solutions instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Target className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Curated Problems
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Practice with 500+ handpicked DSA problems covering arrays,
                  trees, graphs, dynamic programming, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Progress Tracking
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Track your learning journey with detailed stats, streaks, and
                  skill levels. Monitor your growth over time.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Real-Time Testing
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Run and submit your code against comprehensive test cases. Get
                  instant feedback on correctness and performance.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Gamified Learning
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Earn XP, level up, and maintain your streak. Make learning
                  algorithms fun and addictive.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>

      {/* How It Works */}
      <Container>
        <section className="border-y border-border bg-muted/40">
          <div className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-8">
            <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
              <Badge variant="secondary" className="text-xs md:text-sm">
                How It Works
              </Badge>
              <h2 className="max-w-2xl text-balance text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                Start solving in 3 simple steps
              </h2>
            </div>

            <div className="mt-12 md:mt-16 grid gap-8 md:gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center px-4">
                <div className="mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-xl md:text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
                  1
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Choose a Problem
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
                  Browse our curated collection of DSA problems filtered by
                  difficulty and topic.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <div className="mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-xl md:text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
                  2
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Write Your Solution
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
                  Code in your preferred language with syntax highlighting and
                  auto-completion.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <div className="mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-xl md:text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
                  3
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold">
                  Get AI Feedback
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
                  Submit your code and receive instant AI analysis with
                  optimization tips.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* CTA Section */}
      <Container>
        <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-8">
          <Card className="relative overflow-hidden border-2 border-primary">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
            <CardContent className="relative flex flex-col items-center gap-5 md:gap-6 p-8 md:p-12 text-center">
              <div className="inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10 shadow-lg shadow-primary/10">
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h2 className="max-w-2xl text-balance text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Ready to level up your coding skills?
              </h2>
              <p className="max-w-xl text-pretty text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                Join thousands of developers mastering algorithms with
                AI-powered learning.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4 w-full sm:w-auto">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/signup">Start Free Today</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Link href="/problems">Explore Problems</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </Container>
      {/* Footer */}
        <footer className="border-t border-border bg-muted/40">
      <Container>
          <div className="w-full py-12 px-4 md:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
               <Logo />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI-powered platform for mastering data structures and
                  algorithms.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-bold">Platform</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/problems"
                      className="hover:text-foreground transition-colors"
                    >
                      Problems
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/code"
                      className="hover:text-foreground transition-colors"
                    >
                      Code Editor
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="hover:text-foreground transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-bold">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-bold">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-border pt-8 text-center text-xs md:text-sm text-muted-foreground">
              <p>© 2025 Code2DSA. All rights reserved.</p>
            </div>
          </div>
      </Container>
        </footer>
    </div>
  );
}
