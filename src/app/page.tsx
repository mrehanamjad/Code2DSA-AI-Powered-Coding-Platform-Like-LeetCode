import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Brain,
  Trophy,
  ArrowRight,
  Terminal,
  Zap,
  Target,
  BarChart3,
  Github,
  Linkedin,
} from "lucide-react";
import { ImageCarousel } from "@/components/HomePg/ImageCarousel";
import Container from "@/components/Container";
import Logo from "@/components/Logo";

// --- Configuration Data ---
// Extracting static data makes the component cleaner and easier to maintain
const FEATURES_DATA = [
  {
    title: "AI Code Analyzer",
    description: "Get instant AI-powered feedback on your code with time complexity analysis, bug detection, and optimization suggestions.",
    icon: Brain,
  },
  {
    title: "Multi-Language Support",
    description: "Code in Python, JavaScript, Java, C++, and 10+ more languages. Run and test your solutions instantly.",
    icon: Terminal,
  },
  {
    title: "Curated Problems",
    description: "Practice with 500+ handpicked DSA problems covering arrays, trees, graphs, dynamic programming, and more.",
    icon: Target,
  },
  {
    title: "Progress Tracking",
    description: "Track your learning journey with detailed stats, streaks, and skill levels. Monitor your growth over time.",
    icon: BarChart3,
  },
  {
    title: "Real-Time Testing",
    description: "Run and submit your code against comprehensive test cases. Get instant feedback on correctness and performance.",
    icon: Zap,
  },
  {
    title: "Gamified Learning",
    description: "Earn XP, level up, and maintain your streak. Make learning algorithms fun and addictive.",
    icon: Trophy,
  },
];

const STEPS_DATA = [
  {
    step: "1",
    title: "Choose a Problem",
    description: "Browse our curated collection of DSA problems filtered by difficulty and topic.",
  },
  {
    step: "2",
    title: "Write Your Solution",
    description: "Code in your preferred language with syntax highlighting and auto-completion.",
  },
  {
    step: "3",
    title: "Get AI Feedback",
    description: "Submit your code and receive instant AI analysis with optimization tips.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-border">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/80"></div>

        <Container>
          <div className="relative flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24 lg:py-32 px-4 md:px-8">
            <Badge variant="secondary" className="gap-1.5 text-xs md:text-sm shadow-sm">
              <Sparkles className="h-3 w-3" />
              AI-Powered Coding Platform
            </Badge>

            <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Master Algorithms with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Learning
            </h1>

            <p className="max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed md:text-lg lg:text-xl">
              Practice data structures and algorithms with instant AI feedback. Run code in multiple languages, track your progress, and level up your skills.
            </p>

            <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto justify-center pt-4">
              <Button size="lg" asChild className="gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
                <Link href="/problems">
                  Start Solving
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Image Carousel Section */}
      <section className="w-full py-8 lg:py-12 border-b border-border/50 bg-muted/20">
        <Container>
          <div className="px-4 md:px-8">
            <ImageCarousel />
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <Container>
          <div className="px-4 md:px-8">
            <div className="flex flex-col items-center gap-3 text-center md:gap-4 mb-12 md:mb-16">
              <Badge variant="outline" className="text-xs md:text-sm uppercase tracking-wider">
                Features
              </Badge>
              <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Everything you need to ace your interviews
              </h2>
              <p className="max-w-2xl text-pretty text-muted-foreground text-base leading-relaxed md:text-lg">
                A complete platform designed to help you master data structures and algorithms effectively.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES_DATA.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} className="group relative overflow-hidden border transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-24 lg:py-32 border-y border-border bg-muted/40">
        <Container>
          <div className="px-4 md:px-8">
            <div className="flex flex-col items-center gap-3 text-center md:gap-4 mb-12 md:mb-16">
              <Badge variant="outline" className="text-xs md:text-sm uppercase tracking-wider">
                How It Works
              </Badge>
              <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Start solving in 3 simple steps
              </h2>
            </div>

            <div className="grid gap-8 md:gap-12 md:grid-cols-3">
              {STEPS_DATA.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-110">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="max-w-sm text-muted-foreground leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <Container>
          <div className="px-4 md:px-8">
            <Card className="relative overflow-hidden border-2 border-primary/50 shadow-2xl shadow-primary/5">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
              
              <CardContent className="relative flex flex-col items-center gap-6 p-8 text-center md:p-16">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  Ready to level up your coding skills?
                </h2>
                <p className="max-w-xl text-pretty text-muted-foreground text-base leading-relaxed md:text-lg">
                  Join thousands of developers mastering algorithms with AI-powered learning.
                </p>
                <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto justify-center mt-4">
                  <Button size="lg" asChild className="w-full sm:w-auto font-semibold">
                    <Link href="/signup">Start Free Today</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto bg-background/50 backdrop-blur-sm"
                  >
                    <Link href="/problems?page=1&sort=oldest">Explore Problems</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

     {/* Footer */}
      <footer className="w-full border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            
            {/* Brand Column */}
            <div className="flex flex-col gap-4">
              <Logo />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                The ultimate AI-powered platform for mastering data structures and algorithms. 
              </p>
            </div>

            {/* Platform Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold tracking-tight text-foreground">Platform</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/problems?page=1&sort=oldest" className="transition-colors duration-200 hover:text-primary">
                    Explore Problems
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="transition-colors duration-200 hover:text-primary">
                    Your Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect & Socials */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold tracking-tight text-foreground">Connect</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://github.com/mrehanamjad" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-2 transition-colors duration-200 hover:text-primary"
                  >
                    <Github className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/mrehanamjad" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-2 transition-colors duration-200 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Code2DSA. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Built by{" "}
              <a 
                href="https://github.com/mrehanamjad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-foreground transition-colors hover:text-primary"
              >
                M.Rehan Amjad
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}