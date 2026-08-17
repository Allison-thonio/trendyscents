'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Sparkles, Plus, Check, ShieldCheck, Droplet, Package, Info, ArrowRight } from 'lucide-react'
import { CartDrawer, Footer, SiteNav, DripMark } from '@/components/site-shell'
import { useStore } from '@/lib/store'
import { scents as staticScents, naira, decantSizes, shopDetails, Scent } from '@/lib/catalog'
import { ShopGalleryShowcase } from '@/components/shop-gallery-showcase'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ShopPage() {
  const [productList, setProductList] = useState<Scent[]>(staticScents)
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({})
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({})

  const add = useStore((s) => s.add)

  // Fetch live products from Supabase directly
  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped: Scent[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            family: p.family,
            notes: p.notes,
            price: Number(p.price),
            available: p.available,
            tone: p.tone || 'amber',
            image: p.image,
            description: p.description || undefined
          }))
          setProductList(mapped)
        }
      } catch (err) {
        console.warn('Could not fetch products, using static catalog:', err)
      }
    }
    loadProducts()
  }, [])

  const families = useMemo(() => {
    return ['All', ...Array.from(new Set(productList.map((s) => s.family)))]
  }, [productList])

  const filteredScents = useMemo(() => {
    return productList.filter((s) => {
      const matchesFamily = selectedFamily === 'All' || s.family === selectedFamily
      const matchesQuery =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFamily && matchesQuery
    })
  }, [productList, selectedFamily, searchQuery])

  const handleSizeChange = (scentId: string, ml: number) => {
    setSelectedSizes((prev) => ({ ...prev, [scentId]: ml }))
  }

  const handleAddToCart = (scent: Scent) => {
    const selectedMl = selectedSizes[scent.id] || 10
    const sizeObj = decantSizes.find((d) => d.ml === selectedMl) || decantSizes[0]
    const calculatedPrice = Math.round(scent.price * sizeObj.multiplier)

    add({
      ...scent,
      name: `${scent.name} (${selectedMl}ml)`,
      price: calculatedPrice
    })

    setAddedIds((prev) => ({ ...prev, [scent.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [scent.id]: false }))
    }, 1800)
  }

  return (
    <>
      <SiteNav />
      <main className="bg-neutral-950 text-neutral-100 min-h-screen">
        
        {/* Header Hero */}
        <header className="pt-36 pb-16 px-4 sm:px-8 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-center relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest">
              <Sparkles size={13} /> The Complete Fragrance Bar
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[0.95]">
              Find your <em className="text-amber-300 font-normal italic">next signature scent.</em>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore 40+ fine perfume oils sourced for depth and longevity. Sample by note, choose your volume, and have it decanted to order.
            </p>
          </div>
        </header>

        {/* About the Shop / Decant Bar Story Callout */}
        <section className="py-12 bg-neutral-900/60 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="eyebrow justify-center text-amber-400 font-mono text-xs uppercase tracking-wider flex items-center gap-1">
                <Info size={13} /> About The Shop Bar
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {shopDetails.headline}
              </h2>
              <p className="text-xs text-neutral-400">
                {shopDetails.decantPhilosophy}
              </p>
            </div>

            {/* 4 Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shopDetails.guarantees.map((g, i) => (
                <div key={i} className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-amber-500/30 transition-all duration-300 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-500/20">
                    0{i + 1}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-neutral-100">
                    {g.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter & Search Toolbar */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-neutral-800">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {families.map((f) => {
                const count = f === 'All' ? productList.length : productList.filter((s) => s.family === f).length
                const isActive = selectedFamily === f
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFamily(f)}
                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span>{f}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-amber-400/20 text-amber-200' : 'bg-neutral-800 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search notes e.g. Rose, Oud, Vanilla..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
          </div>

          {/* Scent Catalogue Cards Grid */}
          {filteredScents.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <DripMark />
              <h3 className="text-xl font-serif text-neutral-300">No scents match your search</h3>
              <p className="text-xs text-neutral-500">Try clearing your search query or selecting a different family.</p>
              <button
                onClick={() => { setSelectedFamily('All'); setSearchQuery('') }}
                className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-amber-300 font-medium hover:bg-neutral-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredScents.map((scent) => {
                const currentMl = selectedSizes[scent.id] || 10
                const currentSizeObj = decantSizes.find((d) => d.ml === currentMl) || decantSizes[0]
                const displayPrice = Math.round(scent.price * currentSizeObj.multiplier)
                const isJustAdded = addedIds[scent.id]

                return (
                  <article
                    key={scent.id}
                    id={scent.id}
                    className="group rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-amber-500/5"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800/40 animate-pulse">
                        <img
                          src={scent.image}
                          alt={scent.name}
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).parentElement?.classList.remove('animate-pulse', 'bg-neutral-800/40')
                            ;(e.target as HTMLImageElement).parentElement?.classList.add('bg-neutral-950')
                          }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 font-mono text-[10px] uppercase tracking-wider">
                            {scent.family}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-medium ${
                            scent.available
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {scent.available ? 'In Bar' : 'Pre-order'}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-serif font-bold text-2xl text-white group-hover:text-amber-200 transition-colors">
                            {scent.name}
                          </h3>
                          <p className="text-xs text-amber-400/90 font-mono mt-1">
                            {scent.notes}
                          </p>
                        </div>

                        {scent.description && (
                          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                            {scent.description}
                          </p>
                        )}

                        {/* Size Selector Pills */}
                        <div className="pt-2 space-y-2">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                            Select Decant Volume:
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {decantSizes.map((d) => (
                              <button
                                key={d.ml}
                                onClick={() => handleSizeChange(scent.id, d.ml)}
                                className={`py-1.5 rounded-lg text-xs font-mono transition-all border ${
                                  currentMl === d.ml
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                                }`}
                              >
                                {d.ml}ml
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 mt-2 flex items-center justify-between border-t border-neutral-800/60 pt-4">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                          {currentSizeObj.badge} ({currentMl}ml)
                        </span>
                        <strong className="font-serif text-xl text-white font-bold">
                          {naira(displayPrice)}
                        </strong>
                      </div>

                      <button
                        onClick={() => handleAddToCart(scent)}
                        disabled={!scent.available}
                        className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center gap-1.5 ${
                          isJustAdded
                            ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/20'
                            : scent.available
                            ? 'bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] shadow-md shadow-[#C8923C]/20 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check size={14} /> Added!
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add {currentMl}ml
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* Custom Order Callout Section */}
        <section className="py-16 bg-neutral-900 border-t border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="eyebrow justify-center text-amber-400">Can't find a specific perfume oil?</span>
            <h2 className="text-3xl font-serif text-white">
              We stock over 40 fine oils in store.
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
              Visit our bar on Isaac Boro Expressway in Yenagoa or message us to inquire about rare oil formulations, bespoke decants, and wedding scent favors.
            </p>
            <div className="pt-2">
              <Link href="/#visit" className="button button-amber inline-flex items-center gap-2">
                Visit our Yenagoa location <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
