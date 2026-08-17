export type ProductRow = {
  id: string;
  name: string;
  family: string;
  notes: string;
  price: number;
  available: boolean;
  tone: string;
  image: string;
  description?: string | null;
  created_at?: string;
}

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_address?: string | null;
  city?: string | null;
  state?: string | null;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'verified' | 'failed';
  order_status: 'Waiting to confirm receipt' | 'Payment Verification' | 'Decant Pouring' | 'Out for Delivery' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';
  receipt_url?: string | null;
  receipt_name?: string | null;
  notes?: string | null;
  created_at: string;
}

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  price: number;
  quantity: number;
  size?: string | null;
  created_at?: string;
}
