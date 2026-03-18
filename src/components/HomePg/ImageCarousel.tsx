"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface CarouselItem {
  src: string
  alt: string
  title: string
  description: string
  tag: string
}

const carouselItems: CarouselItem[] = [
  {
    src: "/images/allProblems.png",
    alt: "Practice Problems",
    title: "Explore Curated Problems",
    description: "Filter by difficulty and topic while tracking your progress across every challenge",
    tag: "Problem Library",
  },
  {
    src: "/images/problem.png",
    alt: "Code Editor",
    title: "Powerful Multi-Language Editor",
    description: "Write, run, and submit solutions with real-time test case validation",
    tag: "Code Editor",
  },
  {
    src: "/images/aiAnalyze.png",
    alt: "AI Code Analyzer",
    title: "Instant AI-Powered Feedback",
    description: "Get time complexity analysis, optimization suggestions, and bug detection",
    tag: "AI Analysis",
  },
  {
    src: "/images/stats.png",
    alt: "User Profile",
    title: "Track Your Progress",
    description: "Monitor your stats, streaks, and skill development over time",
    tag: "Analytics",
  },
  {
    src: "/images/customLists.png",
    alt: "Custom Problem Lists",
    title: "Create & Share Learning Paths",
    description: "Build custom problem playlists, keep them private or share with others, and design your own DSA journey",
    tag: "Custom Lists",
  }
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 5000

  const resetProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    if (!isAutoPlaying) return
    const start = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
    }, 16)
  }

  useEffect(() => {
    resetProgress()
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [currentIndex, isAutoPlaying])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      navigate("next")
    }, DURATION)
    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  const navigate = (dir: "next" | "prev") => {
    setDirection(dir)
    setPrevIndex(currentIndex)
    setCurrentIndex((prev) =>
      dir === "next"
        ? (prev + 1) % carouselItems.length
        : (prev - 1 + carouselItems.length) % carouselItems.length
    )
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    navigate("prev")
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    navigate("next")
  }

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    setIsAutoPlaying(false)
    setDirection(index > currentIndex ? "next" : "prev")
    setPrevIndex(currentIndex)
    setCurrentIndex(index)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        /* Light mode */
        .carousel-root {
          --cr-accent:      #16a34a;
          --cr-accent-dim:  rgba(22,163,74,0.10);
          --cr-accent-glow: rgba(22,163,74,0.25);
          --cr-surface:     var(--card);
          --cr-border:      var(--border);
          --cr-text:        var(--foreground);
          --cr-text-muted:  var(--muted-foreground);
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          width: 100%;
          user-select: none;
        }

        /* Dark mode */
        .dark .carousel-root {
          --cr-accent:      #7EE8A2;
          --cr-accent-dim:  rgba(126,232,162,0.12);
          --cr-accent-glow: rgba(126,232,162,0.28);
          --cr-surface:     rgba(10,10,14,0.92);
          --cr-border:      rgba(255,255,255,0.08);
          --cr-text:        #F0EDE8;
          --cr-text-muted:  rgba(240,237,232,0.5);
        }

        .carousel-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 20px;
          overflow: hidden;
          background: var(--cr-surface);
          box-shadow:
            0 0 0 1px var(--cr-border),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 120px var(--cr-accent-glow);
        }

        /* Slides */
        .slide {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .slide-image {
          position: absolute;
          inset: 0;
          transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.6s ease;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            transparent 30%,
            rgba(5, 5, 8, 0.5) 60%,
            rgba(5, 5, 8, 0.95) 100%
          );
          z-index: 2;
        }

        .slide-noise {
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px;
          pointer-events: none;
        }

        /* Active / inactive states */
        .slide-enter-next {
          animation: enterFromRight 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .slide-enter-prev {
          animation: enterFromLeft 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .slide-exit-next {
          animation: exitToLeft 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .slide-exit-prev {
          animation: exitToRight 0.75s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .slide-idle {
          opacity: 0;
          transform: translateX(100%);
        }

        @keyframes enterFromRight {
          from { opacity: 0; transform: translateX(6%) scale(1.02); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes enterFromLeft {
          from { opacity: 0; transform: translateX(-6%) scale(1.02); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes exitToLeft {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(-4%) scale(0.98); }
        }
        @keyframes exitToRight {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(4%) scale(0.98); }
        }

        /* Content area */
        .slide-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          padding: clamp(20px, 4vw, 48px);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }

        .slide-text {
          max-width: 60%;
        }

        .slide-tag {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(9px, 1.1vw, 12px);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cr-accent);
          margin-bottom: clamp(6px, 1vw, 12px);
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeUp 0.5s 0.2s ease forwards;
        }

        .slide-tag::before {
          content: '';
          display: block;
          width: 20px;
          height: 1.5px;
          background: var(--cr-accent);
          flex-shrink: 0;
        }

        .slide-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(16px, 2.8vw, 36px);
          font-weight: 700;
          line-height: 1.15;
          color: var(--cr-text);
          margin: 0 0 clamp(6px, 0.8vw, 10px);
          opacity: 0;
          animation: fadeUp 0.5s 0.3s ease forwards;
        }

        .slide-desc {
          font-size: clamp(11px, 1.3vw, 15px);
          font-weight: 300;
          line-height: 1.6;
          color: var(--cr-text-muted);
          margin: 0;
          opacity: 0;
          animation: fadeUp 0.5s 0.4s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Counter */
        .slide-counter {
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
          font-size: clamp(11px, 1.2vw, 14px);
          font-weight: 600;
          color: var(--cr-text-muted);
          letter-spacing: 0.02em;
          text-align: right;
          line-height: 1;
        }

        .slide-counter span {
          color: var(--cr-text);
          font-size: 1.5em;
        }

        /* Nav buttons */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: clamp(36px, 4vw, 52px);
          height: clamp(36px, 4vw, 52px);
          border-radius: 50%;
          border: 1px solid var(--cr-border);
          background: rgba(10, 10, 14, 0.7);
          backdrop-filter: blur(12px);
          color: var(--cr-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          outline: none;
        }

        .nav-btn:hover {
          background: var(--cr-accent-dim);
          border-color: var(--cr-accent);
          color: var(--cr-accent);
          box-shadow: 0 0 20px var(--cr-accent-glow);
          transform: translateY(-50%) scale(1.08);
        }

        .nav-btn:active {
          transform: translateY(-50%) scale(0.96);
        }

        .nav-btn-left  { left: clamp(12px, 2vw, 24px); }
        .nav-btn-right { right: clamp(12px, 2vw, 24px); }

        /* Bottom controls row */
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding: 0 4px;
          gap: 16px;
        }

        /* Dots */
        .dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .dot {
          height: 3px;
          border-radius: 99px;
          background: rgba(240, 237, 232, 0.2);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dot-active {
          width: 32px;
          background: var(--cr-accent);
          box-shadow: 0 0 8px var(--cr-accent-glow);
        }

        .dot-inactive {
          width: 12px;
        }

        .dot-btn:hover .dot-inactive {
          background: rgba(240, 237, 232, 0.45);
        }

        /* Progress arc (circular) */
        .progress-track {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .autoplay-btn {
          background: none;
          border: 1px solid var(--cr-border);
          border-radius: 99px;
          padding: 5px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cr-text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .autoplay-btn:hover {
          border-color: var(--cr-accent);
          color: var(--cr-accent);
        }

        .autoplay-btn.active {
          border-color: var(--cr-accent);
          color: var(--cr-accent);
          background: var(--cr-accent-dim);
        }

        /* Linear progress bar */
        .progress-bar-track {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--cr-accent);
          border-radius: 99px;
          transition: width 0.1s linear;
          box-shadow: 0 0 8px var(--cr-accent-glow);
        }

        /* Scanline corners */
        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 15;
          pointer-events: none;
        }

        .corner-tl { top: 14px;  left: 14px;  border-top: 1.5px solid var(--cr-accent); border-left: 1.5px solid var(--cr-accent); }
        .corner-tr { top: 14px;  right: 14px; border-top: 1.5px solid var(--cr-accent); border-right: 1.5px solid var(--cr-accent); }
        .corner-bl { bottom: 14px; left: 14px;  border-bottom: 1.5px solid var(--cr-accent); border-left: 1.5px solid var(--cr-accent); }
        .corner-br { bottom: 14px; right: 14px; border-bottom: 1.5px solid var(--cr-accent); border-right: 1.5px solid var(--cr-accent); }
      `}</style>

      <div className="carousel-root">
        <div className="carousel-frame">
          {/* Corner accents */}
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          {/* Slides */}
          {carouselItems.map((item, index) => {
            const isActive = index === currentIndex
            const isPrev = index === prevIndex

            let slideClass = "slide-idle"
            if (isActive) {
              slideClass = direction === "next" ? "slide-enter-next" : "slide-enter-prev"
            } else if (isPrev) {
              slideClass = direction === "next" ? "slide-exit-next" : "slide-exit-prev"
            }

            return (
              <div key={index} className={`slide ${slideClass}`}>
                <div className="slide-image">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="slide-overlay" />
                <div className="slide-noise" />

                {isActive && (
                  <div className="slide-content">
                    <div className="slide-text">
                      <div className="slide-tag">{item.tag}</div>
                      <h3 className="slide-title">{item.title}</h3>
                      <p className="slide-desc">{item.description}</p>
                    </div>
                    <div className="slide-counter">
                      <span>{String(currentIndex + 1).padStart(2, "0")}</span>
                      &nbsp;/&nbsp;{String(carouselItems.length).padStart(2, "0")}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Nav Buttons */}
          <button className="nav-btn nav-btn-left" onClick={goToPrevious} aria-label="Previous slide">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button className="nav-btn nav-btn-right" onClick={goToNext} aria-label="Next slide">
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Controls row below */}
        <div className="controls-row">
          <div className="dots">
            {carouselItems.map((_, index) => (
              <button key={index} className="dot-btn" onClick={() => goToSlide(index)} aria-label={`Slide ${index + 1}`}>
                <div className={`dot ${index === currentIndex ? "dot-active" : "dot-inactive"}`} />
              </button>
            ))}
          </div>

          <div className="progress-track" style={{ flex: 1, maxWidth: 220 }}>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: isAutoPlaying ? `${progress}%` : "0%" }}
              />
            </div>
          </div>

          <button
            className={`autoplay-btn ${isAutoPlaying ? "active" : ""}`}
            onClick={() => setIsAutoPlaying((v) => !v)}
          >
            {isAutoPlaying ? "Auto" : "Paused"}
          </button>
        </div>
      </div>
    </>
  )
}