'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, LogOut, ExternalLink, Menu, X, Sparkles } from 'lucide-react'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenu, setMobileMenu] = useState(false)

  // Don't wrap login page with sidebar shell
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders & Receipts', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products & Inventory', href: '/admin/products', icon: Package }
  ]

  return (
    <div className="min-h-screen bg-[#0A0908] text-white flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40">
        <Link href="/admin" className="wordmark text-base">
          TRENDY<span>ADMIN</span>
        </Link>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="p-2 text-amber-400 hover:text-white"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-neutral-950 border-r border-neutral-800/80 p-6 flex flex-col justify-between shrink-0 fixed md:sticky top-0 h-auto md:h-screen z-30 transition-transform ${
          mobileMenu ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Status Badge */}
          <div className="space-y-2">
            <Link href="/" className="wordmark block text-xl">
              TRENDY<span>ADMIN CONSOLE</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Operations
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <Link
            href="/shop"
            target="_blank"
            className="flex items-center justify-between text-xs font-mono text-neutral-400 hover:text-amber-300 transition-colors p-2 rounded-lg hover:bg-neutral-900"
          >
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between text-xs font-mono text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <span>Sign Out</span>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}
