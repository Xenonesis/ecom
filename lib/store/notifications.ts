import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { notificationManager, type Notification } from '../supabase/notifications'
import { useAuthStore } from './auth'

// Temporary type until notifications table is created
// interface Notification {
//   id: string
//   user_id: string
//   title: string
//   message: string
//   type: 'order' | 'cart' | 'wishlist' | 'review' | 'system'
//   read: boolean
//   data?: Record<string, unknown>
//   created_at: string
// }

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  realtimeChannel: RealtimeChannel | null

  // Actions
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Notification) => void
  subscribeToRealtime: () => void
  unsubscribeFromRealtime: () => void
  clearError: () => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      realtimeChannel: null,

      fetchNotifications: async () => {
        const user = useAuthStore.getState().user
        if (!user) return

        set({ isLoading: true, error: null })
        try {
          const notifications = await notificationManager.getNotifications(user.id)
          const unreadCount = notifications.filter(n => !n.is_read).length
          set({ notifications, unreadCount, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch notifications',
            isLoading: false
          })
        }
      },

      markAsRead: async (notificationId: string) => {
        const user = useAuthStore.getState().user
        if (!user) return

        try {
          await notificationManager.markAsRead(notificationId)
          set(state => ({
            notifications: state.notifications.map(n =>
              n.id === notificationId ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to mark notification as read'
          })
        }
      },

      markAllAsRead: async () => {
        const user = useAuthStore.getState().user
        if (!user) return

        try {
          await notificationManager.markAllAsRead(user.id)
          const notifications = get().notifications.map(n => ({ ...n, is_read: true }))
          set({ notifications, unreadCount: 0 })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
          })
        }
      },

      addNotification: (notification: Notification) => {
        const notifications = [notification, ...get().notifications]
        const unreadCount = notifications.filter(n => !n.is_read).length
        set({ notifications, unreadCount })
      },

      subscribeToRealtime: () => {
        const user = useAuthStore.getState().user
        if (!user || get().realtimeChannel) return

        const channel = notificationManager.subscribeToNotifications(user.id, (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            get().addNotification(payload.new)
          }
        })

        set({ realtimeChannel: channel })
      },

      unsubscribeFromRealtime: () => {
        const channel = get().realtimeChannel
        if (channel) {
          channel.unsubscribe()
          set({ realtimeChannel: null })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 20), // Only persist recent notifications
        unreadCount: state.unreadCount
      })
    }
  )
)