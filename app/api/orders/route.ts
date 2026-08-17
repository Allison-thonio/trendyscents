import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

// In-memory sliding window rate limiter map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>()
const MAX_ORDERS_PER_WINDOW = 3
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) || []).filter((ts) => now - ts < WINDOW_MS)
  if (timestamps.length >= MAX_ORDERS_PER_WINDOW) {
    return false
  }
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Determine client IP address
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1'

    // Enforce rate limit (max 3 orders per 5 mins per IP)
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Order limit reached. Please wait 5 minutes before submitting another order.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      ref,
      customerName,
      phone,
      address,
      total,
      receiptUrl,
      receiptName,
      items
    } = body

    // Validation & Anti-Abuse Checks
    const cleanName = (customerName || '').trim()
    const cleanPhone = (phone || '').replace(/\D/g, '')

    if (!ref || cleanName.length < 2 || cleanPhone.length < 10 || !total || Number(total) <= 0) {
      return NextResponse.json(
        { error: 'Invalid order details. Please check name (min 2 chars), phone (min 10 digits), and items.' },
        { status: 400 }
      )
    }

    let supabase
    try {
      supabase = await createAdminClient()
    } catch {
      supabase = await createClient()
    }

    // Insert order into Supabase public.orders
    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: ref,
        customer_name: customerName,
        customer_phone: phone,
        delivery_address: address || 'Isaac Boro Expressway, Yenagoa',
        total_amount: Number(total),
        payment_method: 'Bank Transfer',
        payment_status: 'pending',
        order_status: 'Waiting to confirm receipt',
        receipt_url: receiptUrl || null,
        receipt_name: receiptName || 'Bank_Transfer_Receipt.jpg'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Supabase insert order error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Insert order items if present
    if (insertedOrder && Array.isArray(items) && items.length > 0) {
      const orderItemsPayload = items.map((line: any) => ({
        order_id: insertedOrder.id,
        product_id: line.scent?.id || line.productId || null,
        product_name: line.scent?.name || line.productName || 'Fragrance Decant',
        price: Number(line.scent?.price || line.price || 0),
        quantity: Number(line.quantity || 1)
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)
      if (itemsError) {
        console.warn('Supabase order items insert error:', itemsError)
      }
    }

    return NextResponse.json({ success: true, order: insertedOrder })
  } catch (err: any) {
    console.error('Error placing order API:', err)
    return NextResponse.json({ error: err?.message || 'Server error placing order' }, { status: 500 })
  }
}
