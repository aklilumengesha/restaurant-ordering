"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string // menuItem id
  name: string
  price: number
  imageUrl?: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  remove: (id: string) => void
  setQuantity: (id: string, qty: number) => void
  clear: () => void
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items]
        const i = items.findIndex((x) => x.id === item.id)
        if (i >= 0) {
          items[i] = { ...items[i], quantity: items[i].quantity + qty }
        } else {
          items.push({ ...item, quantity: qty })
        }
        set({ items })
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      setQuantity: (id, qty) => {
        if (qty <= 0) return set({ items: get().items.filter((x) => x.id !== id) })
        set({ items: get().items.map((x) => (x.id === id ? { ...x, quantity: qty } : x)) })
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, x) => n + x.quantity, 0),
      subtotal: () => get().items.reduce((s, x) => s + x.price * x.quantity, 0),
    }),
    { name: 'restonext_cart' }
  )
)

export const TAX_RATE = 0.08 // 8%
export const calcTotals = (subtotal: number) => {
  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)
  return { tax, total }
}
