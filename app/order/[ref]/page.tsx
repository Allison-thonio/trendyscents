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

export default function OrderTrackingPage({
  params
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = use(params)
  const store = useStore()
  const order = store.orders[ref]

  // Default mock fallback if opened directly without local state
  const orderDetails = order || {
    ref,
    customerName: 'Valued Customer',
    phone: '080 1234 5678',
    address: 'Isaac Boro Expressway, Yenagoa, Bayelsa State',
    items: [],
    total: 35000,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Decant Pouring' as const,
    etaMinutes: 22,
    receiptName: 'Bank_Transfer_Receipt.jpg'
  }

  const [activeStep, setActiveStep] = useState(2) // 0: Placed, 1: Verified, 2: Decant Pouring, 3: En Route

  useEffect(() => {
    // Simulate real-time progress update
    const timer = setTimeout(() => {
      setActiveStep(3)
    }, 12000)
    return () => clearTimeout(timer)
  }, [])

  // Google Maps iframe src centered at Isaac Boro Expressway, Yenagoa
  const googleMapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15904.382419266155!2d6.3059421!3d4.9163329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106a050048eccd6f%3A0xf339d05ae6a61279!2sTrendy%20Scents!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng`

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
                href={storeLocation.googleMapsUrl}
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
                    <MapPin size={16} className="text-amber-400" />
                    <span>Origin: <strong>Isaac Boro Expressway, Yenagoa</strong></span>
                  </div>
                  <div className="text-xs font-mono text-amber-300 flex items-center gap-1">
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
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Floating Overlay Route Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 text-white shadow-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                          Decant Dispatch Courier
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
                      className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare size={13} /> Chat Courier
                    </a>
                  </div>
                </div>
              </div>

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
                    <FileText size={15} /> Payment Receipt Uploaded
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Confirmed
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
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-mono text-xs font-bold shadow"
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
                        {orderDetails.receiptName || 'Bank_Transfer_Receipt.jpg'}
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
                    className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
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
