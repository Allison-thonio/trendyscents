'use client'

import { useState } from 'react'
import { shopImages } from '@/lib/catalog'
import { Sparkles, Eye, EyeOff, Store, Compass } from 'lucide-react'

export function ShopGalleryShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showWriteup, setShowWriteup] = useState(true)

  return (
    <div className="space-y-6">
      {/* Featured Main Interior View */}
      <div 
        onClick={() => setShowWriteup(!showWriteup)}
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group bg-neutral-950 aspect-[16/9] sm:aspect-[16/10] w-full transition-all duration-500 cursor-pointer select-none"
      >
        <img
          src={shopImages[activeIdx].src}
          alt={shopImages[activeIdx].alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 ${showWriteup ? 'opacity-90' : 'opacity-0 pointer-events-none'}`} />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wider transition-opacity duration-500 ${showWriteup ? 'opacity-100' : 'opacity-0'}`}>
            <Store size={13} /> Real Store Interior · Yenagoa
          </span>
          <span className="text-xs text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono flex items-center gap-1.5">
            {showWriteup ? <EyeOff size={12} className="text-amber-400" /> : <Eye size={12} className="text-amber-400" />}
            {showWriteup ? 'Tap to hide text' : 'Tap to show text'}
          </span>
        </div>

        {/* Floating Details Banner */}
        <div className={`absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-1 transition-all duration-500 transform ${showWriteup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
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

        {/* Small floating hint when writeup is hidden */}
        {!showWriteup && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-medium flex items-center gap-1.5 animate-bounce z-10">
            <Eye size={12} /> Tap to show text
          </div>
        )}
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
