'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck, MapPin, Sparkles, Copy, Phone, User, Home, CreditCard, UploadCloud, FileText, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react'
import { Footer, SiteNav } from '@/components/site-shell'
import { cartTotal, useStore } from '@/lib/store'
import { naira } from '@/lib/catalog'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)
  const [ref] = useState(`TS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  // Customer Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Receipt File Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

  const cart = useStore((s) => s.cart)
  const clearCart = useStore((s) => s.clear)
  const saveOrder = useStore((s) => s.saveOrder)
  const total = cartTotal(cart)

  const copyBank = () => {
    navigator.clipboard.writeText('Zenith Bank 1012345678')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = (file: File) => {
    if (!file) return
    setUploadError('')

    // Size limit check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.')
      return
    }

    setReceiptFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setReceiptPreview(null)
    }
  }

  const handleCompleteOrder = () => {
    saveOrder({
      ref,
      customerName: name || 'Valued Customer',
      phone: phone || '08000000000',
      address: address || 'Isaac Boro Expressway, Yenagoa',
      items: [...cart],
      total,
      receiptUrl: receiptPreview || undefined,
      receiptName: receiptFile?.name || 'Bank_Transfer_Receipt.jpg',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Payment Verification',
      etaMinutes: 25,
    })
    clearCart()
    setStep(3)
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-32 pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Step Indicator */}
          <div className="mb-10 pb-6 border-b border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest mb-2">
                <Sparkles size={13} /> Step 0{step} of 03
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {step === 1 ? 'Customer & Delivery Details' : step === 2 ? 'Make Transfer & Upload Receipt' : 'Order Confirmed'}
              </h1>
            </div>

            {/* Stepper Pills */}
            <div className="flex items-center gap-2">
              {[
                { num: 1, label: 'Details' },
                { num: 2, label: 'Receipt' },
                { num: 3, label: 'Tracking' }
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    step === s.num
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                      : step > s.num
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  <span>0{s.num}.</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Form & Payment Steps */}
            <div className="lg:col-span-7 bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-neutral-800/90 shadow-2xl space-y-6">
              
              {step === 1 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setStep(2)
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                      <User size={18} className="text-amber-400" /> Personal Information
                    </h2>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Blessing Amadi"
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                        Phone Number / WhatsApp *
                      </label>
                      <input
                        id="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0801 234 5678"
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <hr className="border-neutral-800" />

                  <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                      <Home size={18} className="text-amber-400" /> Delivery Address or Pickup Note
                    </h2>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                        Delivery Address or Store Pickup Request *
                      </label>
                      <textarea
                        id="address"
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Provide your delivery address in Yenagoa or request pickup at our Isaac Boro Expressway bar..."
                        className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Order Summary Recap */}
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>Selected Decants ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                      <span className="text-amber-300 font-bold">{naira(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <span>Continue to Payment & Receipt Upload</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Account Details Box */}
                  <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-700/80 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                      <span className="text-xs font-mono text-neutral-400 uppercase">Bank Name</span>
                      <span className="font-serif font-bold text-white text-base">Zenith Bank</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                      <span className="text-xs font-mono text-neutral-400 uppercase">Account Name</span>
                      <span className="font-serif font-bold text-amber-300 text-base">Trendy Scents</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-neutral-400 uppercase">Account Number</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-xl text-white tracking-widest font-bold">1012345678</strong>
                        <button
                          onClick={copyBank}
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-700 transition-colors"
                          title="Copy Account Number"
                        >
                          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-mono">Total Payable:</span>
                    <strong className="font-serif text-2xl text-amber-300 font-bold">{naira(total)}</strong>
                  </div>

                  {/* Payment Receipt File Upload Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                        <UploadCloud size={16} /> Attach Payment Receipt / Screenshot *
                      </label>
                      <span className="text-[11px] font-mono text-neutral-400">JPG, PNG, WEBP, PDF (Max 10MB)</span>
                    </div>

                    {!receiptFile ? (
                      <label className="border-2 border-dashed border-neutral-700 hover:border-amber-500/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer bg-neutral-950/60 hover:bg-neutral-950 transition-all text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Click or drag & drop transfer receipt here</p>
                          <p className="text-xs text-neutral-400 mt-1">Proof of transfer speeds up decant preparation</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                          }}
                        />
                      </label>
                    ) : (
                      <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {receiptPreview ? (
                              <img
                                src={receiptPreview}
                                alt="Receipt screenshot preview"
                                className="w-12 h-12 object-cover rounded-lg border border-neutral-700"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400">
                                <FileText size={20} />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                {receiptFile.name} <CheckCircle2 size={13} className="text-emerald-400" />
                              </p>
                              <p className="text-[11px] font-mono text-neutral-400">
                                {(receiptFile.size / 1024).toFixed(1)} KB · Ready to submit
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setReceiptFile(null)
                              setReceiptPreview(null)
                            }}
                            className="p-2 rounded-lg bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Remove File"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-xs font-mono text-red-400">{uploadError}</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase tracking-wider font-medium hover:bg-neutral-900"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCompleteOrder}
                      disabled={!receiptFile}
                      className={`w-2/3 py-3.5 rounded-xl text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        receiptFile
                          ? 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 cursor-pointer'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      }`}
                    >
                      <span>Submit Receipt & Create Order</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <Check size={32} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      Payment Receipt Submitted!
                    </h2>
                    <p className="text-sm text-neutral-300 max-w-md mx-auto">
                      Your order reference <strong className="text-amber-300 font-mono px-2 py-0.5 rounded bg-neutral-950 border border-amber-500/30">{ref}</strong> is active. You can track your decant pouring and Google Maps delivery in real time below.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href={`/order/${ref}`}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 inline-flex items-center justify-center gap-2"
                    >
                      <span>Open Live Order & Maps Tracker</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Featured Store Lounge Image & Guarantee Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Photo Card featuring the Arched Vanity Mirror & Lounge Interior */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-neutral-900 aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] group">
                <img
                  src="/images/shop-checkout-lounge.jpg"
                  alt="Trendy Scents Lounge with Arched Vanity Mirror & Decant Station"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono">
                    <MapPin size={13} /> Flagship Lounge · Yenagoa
                  </span>
                </div>

                {/* Bottom Quote Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-2">
                  <p className="font-serif italic text-amber-200 text-sm leading-relaxed">
                    "Every drop of perfume from Trendy Scents tells your story."
                  </p>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    Isaac Boro Expressway · Yenagoa, Bayelsa State
                  </span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <span className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={16} /> 100% Authentic Oil Assurance
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  All decants are poured directly from authentic concentrated oil stocks at our Yenagoa flagship bar. Uncut, long-lasting, and delivered in protective glass bottles.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
