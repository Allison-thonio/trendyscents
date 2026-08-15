'use client'

import { useState } from 'react'
import { ownerDetails, ownerImages } from '@/lib/catalog'
import { Sparkles, Camera, Eye, EyeOff } from 'lucide-react'

export function OwnerShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showWriteup, setShowWriteup] = useState(true)

  const currentImg = ownerImages[activeIdx]

  return (
    <div className="space-y-4">
      {/* Main Image Card with Tap-to-Toggle Writeup */}
      <div 
        onClick={() => setShowWriteup(!showWriteup)}
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group bg-neutral-950 aspect-[4/5] sm:aspect-[3/4] max-h-[550px] w-full transition-all duration-500 cursor-pointer select-none"
      >
        <img
          src={currentImg.src}
          alt={currentImg.alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Overlay gradient - fades out when writeup is hidden */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 ${showWriteup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

        {/* Top badge header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles size={12} /> {currentImg.label}
          </span>
          
          <span className="text-xs text-neutral-200 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-mono flex items-center gap-1.5">
            {showWriteup ? <EyeOff size={12} className="text-amber-400" /> : <Eye size={12} className="text-amber-400" />}
            {showWriteup ? 'Tap to hide text' : 'Tap to show text'}
          </span>
        </div>

        {/* Write-up text overlay box - toggles on tap */}
        <div className={`absolute bottom-4 left-4 right-4 p-4 sm:p-5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white shadow-2xl space-y-2 transition-all duration-500 transform ${showWriteup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="flex items-center justify-between">
            <p className="font-serif font-bold text-lg sm:text-xl text-amber-100 leading-tight">
              {ownerDetails.name}
            </p>
            <span className="text-[10px] font-mono text-amber-400/90 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {activeIdx + 1} / {ownerImages.length}
            </span>
          </div>
          <p className="text-xs text-amber-400 font-medium tracking-wide">
            {ownerDetails.role}
          </p>
          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 font-sans pt-1">
            "{ownerDetails.quote}"
          </p>
        </div>

        {/* Small floating hint when writeup is hidden */}
        {!showWriteup && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-medium tracking-wide flex items-center gap-2 animate-bounce shadow-xl z-10">
            <Eye size={13} /> Tap photo to reveal bio write-up
          </div>
        )}
      </div>

      {/* Selector Thumbnails / Toggle Pills for all 3 owner images */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Camera size={13} className="text-amber-400" /> Select photo (3 portraits):
        </span>
        <div className="flex flex-wrap gap-2">
          {ownerImages.map((img, idx) => (
            <button
              key={img.src}
              onClick={() => {
                setActiveIdx(idx)
                setShowWriteup(true)
              }}
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
