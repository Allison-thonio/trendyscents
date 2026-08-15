'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ArrowDown, ChevronRight } from 'lucide-react'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import { getCarouselSlides } from '@/lib/catalog'

export function StickyScrollCarouselSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const slides = getCarouselSlides()
  const totalSlides = slides.length

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const totalScrollableDistance = rect.height - windowHeight

      if (totalScrollableDistance <= 0) return

      // Calculate progress from 0 (when top of section touches top of viewport) to 1 (when bottom of section reaches bottom of viewport)
      const currentScroll = -rect.top
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentActiveIndex = Math.min(
    totalSlides - 1,
    Math.floor(scrollProgress * totalSlides)
  )
  const activeSlide = slides[currentActiveIndex] || slides[0]
  const isNearEnd = scrollProgress >= 0.85

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-neutral-950 text-neutral-100"
      style={{ height: '380vh' }}
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
        
        {/* Ambient Amber Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-4">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5 text-amber-400 font-mono text-xs uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" /> Scroll-Driven Interactive Bar
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight mt-1">
              A few to begin with <em className="text-amber-300 font-normal italic">on the bar.</em>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs text-amber-400/90 font-mono flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
              <ArrowDown size={13} className="animate-bounce" /> Scroll down to browse sideways
            </span>
          </div>
        </div>

        {/* Middle 3D Coverflow Carousel (Controlled by Scroll Progress) */}
        <div className="relative z-10 my-auto w-full max-w-7xl mx-auto">
          <CoverflowCarousel
            slides={slides}
            scrollProgress={scrollProgress}
            showCaption
            cardWidth="clamp(210px, 26vw, 320px)"
            rotate={40}
            depth={0.65}
            fade={0.12}
            loop={false}
          />
        </div>

        {/* Bottom Bar: Progress Indicator & "Show More" Action */}
        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800/80 pt-4">
          
          {/* Active Scent Meta */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-amber-300 font-bold bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
              {currentActiveIndex + 1} / {totalSlides}
            </span>
            <span className="text-xs font-serif text-neutral-300 truncate max-w-[200px] sm:max-w-[280px]">
              {activeSlide.title} — <span className="text-neutral-500 font-sans">{activeSlide.subtitle}</span>
            </span>
          </div>

          {/* Horizontal Scroll Progress Line */}
          <div className="w-full sm:w-48 h-1 bg-neutral-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-150 rounded-full shadow-sm shadow-amber-400"
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
            />
          </div>

          {/* Show More Button on Reaching End Slide */}
          <div>
            <Link
              href="/shop"
              className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all duration-500 flex items-center gap-2 border ${
                isNearEnd
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105 animate-pulse'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-amber-500/30'
              }`}
            >
              <span>{isNearEnd ? 'Show More — Full Catalog' : 'Explore All 40+ Oils'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
