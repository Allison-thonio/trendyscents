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
            className="menu-trigger flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-300 hover:text-white transition-colors"
            onClick={() => setMenu(true)}
          >
            <span>Menu</span>
            <span className="text-amber-400 font-sans">→</span>
          </button>
        </div>
      </header>

      {/* Clean & Minimal Portfolio-style Mobile Menu Overlay */}
      {menu && (
        <div className="fixed inset-0 z-[100] bg-[#0A0908]/98 backdrop-blur-xl text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
            <Link href="/" onClick={() => setMenu(false)} className="wordmark">
              TRENDY<span>SCENTS</span>
            </Link>
            
            <button
              onClick={() => setMenu(false)}
              className="flex items-center gap-1.5 text-amber-400 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              <span>Close</span>
              <X size={16} />
            </button>
          </div>

          {/* Minimal Links List */}
          <div className="my-auto py-8 space-y-6">
            {[
              { label: 'Catalogue', href: '/shop' },
              { label: 'The Bar', href: '/#bar' },
              { label: 'About The Nose', href: '/about' },
              { label: 'Visit Us', href: '/#visit' },
              { label: 'Checkout', href: '/checkout' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenu(false)}
                className="block font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Minimal Footer Info */}
          <div className="border-t border-neutral-800/80 pt-6 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-amber-400" />
              <span>Isaac Boro Expressway, Yenagoa</span>
            </div>
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline"
            >
              WhatsApp →
            </a>
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
