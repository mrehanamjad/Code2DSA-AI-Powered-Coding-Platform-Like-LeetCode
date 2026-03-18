"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-[clamp(60px,8vh,120px)] px-[clamp(20px,4vw,64px)] text-center overflow-hidden bg-background">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]" 
          style={{
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 100%)'
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-600/5 blur-[80px] animate-pulse [animation-delay:-2s]" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-[900px] mx-auto">
        
        {/* Pill Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md text-emerald-600 dark:text-emerald-400 font-['Outfit'] text-[11px] font-bold tracking-[0.1em] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next-Gen DSA Learning
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both font-['Outfit'] text-[clamp(40px,7vw,84px)] font-black leading-[1.05] tracking-tight text-foreground">
          Master Algorithms <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-200 drop-shadow-sm">
            with AI.
          </span>
        </h1>

        {/* Subheading */}
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both text-[clamp(16px,2vw,20px)] font-light leading-relaxed text-muted-foreground max-w-[600px]">
          Practice smarter with curated problems, real-time feedback, and a developer-first environment. 
          Built to help you <span className="text-foreground font-medium underline decoration-emerald-500/30 underline-offset-4">understand</span>, not just memorize.
        </p>

        {/* CTA Actions */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-[450ms] fill-mode-both flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/problems?page=1&sort=oldest" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-['Outfit'] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)]">
            Start Solving
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="#features" className="group flex items-center gap-2 px-4 py-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-emerald-500/50 backdrop-blur-md font-['Outfit'] font-bold text-sm text-muted-foreground hover:text-emerald-500 transition-all">
            Explore Features
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Stats Glass Plate */}
        {/* <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-[600ms] fill-mode-both relative mt-16 group">
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative flex flex-wrap items-center justify-center gap-x-[clamp(24px,6vw,80px)] gap-y-8 px-10 py-8 rounded-2xl border border-border bg-card/40 backdrop-blur-xl shadow-2xl">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-[clamp(24px,6vw,80px)]">
                <div className="flex flex-col items-center gap-1.5">
                  <span className={`font-['Outfit'] text-[clamp(24px,3vw,34px)] font-black tracking-tighter flex items-center gap-2 ${s.special ? 'text-emerald-500' : 'text-foreground'}`}>
                    {s.special && <Sparkles size={20} className="animate-pulse" />}
                    {s.value}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/70">
                    {s.label}
                  </span>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}