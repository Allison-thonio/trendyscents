'use client'
import { useState } from 'react'
import { Footer, SiteNav } from '@/components/site-shell'
export default function AdminLogin(){const [message,setMessage]=useState('');return <><SiteNav/><main className="form-page"><div className="form-shell"><span className="eyebrow">Private access</span><h1>The back<br/>room.</h1><form onSubmit={e=>{e.preventDefault();setMessage('Backend authentication is not connected in this workspace.')}}><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" required/></div><button className="button button-amber">Enter dashboard</button>{message&&<div className="notice">{message}</div>}</form></div></main><Footer/></>}
