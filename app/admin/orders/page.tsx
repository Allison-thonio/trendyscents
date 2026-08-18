'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  FileText,
  MessageSquare,
  Phone,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { naira } from '@/lib/catalog'
import type { OrderRow, OrderItemRow } from '@/lib/supabase/types'
import { useStore } from '@/lib/store'

function OrdersContent() {
  const searchParams = useSearchParams()
  const filterRef = searchParams.get('ref') || ''

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [itemsMap, setItemsMap] = useState<Record<string, OrderItemRow[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(filterRef)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null)

  const localOrders = useStore((s) => s.orders)
  const saveOrder = useStore((s) => s.saveOrder)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // 1. Fetch live orders & items from Server API Route /api/admin/orders
      const res = await fetch('/api/admin/orders')
      const data = await res.json()

      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders)
        if (data.itemsMap) setItemsMap(data.itemsMap)
      } else {
        // Fallback to local store orders
        const fallbackList: OrderRow[] = Object.values(localOrders).map((o) => ({
          id: o.ref,
          order_number: o.ref,
          customer_name: o.customerName,
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
    } catch (e) {
      console.error('Failed to fetch orders', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Handle status update
  const handleUpdateStatus = async (orderId: string, orderNum: string, newStatus: OrderRow['order_status']) => {
    const isPaymentVerified = newStatus !== 'Waiting to confirm receipt' && newStatus !== 'Cancelled'
    const newPaymentStatus = isPaymentVerified ? 'verified' : newStatus === 'Cancelled' ? 'failed' : 'pending'

    // Update in Supabase via /api/admin/orders API route
    try {
      await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderNumber: orderNum, newStatus })
      })
    } catch (err) {
      console.error('API order update failed:', err)
    }

    // Also update local Zustand store for instantaneous sync
    if (localOrders[orderNum]) {
      saveOrder({
        ...localOrders[orderNum],
        status: newStatus as any
      })
    }

    // Update UI state
    setOrders((prev) =>
      prev.map((o) =>
        o.order_number === orderNum
          ? { ...o, order_status: newStatus, payment_status: newPaymentStatus as any }
          : o
      )
    )
  }

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.order_status === statusFilter
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      (o.customer_phone && o.customer_phone.includes(q))
    return matchesStatus && matchesQuery
  })

  const statusOptions: OrderRow['order_status'][] = [
    'Waiting to confirm receipt',
    'Decant Pouring',
    'Out for Delivery',
    'Ready for Pickup',
    'Delivered',
    'Cancelled'
  ]

  return (
    <div className="space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles size={13} /> Order Desk & Dispatch
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Customer Orders & Receipts
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['All', ...statusOptions].map((st) => {
            const count = st === 'All' ? orders.length : orders.filter((o) => o.order_status === st).length
            const isActive = statusFilter === st
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{st}</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-[10px]">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search ref #, name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-2xl">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText size={32} className="mx-auto text-neutral-600" />
            <p className="text-sm font-mono text-neutral-400">No matching orders found.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-400 underline font-mono"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80">
            {filteredOrders.map((order) => {
              const isExpanded = expandedId === order.order_number
              const items = itemsMap[order.id] || []

              return (
                <div key={order.order_number} className="transition-colors hover:bg-neutral-950/40">
                  
                  {/* Row Summary */}
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-amber-300 text-sm">
                          #{order.order_number}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          order.payment_status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          Payment: {order.payment_status || 'Pending'}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <strong className="text-white font-serif text-base">
                          {order.customer_name}
                        </strong>
                        <span className="text-neutral-400 font-mono">
                          {order.customer_phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-500 block uppercase">Total Payable</span>
                        <strong className="font-serif text-lg text-white font-bold">
                          {naira(Number(order.total_amount))}
                        </strong>
                      </div>

                      {/* Prominent Action Button for Receipt Confirmation */}
                      {order.order_status === 'Waiting to confirm receipt' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              order.id,
                              order.order_number,
                              'Decant Pouring'
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs font-mono shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 animate-pulse"
                        >
                          <CheckCircle2 size={15} />
                          Confirm Receipt & Start Decant
                        </button>
                      )}

                      {/* Status Selector Dropdown */}
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            order.id,
                            order.order_number,
                            e.target.value as OrderRow['order_status']
                          )
                        }
                        className="bg-neutral-950 border border-neutral-700 text-amber-300 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.order_number)}
                        className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        title="Toggle Details"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="p-6 bg-neutral-950 border-t border-neutral-800 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Left: Customer & Delivery Info */}
                        <div className="md:col-span-6 space-y-4">
                          <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                            Delivery & Customer Contact
                          </h4>
                          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5 text-xs font-mono">
                            <p className="text-neutral-300">
                              <strong className="text-white">Customer Name:</strong> {order.customer_name}
                            </p>
                            {order.customer_email && (
                              <p className="text-neutral-300">
                                <strong className="text-white">Email:</strong> {order.customer_email}
                              </p>
                            )}
                            <p className="text-neutral-300">
                              <strong className="text-white">Delivery Address:</strong> {order.delivery_address || 'Yenagoa Bar Pickup'}
                            </p>
                            <p className="text-neutral-300">
                              <strong className="text-white">Phone / WhatsApp:</strong> {order.customer_phone}
                            </p>
                            {(order as any).customer_note && (
                              <p className="text-amber-200/80 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 text-[11px]">
                                <strong className="text-amber-400">Customer Note:</strong> {(order as any).customer_note}
                              </p>
                            )}
                            
                            <div className="pt-2 flex flex-wrap gap-2.5">
                              <a
                                href={`tel:${order.customer_phone}`}
                                className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-amber-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5"
                              >
                                <Phone size={13} /> Call
                              </a>
                              <a
                                href={`https://wa.me/234${order.customer_phone?.replace(/^0/, '')}?text=Hello%20${encodeURIComponent(order.customer_name)},%20regarding%20your%20Trendy%20Scents%20order%20%23${order.order_number}...`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-neutral-950 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow"
                              >
                                <MessageSquare size={13} /> WhatsApp
                              </a>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((order.delivery_address || 'Trendy Scents, Isaac Boro Expressway') + ', Yenagoa, Bayelsa State')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-amber-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5"
                              >
                                <ExternalLink size={13} /> Open Map
                              </a>
                              <Link
                                href={`/order/${order.order_number}`}
                                target="_blank"
                                className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5"
                              >
                                Live Tracking →
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Right: Payment Receipt Preview */}
                        <div className="md:col-span-6 space-y-4">
                          <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                            Attached Bank Transfer Receipt
                          </h4>
                          {order.receipt_url ? (
                            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={order.receipt_url}
                                    alt="Receipt thumbnail"
                                    className="w-14 h-14 object-cover rounded-lg border border-neutral-700 cursor-pointer hover:border-amber-400 transition-colors"
                                    onClick={() => setReceiptModalUrl(order.receipt_url!)}
                                  />
                                  <div>
                                    <p className="text-xs font-mono text-white font-bold">
                                      {order.receipt_name || 'Bank_Transfer_Receipt.jpg'}
                                    </p>
                                    <p className="text-[10px] font-mono text-emerald-400">Attached to order</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setReceiptModalUrl(order.receipt_url!)}
                                  className="px-3.5 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                                >
                                  <Eye size={14} /> View Full Receipt
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                              No image screenshot attached. Transfer reference <strong className="text-white">#{order.order_number}</strong> logged manually.
                            </div>
                          )}

                          {/* Ordered Items List */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                              Ordered Items ({items.length > 0 ? items.length : '1'})
                            </h4>
                            {items.length > 0 ? (
                              <div className="rounded-xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800/60 overflow-hidden text-xs font-mono">
                                {items.map((it) => (
                                  <div key={it.id} className="p-2.5 px-3 flex justify-between items-center text-neutral-300">
                                    <span>{it.quantity}x {it.product_name}</span>
                                    <span className="text-amber-300 font-bold">{naira(Number(it.price) * Number(it.quantity))}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                                Fragrance decant order total: <strong className="text-amber-300">{naira(Number(order.total_amount))}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}


                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox Receipt Modal */}
      {receiptModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                Bank Transfer Proof Screenshot
              </span>
              <button
                onClick={() => setReceiptModalUrl(null)}
                className="text-xs font-mono text-neutral-400 hover:text-white px-2 py-1 bg-neutral-800 rounded"
              >
                Close (ESC)
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex justify-center bg-black p-2 rounded-xl border border-neutral-800">
              <img
                src={receiptModalUrl}
                alt="Full receipt screenshot"
                className="max-h-[65vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-xs font-mono text-neutral-400">
        Loading Admin Order Desk...
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}
