import { MapPin, Clock, Navigation, ExternalLink, Sparkles, Compass, ShieldCheck } from 'lucide-react'
import { storeLocation } from '@/lib/catalog'

export function StoreLocationSection() {
  return (
    <section id="visit" className="py-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-neutral-100 relative overflow-hidden border-t border-neutral-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium uppercase tracking-widest">
            <MapPin size={13} /> Physical Flagship Bar
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
            Visit Us in <em className="text-amber-300 font-normal italic">Yenagoa</em>
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            {storeLocation.headline}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Location Info & Hours */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-neutral-800 space-y-6 shadow-xl">
              
              {/* Address Card */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                  <Compass size={16} /> Location Address
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Isaac Boro Expressway
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Yenagoa, Bayelsa State, Nigeria
                </p>
                <div className="pt-2">
                  <a
                    href={storeLocation.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Navigation size={16} className="fill-current" />
                    <span>Open on Google Maps</span>
                    <ExternalLink size={14} className="opacity-70" />
                  </a>
                </div>
              </div>

              <hr className="border-neutral-800" />

              {/* Store Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                  <Clock size={16} /> Opening Hours
                </div>
                <div className="space-y-2.5">
                  {storeLocation.hours.map((h) => (
                    <div key={h.days} className="flex items-center justify-between py-1.5 border-b border-neutral-800/60 last:border-0 text-sm">
                      <span className="text-neutral-300 font-medium">{h.days}</span>
                      <span className={`font-mono text-xs px-2.5 py-1 rounded-md ${
                        h.time === 'Closed'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Atmosphere & Store Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                  <Sparkles size={13} /> Scent Decanting
                </span>
                <p className="text-xs text-neutral-300">
                  Measured to the exact millilitre right before your eyes.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                  <ShieldCheck size={13} /> 40+ Oil Concentrates
                </span>
                <p className="text-xs text-neutral-300">
                  Pure uncut perfume oils with high projection & longevity.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Preview Box & Writeup */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-neutral-900 shadow-2xl min-h-[320px] sm:min-h-[380px] flex flex-col justify-end group">
              
              {/* Google Maps Map Embed or Custom Graphic */}
              <iframe
                title="Trendy Scents Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.2573215264025!2d6.303367175924765!3d4.916338239857945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106a050048eccd6f%3A0xf339d05ae6a61279!2sTrendy%20Scents!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                className="w-full h-full absolute inset-0 border-0 filter grayscale invert contrast-125 opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Dark overlay banner */}
              <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 space-y-3 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <MapPin size={14} className="animate-bounce" /> Verified Store Location
                  </span>
                  <a
                    href={storeLocation.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-amber-300 hover:underline flex items-center gap-1"
                  >
                    View larger map <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-white font-serif text-lg font-bold">
                  Trendy Scents Fragrance Bar
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Located directly on Isaac Boro Expressway in Yenagoa. Accessible, welcoming, and equipped with a full decant bar for your fragrance exploration.
                </p>
              </div>
            </div>

            {/* Location Writeup Paragraph */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 text-sm text-neutral-300 leading-relaxed space-y-2">
              <span className="text-xs font-mono uppercase text-amber-400 block tracking-wider">
                The In-Store Experience
              </span>
              <p>
                {storeLocation.writeup}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
