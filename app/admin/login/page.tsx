'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, ShieldAlert, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('trendyscents@admin.com')
  const [password, setPassword] = useState('trendyadmin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.message || 'Invalid email or password.')
      }
    } catch (err) {
      setError('Connection failed. Please check network and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0908] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Background Amber Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10">
        <Link href="/" className="wordmark text-lg">
          TRENDY<span className="text-amber-400">SCENTS</span>
        </Link>
        <span className="text-xs font-mono text-neutral-400 border border-neutral-800 px-3 py-1 rounded-full uppercase tracking-wider">
          Admin Portal
        </span>
      </header>

      {/* Main Login Form Shell */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-12">
        <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-xl space-y-6">
          
          <div className="text-center space-y-2">
            <span className="eyebrow justify-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest">
              <Sparkles size={13} /> Restricted Access
            </span>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Backroom Console
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in to manage catalog, monitor sales & track customer decants
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2.5">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trendyscents@admin.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-amber-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] font-bold font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#C8923C]/20 flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] font-mono text-neutral-500">
              Default Login: <span className="text-amber-300 font-bold">trendyscents@admin.com</span> / <span className="text-amber-300 font-bold">trendyadmin</span>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs font-mono text-neutral-600 z-10">
        Trendy Scents Fragrance Bar · Yenagoa, Bayelsa State · Internal Operations
      </footer>
    </div>
  )
}
