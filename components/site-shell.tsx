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
  return <>
    <header className="site-nav">
      <Link href="/" className="wordmark">TRENDY<span>SCENTS</span></Link>
      <nav className="desktop-links" aria-label="Primary"><Link href="/shop">Catalogue</Link><a href="/#bar">The Bar</a><Link href="/about">About</Link><a href="/#visit">Visit</a></nav>
      <div className="nav-actions"><button className="cart-trigger" onClick={() => setDrawer(true)} aria-label={`Open cart, ${cartCount(cart)} items`}><ShoppingBag size={17}/><span>{cartCount(cart)}</span></button><button className="menu-trigger" onClick={() => setMenu(true)}>Menu <span>→</span></button></div>
    </header>
    {menu && <div className="mobile-menu"><button className="menu-close" onClick={() => setMenu(false)}>Close <X size={18}/></button><div className="mobile-menu-links"><Link onClick={() => setMenu(false)} href="/shop">Catalogue</Link><a onClick={() => setMenu(false)} href="/#bar">The Bar</a><Link onClick={() => setMenu(false)} href="/about">About</Link><a onClick={() => setMenu(false)} href="/#visit">Visit</a></div><p>Isaac Boro Expressway<br/>Yenagoa, Bayelsa</p></div>}
  </>
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
