'use client'

import { useState } from 'react'
import { ownerDetails } from '@/lib/catalog'
import { Sparkles, Eye, EyeOff } from 'lucide-react'

interface OwnerPortraitCardProps {
  src: string
  alt: string
  label: string
  className?: string
}

export function OwnerPortraitCard({ src, alt, label, className = '' }: OwnerPortraitCardProps) {
  const [showWriteup, setShowWriteup] = useState(true)

  return (
    <div
      onClick={() => setShowWriteup(!showWriteup)}
      className={`group relative rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-950 aspect-[3/4] cursor-pointer select-none ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 ${showWriteup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      {/* Header Badge & Hint */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-xs text-amber-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 font-medium">
          <Sparkles size={12} /> {label}
        </span>
        <span className="text-xs text-neutral-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 font-mono flex items-center gap-1">
          {showWriteup ? <EyeOff size={12} className="text-amber-400" /> : <Eye size={12} className="text-amber-400" />}
          {showWriteup ? 'Hide' : 'Show'}
        </span>
      </div>

      {/* Writeup Card Overlay */}
      <div
        className={`absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white transition-all duration-500 transform ${
          showWriteup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <p className="font-serif text-lg font-bold text-amber-100">{ownerDetails.name}</p>
        <p className="text-xs text-amber-400 font-medium mb-1">{ownerDetails.role}</p>
        <p className="text-xs text-neutral-300 line-clamp-2 italic">"{ownerDetails.quote}"</p>
      </div>

      {/* Floating hint when hidden */}
      {!showWriteup && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 animate-bounce z-10">
          <Eye size={12} /> Tap to show write-up
        </div>
      )}
    </div>
  )
}
