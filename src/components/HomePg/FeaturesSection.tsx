"use client"

import Image from "next/image"
import { Brain, Terminal, Target, BarChart3, Zap, LucideIcon,  ListOrdered } from "lucide-react"
import Container from "@/components/Container"

interface FeatureItem {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  image: string
  imageAlt: string
  isAnimated?: boolean // Flag for GIF/Animation optimization
}

const FEATURES_DATA: FeatureItem[] = [
  {
    title: "AI Code Analyzer",
    description: "Instant feedback on complexity, bug detection, and optimization paths.",
    icon: Brain,
    accent: "#10b981",
    image: "/images/aiAnalyze.png", 
    imageAlt: "AI Code Analyzer",
  },
  {
    title: "Curated Problem Bank",
    description: "Handpicked DSA problems across Arrays, Trees, and Graphs.",
    icon: Target,
    accent: "#f59e0b",
    image: "/images/problemTable.png",
    imageAlt: "Problem Library Catalog",
  },
  {
    title: "Multi-Language Editor",
    description: "Integrated compiler for Python, JavaScript, Java, C++, Go,Rust and many more.",
    icon: Terminal,
    accent: "#0ea5e9",
    image: "/images/editor.png",
    imageAlt: "Code Editor Interface",
  },
  {
    title: "Real-Time Testing",
    description: "Run against comprehensive test suites the moment you submit.",
    icon: Zap,
    accent: "#f97316",
    image: "/images/codeTesting.png",
    imageAlt: "Test Runner Animation",
    isAnimated: true,
  },
  {
    title: "Progress Analytics",
    description: "Heatmaps, streaks, and skill curves to track your growth metrics.",
    icon: BarChart3,
    accent: "#a855f7",
    image: "/images/stats.png",
    imageAlt: "Performance Stats Dashboard",
  },
  {
  title: "Custom Learning Paths",
  description: "Create personalized problem lists, organize with drag-and-drop, and share public or private learning paths with others.",
  icon: ListOrdered, // or Layers / Folder / LayoutList
  accent: "#ec4899",
  image: "/images/customLists.png",
  imageAlt: "Custom Problem Lists Interface",
}
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-[clamp(60px,8vh,100px)] overflow-hidden font-sans">
      <Container>
        {/* --- Header --- */}
        <div className="flex flex-col items-center text-center mb-12 space-y-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
            <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
            Core Features
          </div>
          <h2 className="font-['Outfit'] text-[clamp(28px,3.5vw,44px)] font-black tracking-tight text-foreground leading-tight">
            Master DSA with <span className="text-muted-foreground/40 italic">precision</span>
          </h2>
        </div>

        {/* --- Compact Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {FEATURES_DATA.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group relative flex flex-col h-[400px] rounded-[24px] border border-border bg-card overflow-hidden transition-all duration-500 will-change-transform hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]"
              >
                {/* Content Header */}
                <div className="p-6 pb-2 relative z-20">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ backgroundColor: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
                  >
                    <Icon size={20} style={{ color: feature.accent }} />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-foreground mb-1.5 flex items-center justify-between">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground font-light line-clamp-2 max-w-[90%]">
                    {feature.description}
                  </p>
                </div>

                {/* --- Optimized Image Container: Bleeding Right/Bottom --- */}
                <div className="relative mt-auto h-[220px] w-full overflow-hidden pl-6">
                  <div className="relative h-full w-full rounded-tl-xl overflow-hidden border-l border-t border-border/40 shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-left"
                      priority={i < 3}
                      quality={feature.isAnimated ? 100 : 90}
                      unoptimized={feature.isAnimated} // Optimized way to handle animated GIFs in Next.js
                    />
                    
                    {/* Depth Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none z-10 opacity-60" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                  </div>
                </div>

                {/* Subtle Hover Glow */}
                <div 
                  className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-0 group-hover:opacity-[0.08] blur-[60px] -z-10 transition-opacity duration-700 pointer-events-none" 
                  style={{ backgroundColor: feature.accent }}
                />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}