'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  PackageCheck,
  Truck
} from 'lucide-react'
import { Footer, SiteNav } from '@/components/site-shell'
import { useStore } from '@/lib/store'
import { naira, storeLocation } from '@/lib/catalog'
import { createClient } from '@/utils/supabase/client'

export default function OrderTrackingPage({
  params
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = use(params)
  const store = useStore()
  const localOrder = store.orders[ref]

  const [dbOrder, setDbOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch live order from Supabase
  useEffect(() => {
    async function loadOrder() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', ref)
          .maybeSingle()

        if (data) {
          setDbOrder(data)
        }
      } catch (err) {
        console.warn('Could not fetch order from Supabase:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()

    // Poll every 4 seconds for real-time status updates from Admin
    const interval = setInterval(loadOrder, 4000)
    return () => clearInterval(interval)
  }, [ref])

  // Parse receipt and customer note from notes JSON if present
  let dbReceiptUrl = dbOrder?.receipt_url
  let dbReceiptName = dbOrder?.receipt_name
  if (dbOrder?.notes && typeof dbOrder.notes === 'string' && dbOrder.notes.startsWith('{')) {
    try {
      const parsed = JSON.parse(dbOrder.notes)
      if (parsed.receiptUrl) dbReceiptUrl = parsed.receiptUrl
      if (parsed.receiptName) dbReceiptName = parsed.receiptName
    } catch {
      // ignore
    }
  }

  // Resolve details from DB or Local state fallback
  const orderDetails = {
    ref,
    customerName: dbOrder?.customer_name || localOrder?.customerName || 'Valued Customer',
    phone: dbOrder?.customer_phone || localOrder?.phone || '080 1234 5678',
    address: dbOrder?.delivery_address || localOrder?.address || 'Isaac Boro Expressway, Yenagoa, Bayelsa State',
    total: dbOrder?.total_amount ? Number(dbOrder.total_amount) : localOrder?.total || 35000,
    createdAt: dbOrder?.created_at ? new Date(dbOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : localOrder?.createdAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: dbOrder?.order_status || localOrder?.status || 'Waiting to confirm receipt',
    etaMinutes: 22,
    receiptUrl: dbReceiptUrl || localOrder?.receiptUrl || null,
    receiptName: dbReceiptName || localOrder?.receiptName || 'Bank_Transfer_Receipt.jpg'
  }

  // Determine active step index
  const statusStepMap: Record<string, number> = {
    'Waiting to confirm receipt': 1,
    'Payment Verification': 1,
    'Decant Pouring': 2,
    'Out for Delivery': 3,
    'Ready for Pickup': 3,
    'Delivered': 4,
    'Cancelled': 0
  }
  const activeStep = statusStepMap[orderDetails.status] ?? 1

  // Clean, accurate Google Maps embed targeting destination in Yenagoa
  const mapSearchQuery = encodeURIComponent(`${orderDetails.address}, Yenagoa, Bayelsa State`)
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors mb-2"
              >
                <ArrowLeft size={14} /> Back to Catalogue
              </Link>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                Order <span className="font-mono text-amber-300 font-normal">#{ref}</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Live Dispatch Tracking
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
              >
                <ExternalLink size={13} /> Open in Google Maps
              </a>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Live Google Maps Tracker & Timeline */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Google Maps Container */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-neutral-900 shadow-2xl space-y-0">
                
                {/* Map Header Status Bar */}
                <div className="p-4 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                    <MapPin size={16} className="text-amber-400 shrink-0" />
                    <span className="truncate">Destination: <strong>{orderDetails.address}</strong></span>
                  </div>
                  <div className="text-xs font-mono text-amber-300 flex items-center gap-1 shrink-0">
                    <Clock size={14} /> ETA: {orderDetails.etaMinutes} mins
                  </div>
                </div>

                {/* Map Embed Frame */}
                <div className="relative w-full h-[360px] sm:h-[420px] bg-neutral-950">
                  <iframe
                    title="Trendy Scents Live Delivery Tracker Map"
                    src={googleMapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Floating Overlay Route Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/90 backdrop-blur-md border border-amber-500/30 text-white shadow-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-md shrink-0">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                          Decant Dispatch Status: {orderDetails.status}
                        </p>
                        <p className="text-xs text-neutral-300">
                          {activeStep >= 3 ? 'Courier en route to your location in Yenagoa' : 'Custom oil decants being measured at the bar'}
                        </p>
                      </div>
                    </div>
                    
                    <a
                      href={`https://wa.me/2348012345678?text=Hello%20Trendy%20Scents,%20checking%20status%20for%20order%20${ref}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare size={13} /> Chat Courier
                    </a>
                  </div>
                </div>
              </div>


              {/* Receipt Confirmation Status Banner */}
              {orderDetails.status === 'Waiting to confirm receipt' ? (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
                    <span>Waiting for Admin to Confirm Receipt</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                    Your order reference <strong className="text-amber-300">#{ref}</strong> and receipt screenshot have been submitted.
                    Admin is reviewing your receipt. Once confirmed, order tracking will automatically start and step forward.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      Receipt Confirmed by Admin
                    </p>
                    <p className="text-xs text-neutral-300 font-mono">
                      Admin verified your bank transfer. Decant pouring and dispatch are in progress.
                    </p>
                  </div>
                </div>
              )}

              {/* Real-time Order Progress Timeline */}
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-6">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <PackageCheck size={18} className="text-amber-400" /> Fulfillment Timeline
                </h3>

                <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-800">
                  
                  {[
                    { title: 'Order Placed & Reference Issued', desc: `Reference #${ref} logged at ${orderDetails.createdAt}`, icon: CheckCircle2, stepNum: 0 },
                    { title: 'Payment Receipt Verified', desc: 'Uploaded transfer screenshot confirmed by bar desk', icon: ShieldCheck, stepNum: 1 },
                    { title: 'Precision Decant Pouring', desc: 'Oil decants measured to the millilitre in amber glass bottles', icon: Sparkles, stepNum: 2 },
                    { title: 'Google Maps Live Dispatch', desc: 'Courier en route along Isaac Boro Expressway', icon: Navigation, stepNum: 3 }
                  ].map((s) => {
                    const isDone = activeStep >= s.stepNum
                    const isCurrent = activeStep === s.stepNum
                    const IconComp = s.icon

                    return (
                      <div key={s.stepNum} className="relative pl-10 flex items-start justify-between">
                        <div
                          className={`absolute left-0 top-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/30'
                              : isDone
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-neutral-950 text-neutral-600 border-neutral-800'
                          }`}
                        >
                          <IconComp size={16} />
                        </div>

                        <div>
                          <p className={`text-sm font-mono font-bold ${isDone ? 'text-white' : 'text-neutral-500'}`}>
                            {s.title}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">{s.desc}</p>
                        </div>

                        {isCurrent && (
                          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                            Active
                          </span>
                        )}
                      </div>
                    )
                  })}

                </div>
              </div>

            </div>

            {/* Right Column: Receipt Verification & Customer Order Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Receipt Upload Verification Card */}
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                    <FileText size={15} /> Payment Receipt
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {dbOrder?.payment_status === 'verified' ? 'Verified' : 'Attached'}
                  </span>
                </div>

                {orderDetails.receiptUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 aspect-[4/3] group">
                    <img
                      src={orderDetails.receiptUrl}
                      alt="Uploaded Bank Transfer Receipt Screenshot"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={orderDetails.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#C8923C] text-[#0A0908] font-mono text-xs font-bold shadow"
                      >
                        View Full Image
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-mono text-white font-bold truncate">
                        {orderDetails.receiptName}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-400">Attached to Order Reference #{ref}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery & Customer Info */}
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                <h3 className="text-base font-serif font-bold text-white">Delivery Information</h3>
                
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between pb-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Customer:</span>
                    <span className="text-white font-bold">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Phone / WhatsApp:</span>
                    <span className="text-amber-300 font-bold">{orderDetails.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-neutral-400">Destination:</span>
                    <p className="text-white text-xs leading-relaxed font-sans">{orderDetails.address}</p>
                  </div>
                </div>
              </div>

              {/* Direct Support Contact Buttons */}
              <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                <h3 className="text-base font-serif font-bold text-white">Need Quick Assistance?</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Our bar desk team at Isaac Boro Expressway is available to confirm custom decant mixtures or update delivery addresses.
                </p>

                <div className="flex gap-3 pt-2">
                  <a
                    href="tel:08012345678"
                    className="w-1/2 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone size={14} className="text-amber-400" /> Call Bar
                  </a>
                  <a
                    href={`https://wa.me/2348012345678?text=Hi%20Trendy%20Scents,%20my%20order%20ref%20is%20${ref}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-1/2 py-3 rounded-xl bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-[#C8923C]/20"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
