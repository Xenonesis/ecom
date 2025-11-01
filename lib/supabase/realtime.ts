import { createClient } from './client'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export class RealtimeManager {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()

  // Subscribe to cart changes for a user
  subscribeToCart(userId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    const channelName = `cart:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to order status changes
  subscribeToOrders(userId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    const channelName = `orders:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to wishlist changes
  subscribeToWishlist(userId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    const channelName = `wishlist:${userId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlist',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to product updates (for sellers)
  subscribeToProducts(sellerId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    const channelName = `products:${sellerId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `seller_id=eq.${sellerId}`,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Subscribe to new reviews for products
  subscribeToProductReviews(productId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    const channelName = `reviews:${productId}`
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `product_id=eq.${productId}`,
        },
        callback
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    for (const [, channel] of this.channels) {
      this.supabase.removeChannel(channel)
    }
    this.channels.clear()
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager()