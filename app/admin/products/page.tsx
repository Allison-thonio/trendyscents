'use client'
import { useState } from 'react'
import { Footer, SiteNav } from '@/components/site-shell'
import { scents, naira } from '@/lib/catalog'
export default function AdminProducts(){const [items,setItems]=useState(scents);return <><SiteNav/><main><header className="page-top"><span className="eyebrow">Catalogue management</span><h1>Products.</h1></header><section className="section"><div className="notice">This editable preview is ready to connect to the backend products table. Changes currently live in this session only.</div><div className="catalogue-grid">{items.map(s=><article className={`scent-card ${s.tone}`} key={s.id}><div><span className="mono-label">{s.family}</span><h3>{s.name}</h3><p>{naira(s.price)} · {s.available?'In stock':'Unavailable'}</p></div><button className="add-button" onClick={()=>setItems(items.map(i=>i.id===s.id?{...i,available:!i.available}:i))}>{s.available?'Mark unavailable':'Mark available'}</button></article>)}</div></section></main><Footer/></>}
