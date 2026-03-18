"use client"

import Link from "next/link"
import { Sparkles, Flame, ArrowRight } from "lucide-react"
import Container from "@/components/Container"

export function CTASection() {
  return (
    <section className="bg-background py-[clamp(80px,10vh,140px)] font-sans relative overflow-hidden">
      <Container>
        {/* --- The Master Card --- */}
        <div className="relative group rounded-[40px] border border-border bg-card overflow-hidden px-8 py-20 md:py-28 text-center shadow-2xl shadow-emerald-500/5">
          
          {/* 1. Background Grid & Glow Mesh */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Radial glow that follows a subtle pulse */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
            
            {/* Grid Pattern with Mask */}
            <div 
              className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]" 
              style={{
                backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
                maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
              }}
            />
          </div>

          {/* 2. Content Layer */}
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto">
            
            {/* Icon with Flame Glow */}
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-[#7EE8A2] shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Flame size={36} strokeWidth={1.5} className="animate-pulse" />
              </div>
              {/* Subtle orbital spark */}
              <div className="absolute -top-1 -right-1">
                <Sparkles size={18} className="text-emerald-400 animate-bounce" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-4">
              <h2 className="font-['Outfit'] text-[clamp(32px,5vw,60px)] font-black tracking-tight text-foreground leading-[1.05]">
                Ready to level up <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-[#7EE8A2] dark:to-emerald-200">
                  your coding career?
                </span>
              </h2>
              <p className="text-[clamp(15px,1.8vw,19px)] font-light leading-relaxed text-muted-foreground max-w-lg mx-auto">
                Join developers sharpening their problem-solving skills with AI-driven insights and a elite problem set.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link 
                href="/register" 
                className="group flex items-center gap-2 px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-['Outfit'] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)]"
              >
                Start Free Today
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/problems?page=1&sort=oldest" 
                className="group flex items-center gap-2 px-10 py-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-emerald-500/50 backdrop-blur-md font-['Outfit'] font-bold text-sm text-muted-foreground hover:text-emerald-500 transition-all"
              >
                Explore Problems
              </Link>
            </div>

            {/* Trust Badging / Micro-copy */}
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <div className="h-px w-8 bg-border" />
              . . .
              <div className="h-px w-8 bg-border" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}