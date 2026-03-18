import { Target, Code2, Sparkles, LucideIcon } from "lucide-react"
import Container from "@/components/Container"

interface Step {
  step: string
  title: string
  description: string
  icon: LucideIcon
}

const STEPS_DATA: Step[] = [
  {
    step: "01",
    title: "Pick a Challenge",
    description: "Filter by difficulty, topic, or company tag. Find the problem that fits exactly where you are today.",
    icon: Target,
  },
  {
    step: "02",
    title: "Write Your Solution",
    description: "Full-featured editor with syntax highlighting, auto-complete, and multi-language toggle.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Get AI-Powered Insights",
    description: "Submit and receive deep analysis: complexity breakdown, alternative approaches, and specific improvements.",
    icon: Sparkles,
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-background py-[clamp(80px,10vh,140px)]">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.05)_0%,transparent_70%)] pointer-events-none" />

      <Container className="relative">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-[clamp(60px,8vh,100px)]">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-[0.1em] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Workflow
          </div>
          <h2 className="font-['Outfit'] text-[clamp(32px,5vw,56px)] font-black tracking-tight leading-[1] text-foreground max-w-2xl">
            Three steps to your <span className="text-emerald-600">next offer</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {STEPS_DATA.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="group relative flex flex-col items-start z-10">
                {/* Card Top Section */}
                <div className="flex items-center justify-between w-full mb-6">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:border-emerald-500/50 group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)]">
                      <Icon size={32} className="text-muted-foreground group-hover:text-emerald-500 transition-colors duration-500" />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 flex items-center justify-center h-8 px-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold tracking-tighter shadow-lg shadow-emerald-900/20">
                      {s.step}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 transition-transform duration-500 group-hover:translate-x-1">
                  <h3 className="font-['Outfit'] text-2xl font-bold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground/80 font-normal">
                    {s.description}
                  </p>
                </div>

                {/* Subtle Bottom Glow on Hover */}
                <div className="absolute -bottom-4 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-500 group-hover:w-full opacity-50" />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}