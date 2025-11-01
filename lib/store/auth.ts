import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { useCartStore } from './cart'
import { useNotificationsStore } from './notifications'

interface AuthStore {
  user: User | null
  userRole: 'customer' | 'seller' | 'admin' | null
  setUser: (user: User | null) => void
  setUserRole: (role: 'customer' | 'seller' | 'admin' | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userRole: null,
  setUser: (user) => {
    set({ user })
    // Sync cart and subscribe to realtime updates when user logs in
    if (user) {
      useCartStore.getState().syncWithDatabase()
      useCartStore.getState().subscribeToRealtime(user.id)
      useNotificationsStore.getState().subscribeToRealtime()
    } else {
      // Unsubscribe from realtime when user logs out
      useCartStore.getState().unsubscribeFromRealtime()
      useNotificationsStore.getState().unsubscribeFromRealtime()
    }
  },
  setUserRole: (role) => set({ userRole: role }),
}))
