import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import type { OrderRow, OrderItemRow } from '@/lib/supabase/types'

// GET /api/admin/orders - Fetch all customer orders and their items
export async function GET() {
  try {
    let supabase
    try {
      supabase = await createAdminClient()
    } catch {
      supabase = await createClient()
    }

    const { data: dbOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Supabase fetch orders error:', ordersError)
      return NextResponse.json({ error: ordersError.message }, { status: 500 })
    }

    const { data: dbItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')

    const itemsMap: Record<string, OrderItemRow[]> = {}
    if (dbItems) {
      dbItems.forEach((item: OrderItemRow) => {
        if (!itemsMap[item.order_id]) itemsMap[item.order_id] = []
        itemsMap[item.order_id].push(item)
      })
    }

    return NextResponse.json({
      success: true,
      orders: dbOrders as OrderRow[],
      itemsMap
    })
  } catch (err: any) {
    console.error('Error fetching admin orders API:', err)
    return NextResponse.json({ error: err?.message || 'Server error fetching orders' }, { status: 500 })
  }
}

// POST /api/admin/orders - Update order status & payment status
export async function POST(req: NextRequest) {
  try {
    const { orderId, orderNumber, newStatus } = await req.json()

    if (!orderNumber || !newStatus) {
      return NextResponse.json({ error: 'orderNumber and newStatus are required' }, { status: 400 })
    }

    const isPaymentVerified = newStatus !== 'Waiting to confirm receipt' && newStatus !== 'Cancelled'
    const newPaymentStatus = isPaymentVerified ? 'verified' : newStatus === 'Cancelled' ? 'failed' : 'pending'

    let supabase
    try {
      supabase = await createAdminClient()
    } catch {
      supabase = await createClient()
    }

    const { data, error } = await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        payment_status: newPaymentStatus
      })
      .match({ order_number: orderNumber })
      .select()

    if (error) {
      console.error('Supabase update order status error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: data?.[0],
      newStatus,
      newPaymentStatus
    })
  } catch (err: any) {
    console.error('Error updating order status API:', err)
    return NextResponse.json({ error: err?.message || 'Server error updating order' }, { status: 500 })
  }
}
