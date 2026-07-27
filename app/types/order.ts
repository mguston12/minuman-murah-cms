/**
 * Order types
 * Based on OrderResource from backend
 */

export interface OrderItem {
  id: number
  fk_order_id: number
  fk_product_id?: number | null
  fk_variant_id?: number | null
  product_name: string
  product_image?: string | null
  sku: string
  variant_description?: string | null
  qty: number
  actual_price: number
  discount_price?: number | null
  purchase_price: number
  subtotal: number
  note?: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  uuid: string
  queue_number?: number | null
  order_number: string

  // Contact Info
  contact_email: string
  contact_phone: string

  // Shipping Address
  shipping_country: string
  shipping_first_name: string
  shipping_last_name?: string | null
  shipping_address: string
  shipping_city: string
  shipping_province: string
  shipping_postal_code: string
  shipping_label_place?: string | null
  shipping_note_address?: string | null
  shipping: {
    first_name: string
    last_name?: string | null
    address: string
    city: string
    province: string
    postal_code: string
  }

  // Billing Address (optional)
  billing_country?: string | null
  billing_first_name?: string | null
  billing_last_name?: string | null
  billing_address?: string | null
  billing_city?: string | null
  billing_province?: string | null
  billing_postal_code?: string | null
  billing_label_place?: string | null
  billing_note_address?: string | null

  // Courier
  courier?: {
    agent?: string | null
    service?: string | null
    service_desc?: string | null
    estimate_delivered?: string | null
    resi_number?: string | null
    cost: number
  }

  // Payment
  payment_method?: string | null
  payment_reference_code?: string | null
  payment_snap_token?: string | null
  payment?: {
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
    }

  // Notes
  invoice_note?: string | null
  delivery_order_note?: string | null

  // Totals
  subtotal: number
  discount_amount: number
  shipping_cost: number
  total_amount: number

  // User & voucher
  fk_user_id?: number | null
  fk_voucher_id?: number | null

  // Status
  status: 'PENDING' | 'PACKING' | 'DELIVERING' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'

  order_items?: OrderItem[]

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface OrderResponse {
  success: boolean
  message?: string
  data: {
    order: Order
  }
}

export interface OrdersResponse {
  success: boolean
  message?: string
  data: Order[] | {
    orders: Order[]
    pagination?: {
      current_page: number
      per_page: number
      total: number
      last_page: number
      from?: number | null
      to?: number | null
    }
  }
}

export interface OrderUpdatePaymentPayload {
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
}
