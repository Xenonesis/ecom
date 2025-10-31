export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'seller' | 'admin'
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: UserRole
          verified: boolean
          created_at: string
          avatar_url: string | null
          phone: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: UserRole
          verified?: boolean
          created_at?: string
          avatar_url?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: UserRole
          verified?: boolean
          created_at?: string
          avatar_url?: string | null
          phone?: string | null
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          name: string
          description: string
          category: string
          price: number
          discount: number
          stock: number
          images: string[]
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          name: string
          description: string
          category: string
          price: number
          discount?: number
          stock: number
          images?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          name?: string
          description?: string
          category?: string
          price?: number
          discount?: number
          stock?: number
          images?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          seller_id: string
          items: Json
          total_amount: number
          status: OrderStatus
          payment_status: PaymentStatus
          created_at: string
          updated_at: string
          shipping_address: Json
          payment_intent_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          seller_id: string
          items: Json
          total_amount: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          created_at?: string
          updated_at?: string
          shipping_address: Json
          payment_intent_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          seller_id?: string
          items?: Json
          total_amount?: number
          status?: OrderStatus
          payment_status?: PaymentStatus
          created_at?: string
          updated_at?: string
          shipping_address?: Json
          payment_intent_id?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      payment_status: PaymentStatus
    }
  }
}
