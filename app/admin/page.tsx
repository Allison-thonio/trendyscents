'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  ArrowUpRight,
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { naira, scents } from '@/lib/catalog'
import type { OrderRow, ProductRow } from '@/lib/supabase/types'
import { useStore } from '@/lib/store'

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const localOrders = useStore((s) => s.orders)

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch orders from /api/admin/orders API route (admin server client)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()

      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders as OrderRow[])
      } else {
        // Fallback to local Zustand store orders if any
        const fallbackList: OrderRow[] = Object.values(localOrders).map((o) => ({
          id: o.ref,
          order_number: o.ref,
          customer_name: o.customerName,
          customer_email: o.email || 'customer@trendyscents.ng',
          customer_phone: o.phone,
          delivery_address: o.address,
          total_amount: o.total,
          payment_method: 'Bank Transfer',
          payment_status: o.status === 'Waiting to confirm receipt' ? 'pending' : 'verified',
          order_status: o.status,
          receipt_url: o.receiptUrl || null,
          receipt_name: o.receiptName || null,
          created_at: new Date().toISOString()
        }))
        setOrders(fallbackList)
      }

      // Fetch products from Supabase
      const { data: dbProducts } = await supabase
        .from('products')
        .select('*')

      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts as ProductRow[])
      } else {
        setProducts(scents as ProductRow[])
      }
    } catch (e) {
      console.error('Error fetching admin data:', e)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
  const pendingOrders = orders.filter((o) => o.payment_status === 'pending' || o.order_status === 'Payment Verification').length
  const activeProducts = products.filter((p) => p.available).length

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles size={13} /> Dashboard Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Yenagoa Bar Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C8923C]/20 flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-mono uppercase text-neutral-400">Total Sales Revenue</span>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {naira(totalRevenue)}
          </p>
          <span className="text-[11px] font-mono text-neutral-500 block">
            {orders.length} order{orders.length !== 1 ? 's' : ''} processed
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-mono uppercase text-neutral-400">Pending Verification</span>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-amber-300">
            {pendingOrders}
          </p>
          <span className="text-[11px] font-mono text-neutral-500 block">
            Awaiting bank receipt check
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-mono uppercase text-neutral-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {orders.length}
          </p>
          <span className="text-[11px] font-mono text-neutral-500 block">
            Customer checkout records
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-mono uppercase text-neutral-400">Active Catalogue</span>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Package size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {activeProducts} / {products.length}
          </p>
          <span className="text-[11px] font-mono text-neutral-500 block">
            Scents available in bar
          </span>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-neutral-400">Manage orders, verify transfer receipts, and update delivery status</p>
          </div>
          
          <Link
            href="/admin/orders"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center space-y-3 border border-dashed border-neutral-800 rounded-xl">
            <ShoppingBag size={32} className="mx-auto text-neutral-600" />
            <p className="text-sm font-mono text-neutral-400">No orders received yet.</p>
            <p className="text-xs text-neutral-500">Orders placed on the checkout page will automatically stream here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id || order.order_number} className="hover:bg-neutral-950/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-amber-300">
                      #{order.order_number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-neutral-400">{order.customer_phone}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {naira(Number(order.total_amount))}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        order.payment_status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {order.payment_status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-neutral-300">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/orders?ref=${order.order_number}`}
                        className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-amber-300 transition-colors text-[11px]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
