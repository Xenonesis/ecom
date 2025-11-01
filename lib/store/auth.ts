import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { useCartStore } from './cart'

interface AuthStore {
  user: User | null
  userRole: 'customer' | 'seller' | 'admin' | null
  setUser: (user: User | null) => void
  setUserRole: (role: 'customer' | 'seller' | 'admin' | null) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userRole: null,
  setUser: (user) => {
    set({ user })
    // Sync cart when user logs in
    if (user) {
      useCartStore.getState().syncWithDatabase(user.id)
    }
  },
  setUserRole: (role) => set({ userRole: role }),
}))
