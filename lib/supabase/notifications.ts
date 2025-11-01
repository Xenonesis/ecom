import { createClient } from './client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface Notification {
  id: string
  user_id: string | null
  title: string | null
  message: string | null
  type: string | null
  is_read: boolean | null
  data?: Record<string, unknown>
  created_at: string | null
  updated_at?: string | null
}

export class NotificationManager {
  private readonly supabase = createClient()

  // Create a notification
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get user notifications
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Notification[]
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select()

    if (error) throw error
    return data
  }

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (payload: RealtimePostgresChangesPayload<Notification>) => void) {
    const channel = this.supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()

    return channel
  }

  // Create order notification
  async createOrderNotification(userId: string, orderId: string, status: string) {
    const title = `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`
    const message = `Your order #${orderId.slice(-8)} has been ${status}`

    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'order',
      is_read: false,
      data: { order_id: orderId, status }
    })
  }

  // Create cart reminder notification
  async createCartReminderNotification(userId: string, itemCount: number) {
    return this.createNotification({
      user_id: userId,
      title: 'Cart Reminder',
      message: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart`,
      type: 'cart',
      is_read: false,
      data: { item_count: itemCount }
    })
  }

  // Create wishlist notification
  async createWishlistNotification(userId: string, productName: string, action: 'added' | 'removed') {
    const actionText = action === 'added' ? 'added to' : 'removed from'
    return this.createNotification({
      user_id: userId,
      title: 'Wishlist Update',
      message: `${productName} has been ${actionText} your wishlist`,
      type: 'wishlist',
      is_read: false,
      data: { product_name: productName, action }
    })
  }
}

// Singleton instance
export const notificationManager = new NotificationManager()