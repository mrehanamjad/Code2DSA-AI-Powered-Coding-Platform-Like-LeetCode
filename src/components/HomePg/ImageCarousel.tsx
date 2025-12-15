"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CarouselItem {
  src: string
  alt: string
  title: string
  description: string
}

const carouselItems: CarouselItem[] = [
  {
    src: "/images/allProblems.png",
    alt: "Practice Problems",
    title: "Browse 500+ Curated Problems",
    description: "Filter by difficulty, topic, and track your progress across all challenges",
  },
  {
    src: "/images/problem.png",
    alt: "Code Editor",
    title: "Powerful Multi-Language Editor",
    description: "Write, run, and submit solutions with real-time test case validation",
  },
  {
    src: "/images/aiAnalyze.png",
    alt: "AI Code Analyzer",
    title: "Instant AI-Powered Feedback",
    description: "Get time complexity analysis, optimization suggestions, and bug detection",
  },
  {
    src: "/images/stats.png",
    alt: "User Profile",
    title: "Track Your Progress",
    description: "Monitor your stats, streaks, and skill development over time",
  },
  {
    src: "/images/compiler.png",
    alt: "Standalone Editor",
    title: "Practice Anywhere",
    description: "Use our standalone code editor for quick experimentation in any language",
  },
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-border bg-card shadow-2xl">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 translate-x-0 scale-100"
                : index < currentIndex
                  ? "opacity-0 -translate-x-full scale-95"
                  : "opacity-0 translate-x-full scale-95"
            }`}
          >
            <Image
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
              <div className="max-w-2xl">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-balance">{item.title}</h3>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground text-pretty">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90 hover:border-primary transition-all shadow-lg"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm border-2 hover:bg-background/90 hover:border-primary transition-all shadow-lg"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 md:w-10 bg-primary shadow-lg shadow-primary/50"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
        <div
          className="h-full bg-primary transition-all duration-300 ease-linear"
          style={{
            width: `${((currentIndex + 1) / carouselItems.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
