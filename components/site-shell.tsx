'use client'

import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, X, ExternalLink, MapPin } from 'lucide-react'
import { useStore, cartCount, cartTotal } from '@/lib/store'
import { naira, storeLocation } from '@/lib/catalog'
import { useState } from 'react'

export function DripMark() { return <span className="drip-mark" aria-hidden="true"><i /><i /><i /></span> }

export function SiteNav() {
  const [menu, setMenu] = useState(false)
  const cart = useStore((s) => s.cart)
  const setDrawer = useStore((s) => s.setDrawer)

  return (
    <>
      <header className="site-nav">
        <Link href="/" className="wordmark">
          TRENDY<span>SCENTS</span>
        </Link>

        <nav className="desktop-links" aria-label="Primary">
          <Link href="/shop">Catalogue</Link>
          <a href="/#bar">The Bar</a>
          <Link href="/about">About</Link>
          <a href="/#visit">Visit</a>
        </nav>

        <div className="nav-actions">
          <button
            className="cart-trigger"
            onClick={() => setDrawer(true)}
            aria-label={`Open cart, ${cartCount(cart)} items`}
          >
            <ShoppingBag size={17} />
            <span>{cartCount(cart)}</span>
          </button>
          
          <button
            className="menu-trigger flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-wider transition-all hover:bg-neutral-800"
            onClick={() => setMenu(true)}
          >
            <span>Menu</span>
            <span className="text-amber-400">↓</span>
          </button>
        </div>
      </header>

      {/* Smooth Sliding Full Screen Mobile Menu Overlay */}
      {menu && (
        <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in slide-in-from-top-6 duration-300">
          
          {/* Top Header Row */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
            <Link href="/" onClick={() => setMenu(false)} className="wordmark">
              TRENDY<span>SCENTS</span>
            </Link>
            
            <button
              onClick={() => setMenu(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-all group"
            >
              <span>Close</span>
              <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="my-auto py-8 space-y-4">
            {[
              { label: 'Catalogue & Bar', href: '/shop', num: '01' },
              { label: 'The Experience', href: '/#bar', num: '02' },
              { label: 'About The Nose', href: '/about', num: '03' },
              { label: 'Flagship Location', href: '/#visit', num: '04' },
              { label: 'Checkout & Cart', href: '/checkout', num: '05' }
            ].map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenu(false)}
                className="group flex items-baseline justify-between border-b border-neutral-800/80 pb-3 hover:border-amber-400 transition-colors"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <span className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {link.label}
                </span>
                <span className="font-mono text-xs text-amber-400/80 group-hover:text-amber-300 tracking-widest">
                  [{link.num}]
                </span>
              </Link>
            ))}
          </div>

          {/* Footer Info Row */}
          <div className="border-t border-neutral-800 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-400" />
                <span>Isaac Boro Expressway · Yenagoa, Bayelsa</span>
              </div>
              <span className="text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                Mon–Sat: 10:00 AM – 8:00 PM
              </span>
            </div>

            <div className="flex gap-3 pt-1">
              <a
                href={storeLocation.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-1/2 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
              >
                Google Maps <ExternalLink size={13} />
              </a>
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noreferrer"
                className="w-1/2 py-3 rounded-xl bg-amber-500 text-neutral-950 text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                WhatsApp Bar
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  )
}

export function CartDrawer() {
  const { cart, drawerOpen, setDrawer, add, remove } = useStore()
  if (!drawerOpen) return null
  return <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="Shopping cart"><button className="drawer-backdrop" onClick={() => setDrawer(false)} aria-label="Close cart"/><aside className="cart-drawer"><div className="drawer-head"><div><span className="eyebrow">Your selection</span><h2>Cart <small>{cartCount(cart)}</small></h2></div><button onClick={() => setDrawer(false)} aria-label="Close cart"><X/></button></div>{cart.length === 0 ? <div className="empty-state"><DripMark/><p>Your cart is waiting to be poured.</p><Link href="/shop" onClick={() => setDrawer(false)} className="text-link">Browse the catalogue <ArrowRight size={15}/></Link></div> : <><div className="cart-lines">{cart.map(({ scent, quantity }) => <div className="cart-line" key={scent.id}><div><span className="mono-label">{scent.family}</span><h3>{scent.name}</h3><p>{naira(scent.price)} / decant</p></div><div className="stepper"><button onClick={() => remove(scent.id)} aria-label={`Remove one ${scent.name}`}><Minus size={13}/></button><span>{quantity}</span><button onClick={() => add(scent)} aria-label={`Add one ${scent.name}`}><Plus size={13}/></button></div></div>)}</div><div className="drawer-total"><span>Subtotal</span><strong>{naira(cartTotal(cart))}</strong></div><Link href="/checkout" onClick={() => setDrawer(false)} className="button button-amber">Continue to checkout <ArrowRight size={16}/></Link></>}</aside></div>
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <DripMark />
        <p className="footer-brand">
          TRENDY<br /><em>SCENTS</em>
        </p>
      </div>
      <div>
        <span className="eyebrow flex items-center gap-1"><MapPin size={12} /> Find the bar</span>
        <p>Isaac Boro Expressway<br />Yenagoa, Bayelsa State</p>
        <a
          href={storeLocation.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 mt-1 font-mono"
        >
          View on Google Maps <ExternalLink size={11} />
        </a>
      </div>
      <div>
        <span className="eyebrow">Opening Hours</span>
        <p className="text-xs space-y-1">
          <span className="block">Mon – Fri: 10am – 8pm</span>
          <span className="block">Saturday: 10am – 7pm</span>
        </p>
      </div>
      <p className="footer-note">Poured with intention · © 2026</p>
    </footer>
  )
}
