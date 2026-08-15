import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, Crown, Store, Flame } from 'lucide-react'
import { Footer, SiteNav } from '@/components/site-shell'
import { ownerDetails, ownerImages } from '@/lib/catalog'
import { OwnerShowcase } from '@/components/owner-showcase'
import { ShopGalleryShowcase } from '@/components/shop-gallery-showcase'
import { OwnerPortraitCard } from '@/components/owner-portrait-card'

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-neutral-950 text-neutral-100">
        <header className="page-top">
          <span className="eyebrow">The story behind the pour</span>
          <h1>
            A bar for
            <br />
            <em style={{ color: 'var(--amber)', fontStyle: 'normal' }}>
              your senses.
            </em>
          </h1>
        </header>

        {/* Shop Interior Showcase & Philosophy */}
        <section className="section py-16 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Interactive Shop Gallery */}
            <div className="lg:col-span-7">
              <ShopGalleryShowcase />
            </div>

            {/* Right: Story & Philosophy Copy */}
            <div className="lg:col-span-5 space-y-5">
              <span className="eyebrow flex items-center gap-1.5 text-amber-400">
                <Store size={14} /> Our Yenagoa Flagship Bar
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif leading-tight">
                Crafted for connection,
                <br />
                <em className="text-amber-300 font-normal italic">poured to precision.</em>
              </h2>
              <p className="text-neutral-300 leading-relaxed text-sm">
                Trendy Scents was born out of a simple belief: luxury fragrance shouldn’t feel intimidating or locked behind department store glass. It should be an inviting conversation, an artistic ritual, and a personal signature decanted right before your eyes.
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Located on Isaac Boro Expressway in Yenagoa, our bar features custom glass globe chandeliers, ambient golden lighting, and over 40 fine oil fragrances sourced for authenticity, longevity, and rich sillage.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Flame size={16} />
                  </div>
                  <div>
                    <span className="block text-xs font-serif font-bold text-white">40+ Pure Oils</span>
                    <span className="text-[10px] text-neutral-400">Alcohol-Free & Long Lasting</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="section section-dark py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <OwnerShowcase />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="eyebrow flex items-center gap-1.5 text-amber-400">
                  <Crown size={14} /> Meet the owner & nose
                </span>
                <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                  The vision behind
                  <br />
                  <em className="text-amber-300 font-normal italic">Trendy Scents.</em>
                </h2>
                <p className="text-neutral-300 leading-relaxed text-base">
                  {ownerDetails.bio}
                </p>
                
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="block text-2xl font-serif text-amber-300 font-bold">100%</span>
                    <span className="text-xs text-neutral-400">Pure Uncut Oil Blends</span>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="block text-2xl font-serif text-amber-300 font-bold">Yenagoa</span>
                    <span className="text-xs text-neutral-400">Bespoke Fragrance Bar</span>
                  </div>
                </div>

                <blockquote className="p-5 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 italic font-serif text-base leading-relaxed">
                  "{ownerDetails.quote}"
                </blockquote>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link href="/shop" className="button button-amber inline-flex items-center gap-2">
                    Shop the catalogue <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Dual Portrait Gallery Showcase */}
            <div className="mt-20 border-t border-neutral-800/80 pt-16">
              <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                <span className="eyebrow justify-center">Founding Visionary</span>
                <h3 className="text-2xl md:text-3xl font-serif text-neutral-100">
                  Blessing Igoni
                </h3>
                <p className="text-sm text-neutral-400">
                  Curating elegance in modern studio sophistication and celebrated cultural heritage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {ownerImages.map((img) => (
                  <OwnerPortraitCard
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    label={img.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

