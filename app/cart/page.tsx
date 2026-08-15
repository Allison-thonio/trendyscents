'use client'
import Link from 'next/link'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { Footer, SiteNav } from '@/components/site-shell'
import { useStore, cartTotal } from '@/lib/store'
import { naira } from '@/lib/catalog'
export default function CartPage(){const {cart,add,remove}=useStore();return <><SiteNav/><main className="form-page"><div className="form-shell"><span className="eyebrow">Your selection</span><h1>Cart.</h1>{cart.length===0?<p className="section-intro">Nothing here yet. <Link className="text-link" href="/shop">Browse the bar <ArrowRight size={15}/></Link></p>:<><div className="cart-lines">{cart.map(l=><div className="cart-line" key={l.scent.id}><div><span className="mono-label">{l.scent.family}</span><h3>{l.scent.name}</h3><p>{naira(l.scent.price)}</p></div><div className="stepper"><button onClick={()=>remove(l.scent.id)}><Minus size={13}/></button><span>{l.quantity}</span><button onClick={()=>add(l.scent)}><Plus size={13}/></button></div></div>)}</div><div className="drawer-total"><span>Total</span><strong>{naira(cartTotal(cart))}</strong></div><Link className="button button-amber" href="/checkout">Continue to checkout <ArrowRight size={16}/></Link></>}</div></main><Footer/></>}
