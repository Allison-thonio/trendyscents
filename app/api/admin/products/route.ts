import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scents } from '@/lib/catalog'
import type { ProductRow } from '@/lib/supabase/types'

// GET /api/admin/products
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase fetch products error:', error.message)
      return NextResponse.json({ products: scents, source: 'fallback', error: error.message })
    }

    if (data && data.length > 0) {
      return NextResponse.json({ products: data as ProductRow[], source: 'supabase' })
    }

    return NextResponse.json({ products: scents, source: 'fallback' })
  } catch (err: any) {
    console.error('Error fetching products API:', err)
    return NextResponse.json({ products: scents, source: 'fallback', error: err?.message })
  }
}

// POST /api/admin/products (Create or Update Product)
export async function POST(req: NextRequest) {
  try {
    const product: ProductRow = await req.json()

    if (!product.id || !product.name || !product.price) {
      return NextResponse.json({ error: 'Missing required product fields (id, name, price)' }, { status: 400 })
    }

    const supabase = await createClient()

    // Upsert product into Supabase products table
    const { data, error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        family: product.family,
        notes: product.notes,
        price: Number(product.price),
        available: product.available ?? true,
        tone: product.tone || 'amber',
        image: product.image,
        description: product.description || '',
        created_at: product.created_at || new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Supabase upsert product error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: data?.[0] || product })
  } catch (err: any) {
    console.error('Error saving product API:', err)
    return NextResponse.json({ error: err?.message || 'Server error saving product' }, { status: 500 })
  }
}

// DELETE /api/admin/products
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().match({ id })

    if (error) {
      console.error('Supabase delete product error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch (err: any) {
    console.error('Error deleting product API:', err)
    return NextResponse.json({ error: err?.message || 'Server error deleting product' }, { status: 500 })
  }
}
