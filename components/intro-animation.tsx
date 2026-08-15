'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

export function IntroAnimation() {
  const [visible, setVisible] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Check if intro has played in this session (optional, play once per session or always on initial load)
    const hasPlayed = sessionStorage.getItem('trendy_intro_played')
    if (hasPlayed) {
      setVisible(false)
      return
    }

    const t1 = setTimeout(() => setStep(1), 400)
    const t2 = setTimeout(() => setStep(2), 1200)
    const t3 = setTimeout(() => {
      setFadingOut(true)
    }, 2400)
    const t4 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('trendy_intro_played', 'true')
    }, 3100)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-white transition-all duration-700 pointer-events-none select-none ${
        fadingOut ? 'opacity-0 scale-105 blur-md' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] animate-pulse" />

      {/* Drip Mark & Oil Drop Animation */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        
        {/* Animated Amber Ring */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-amber-400/60 animate-spin" style={{ animationDuration: '6s' }} />
          
          <div className="flex gap-1.5 items-end h-8">
            <span className={`w-1.5 bg-amber-400 rounded-b-md transition-all duration-500 ${step >= 0 ? 'h-6' : 'h-0'}`} />
            <span className={`w-1.5 bg-amber-300 rounded-b-md transition-all duration-700 ${step >= 0 ? 'h-9 shadow-lg shadow-amber-400' : 'h-0'}`} />
            <span className={`w-1.5 bg-amber-500 rounded-b-md transition-all duration-500 ${step >= 0 ? 'h-4' : 'h-0'}`} />
          </div>
        </div>

        {/* Animated Brand Typography */}
        <div className="text-center space-y-2">
          <span
            className={`eyebrow inline-flex items-center gap-1 text-amber-400 font-mono text-xs uppercase tracking-[0.3em] transition-all duration-700 transform ${
              step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <Sparkles size={12} /> Yenagoa, Bayelsa State
          </span>

          <h1
            className={`font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white transition-all duration-700 transform ${
              step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            TRENDY<span className="text-amber-300 font-normal italic">SCENTS</span>
          </h1>

          <p
            className={`text-xs sm:text-sm font-mono text-neutral-400 tracking-widest uppercase transition-all duration-700 transform ${
              step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            Fragrance, poured to the millilitre.
          </p>
        </div>

      </div>
    </div>
  )
}
