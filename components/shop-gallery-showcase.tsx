'use client'

import { useState } from 'react'
import { shopImages } from '@/lib/catalog'
import { Sparkles, Eye, Store, Compass } from 'lucide-react'

export function ShopGalleryShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="space-y-6">
      {/* Featured Main Interior View */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group bg-neutral-950 aspect-[16/9] sm:aspect-[16/10] w-full transition-all duration-500">
        <img
          src={shopImages[activeIdx].src}
          alt={shopImages[activeIdx].alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wider">
            <Store size={13} /> Real Store Interior · Yenagoa
          </span>
          <span className="text-xs text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono">
            {activeIdx + 1} / {shopImages.length}
          </span>
        </div>

        {/* Floating Details Banner */}
        <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-xl text-amber-200">
              {shopImages[activeIdx].title}
            </h4>
            <span className="text-[10px] font-mono uppercase text-amber-400/90 tracking-widest hidden sm:inline-flex items-center gap-1">
              <Sparkles size={11} /> Isaac Boro Expressway
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {shopImages[activeIdx].caption}
          </p>
        </div>
      </div>

      {/* Interactive Thumbnail Carousel Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {shopImages.map((img, idx) => (
          <button
            key={img.src}
            onClick={() => setActiveIdx(idx)}
            className={`group relative rounded-xl overflow-hidden border transition-all duration-300 aspect-[4/3] bg-neutral-900 ${
              activeIdx === idx
                ? 'border-amber-400 ring-2 ring-amber-500/30 scale-[1.02] shadow-lg shadow-amber-500/10'
                : 'border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-600'
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-neutral-200 font-medium truncate text-left">
              {img.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
