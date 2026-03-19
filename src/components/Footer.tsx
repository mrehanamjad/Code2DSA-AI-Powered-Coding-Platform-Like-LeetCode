"use client"
import Link from "next/link"
import { Github, Linkedin, ExternalLink } from "lucide-react"
import Container from "@/components/Container"
import { usePathname } from "next/navigation"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  if(pathname.startsWith("/problems/")) return null

  return (
    <footer className="bg-card border-t border-border px-[clamp(20px,4vw,64px)] pb-[clamp(24px,3vh,40px)] font-sans">
      <Container>

        <div className="pt-[clamp(20px,3vh,32px)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] font-light text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear}</span>
            <span className="font-medium text-foreground">Code2DSA</span>
            <span className="hidden sm:inline mx-1">•</span>
            <span>All rights reserved.</span>
          </div>

            <ul className="flex gap-3">
              <li>
                <Link
                  href="https://github.com/mrehanamjad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <Github size={16} /> 
                  GitHub
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/mrehanamjad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-emerald-600 dark:hover:text-[#7EE8A2] transition-colors duration-200"
                >
                  <Linkedin size={16} /> 
                  LinkedIn
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          
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