import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  userRole: 'customer' | 'seller' | 'admin' | null
  setUser: (user: User | null) => void
  setUserRole: (role: 'customer' | 'seller' | 'admin' | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userRole: null,
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
}))
