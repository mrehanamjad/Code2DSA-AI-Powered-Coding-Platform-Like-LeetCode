"use client"
import Link from "next/link"
import { Github, Linkedin, ChevronRight, ExternalLink } from "lucide-react"
import Container from "@/components/Container"
import Logo from "@/components/Logo"

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border pt-[clamp(48px,6vh,80px)] px-[clamp(20px,4vw,64px)] pb-[clamp(24px,3vh,40px)] font-sans">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-[clamp(32px,4vw,64px)] mb-[clamp(32px,4vh,56px)]">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground max-w-[300px]">
              The AI-powered platform for mastering data structures and algorithms. 
              Practice smarter, build confidence, and land your dream offer.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-5">
            <p className="font-['Outfit'] text-[12px] font-bold tracking-[0.1em] uppercase text-foreground">
              Platform
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link 
                  href="/problems?page=1&sort=oldest" 
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  Explore Problems
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  Your Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-5">
            <p className="font-['Outfit'] text-[12px] font-bold tracking-[0.1em] uppercase text-foreground">
              Connect
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://github.com/mrehanamjad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <Github size={16} /> 
                  GitHub
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mrehanamjad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <Linkedin size={16} /> 
                  LinkedIn
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-[clamp(20px,3vh,32px)] border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] font-light text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear}</span>
            <span className="font-medium text-foreground">Code2DSA</span>
            <span className="hidden sm:inline mx-1">•</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-1">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/mrehanamjad"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors decoration-emerald-500/30 underline underline-offset-4"
            >
              M. Rehan Amjad
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}