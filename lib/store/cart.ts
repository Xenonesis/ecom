import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  name: string
  price: number
  discount: number
  quantity: number
  image: string
  seller_id: string
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  recommendations: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (product_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  syncWithDatabase: (userId: string) => Promise<void>
  loadRecommendations: (productIds: string[]) => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      recommendations: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.product_id === item.product_id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (product_id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== product_id),
        })),
      updateQuantity: (product_id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === product_id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((sum, item) => {
          const discountedPrice = item.price - (item.price * item.discount) / 100
          return sum + discountedPrice * item.quantity
        }, 0)
      },
      syncWithDatabase: async (userId: string) => {
        set({ isLoading: true })
        try {
          // Load cart from database
          const response = await fetch('/api/cart')
          if (response.ok) {
            const { items: dbItems } = await response.json()
            const cartItems: CartItem[] = dbItems.map((item: any) => ({
              product_id: item.product_id,
              name: item.product.name,
              price: item.product.price,
              discount: item.product.discount,
              quantity: item.quantity,
              image: item.product.images[0] || '',
              seller_id: item.product.seller_id,
            }))
            set({ items: cartItems })
          }
        } catch (error) {
          console.error('Failed to sync cart with database:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      loadRecommendations: async (productIds: string[]) => {
        if (productIds.length === 0) return

        try {
          // Get frequently bought together products
          const response = await fetch(`/api/products?recommendations=${productIds.join(',')}&limit=4`)
          if (response.ok) {
            const { products } = await response.json()
            const recommendations: CartItem[] = products.map((product: any) => ({
              product_id: product.id,
              name: product.name,
              price: product.price,
              discount: product.discount,
              quantity: 1,
              image: product.images[0] || '',
              seller_id: product.seller_id,
            }))
            set({ recommendations })
          }
        } catch (error) {
          console.error('Failed to load recommendations:', error)
        }
      },
    }),
    {
      name: 'cart-storage',
      // Only persist items, not loading state or recommendations
      partialize: (state) => ({ items: state.items }),
    }
  )
)
