import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { scents } from '@/lib/catalog'
import type { ProductRow } from '@/lib/supabase/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let supabase
    try {
      supabase = await createAdminClient()
    } catch {
      supabase = await createClient()
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase fetch public products error:', error.message)
      return NextResponse.json({ products: scents, source: 'fallback', error: error.message })
    }

    if (data && data.length > 0) {
      return NextResponse.json(
        { products: data as ProductRow[], source: 'supabase' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
          }
        }
      )
    }

    return NextResponse.json({ products: scents, source: 'fallback' })
  } catch (err: any) {
    console.error('Error in public products API:', err)
    return NextResponse.json({ products: scents, source: 'fallback', error: err?.message })
  }
}
