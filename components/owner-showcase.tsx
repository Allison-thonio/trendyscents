'use client'

import { useState } from 'react'
import { ownerDetails, ownerImages } from '@/lib/catalog'
import { Sparkles, Camera } from 'lucide-react'

export function OwnerShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group bg-neutral-950 aspect-[4/5] sm:aspect-[3/4] max-h-[550px] w-full transition-all duration-500">
        <img
          src={ownerImages[activeIdx].src}
          alt={ownerImages[activeIdx].alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Badge header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles size={12} /> {ownerImages[activeIdx].label}
          </span>
          <span className="text-xs text-neutral-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-mono">
            {activeIdx + 1} / {ownerImages.length}
          </span>
        </div>

        {/* Floating details overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white shadow-lg space-y-1">
          <p className="font-serif font-bold text-lg text-amber-100 leading-tight">
            {ownerDetails.name}
          </p>
          <p className="text-xs text-amber-400 font-medium tracking-wide">
            {ownerDetails.role}
          </p>
        </div>
      </div>

      {/* Selector Thumbnails / Toggle Pills */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
          <Camera size={13} /> View portrait:
        </span>
        <div className="flex gap-2">
          {ownerImages.map((img, idx) => (
            <button
              key={img.src}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border ${
                activeIdx === idx
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'bg-neutral-900/80 border-neutral-700/60 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeIdx === idx ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
              {img.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
