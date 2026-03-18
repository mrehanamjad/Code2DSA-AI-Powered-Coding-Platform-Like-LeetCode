"use client"

import { ImageCarousel } from "@/components/HomePg/ImageCarousel"
import { HeroSection }    from "@/components/HomePg/HeroSection"
import { FeaturesSection } from "@/components/HomePg/FeaturesSection"
import { HowItWorksSection } from "@/components/HomePg/HowItWorksSection"
import { CTASection }     from "@/components/HomePg/Ctasection"
import { FooterSection }  from "@/components/HomePg/Footersection"
import Container from "@/components/Container"

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        /* ── Light ── */
        .hp-root {
          --hp-accent:        #16a34a;
          --hp-accent-dim:    rgba(22,163,74,0.10);
          --hp-accent-glow:   rgba(22,163,74,0.18);
          --hp-bg:            var(--background);
          --hp-surface:       var(--card);
          --hp-border:        var(--border);
          --hp-border-bright: var(--input);
          --hp-text:          var(--foreground);
          --hp-text-muted:    var(--muted-foreground);
          --hp-primary-fg:    var(--primary-foreground);
        }
        /* ── Dark ── */
        .dark .hp-root {
          --hp-accent:        #7EE8A2;
          --hp-accent-dim:    rgba(126,232,162,0.12);
          --hp-accent-glow:   rgba(126,232,162,0.22);
          --hp-bg:            var(--background);
          --hp-surface:       var(--card);
          --hp-border:        var(--border);
          --hp-border-bright: var(--input);
          --hp-text:          var(--foreground);
          --hp-text-muted:    var(--muted-foreground);
          --hp-primary-fg:    var(--primary-foreground);
        }

        .hp-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--hp-bg);
          color: var(--hp-text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .hp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* ── CAROUSEL SECTION ── */
        .hp-carousel-section {
          position: relative;
          padding: clamp(48px,6vh,80px) clamp(20px,4vw,64px);
          background: var(--hp-surface);
          border-top: 1px solid var(--hp-border);
          border-bottom: 1px solid var(--hp-border);
        }
        .hp-section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--hp-accent);
          margin-bottom: 16px;
        }
        .hp-section-label::before {
          content: '';
          display: block;
          width: 24px;
          height: 1.5px;
          background: var(--hp-accent);
        }

        @media (max-width: 680px) {
          .hp-nav-links { display: none; }
        }
      `}</style>

      <div className="hp-root">
        <HeroSection />

        <section className="hp-carousel-section">
          <Container>
            <div className="hp-section-label">Platform Preview</div>
            <ImageCarousel />
          </Container>
        </section>

        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
        <FooterSection />
      </div>
    </>
  )
}