'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { naira, scents, Scent } from '@/lib/catalog'
import type { ProductRow } from '@/lib/supabase/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)

  // Form Fields
  const [formData, setFormData] = useState<Partial<ProductRow>>({
    id: '',
    name: '',
    family: 'Oud',
    notes: '',
    price: 8500,
    available: true,
    tone: 'amber',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
    description: ''
  })

  const supabase = createClient()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) {
        setProducts(data as ProductRow[])
      } else {
        setProducts(scents as ProductRow[])
      }
    } catch (e) {
      console.error('Error fetching products', e)
      setProducts(scents as ProductRow[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleToggleAvailability = async (product: ProductRow) => {
    const updatedStatus = !product.available
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, available: updatedStatus } : p))
    )

    try {
      await supabase
        .from('products')
        .update({ available: updatedStatus })
        .match({ id: product.id })
    } catch (err) {
      console.error('Error updating availability', err)
    }
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    const productId = editingProduct
      ? editingProduct.id
      : formData.id || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')

    const payload: ProductRow = {
      id: productId,
      name: formData.name,
      family: formData.family || 'Oud',
      notes: formData.notes || '',
      price: Number(formData.price),
      available: formData.available ?? true,
      tone: formData.tone || 'amber',
      image: formData.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
      description: formData.description || ''
    }

    // Save to Supabase
    try {
      await supabase.from('products').upsert(payload)
    } catch (err) {
      console.error('Supabase save error:', err)
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? payload : p)))
    } else {
      setProducts((prev) => [payload, ...prev])
    }

    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this scent from the catalog?')) return

    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      await supabase.from('products').delete().match({ id })
    } catch (err) {
      console.error('Error deleting product', err)
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      id: '',
      name: '',
      family: 'Oud',
      notes: '',
      price: 8500,
      available: true,
      tone: 'amber',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
      description: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: ProductRow) => {
    setEditingProduct(product)
    setFormData(product)
    setIsModalOpen(true)
  }

  const families = ['All', 'Oud', 'Fresh', 'Gourmand', 'Floral', 'Woody', 'Amber']

  const filteredProducts = products.filter((p) => {
    const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q || p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q)
    return matchesFamily && matchesQuery
  })

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles size={13} /> Fragrance Catalogue & Stock
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Manage Perfume Oils
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Stock</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md shadow-[#C8923C]/20 flex items-center gap-1.5"
          >
            <Plus size={15} /> Add New Scent
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Family Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {families.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFamily(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border whitespace-nowrap ${
                selectedFamily === f
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search scent name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-neutral-800">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-amber-300 font-mono text-[10px] uppercase">
                    {p.family}
                  </span>
                  <button
                    onClick={() => handleToggleAvailability(p)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold transition-all ${
                      p.available
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {p.available ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-white">{p.name}</h3>
                <p className="text-xs font-mono text-amber-400">{p.notes}</p>
                {p.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{p.description}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <strong className="font-serif text-lg text-white">{naira(p.price)}</strong>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded-lg bg-neutral-950 border border-neutral-700 text-amber-300 hover:text-white transition-colors"
                  title="Edit Product"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="p-2 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-neutral-900 border border-neutral-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xl font-serif font-bold text-white">
                {editingProduct ? 'Edit Perfume Oil' : 'Add New Perfume Oil'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-amber-300 uppercase">Scent Name *</label>
                  <input
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Musk"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-amber-300 uppercase">Family *</label>
                  <select
                    value={formData.family || 'Oud'}
                    onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {['Oud', 'Fresh', 'Gourmand', 'Floral', 'Woody', 'Amber'].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-amber-300 uppercase">Base Price (₦ per 10ml) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="8500"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-amber-300 uppercase">Initial Availability</label>
                  <select
                    value={formData.available ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-amber-300 uppercase">Fragrance Notes *</label>
                <input
                  required
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Cambodian Oud · Amber · Cedarwood"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-amber-300 uppercase">Image URL</label>
                <input
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-amber-300 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short Olfactory description..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C8923C] hover:bg-[#D89A3E] text-[#0A0908] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
