'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Scent } from './catalog'
export type { Scent } from './catalog'

type CartLine = { scent: Scent; quantity: number }
export type OrderRecord = {
  ref: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  items: CartLine[];
  total: number;
  receiptUrl?: string;
  receiptName?: string;
  createdAt: string;
  status: 'Waiting to confirm receipt' | 'Payment Verification' | 'Decant Pouring' | 'Out for Delivery' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';
  etaMinutes: number;
}

type Store = {
  cart: CartLine[];
  drawerOpen: boolean;
  orders: Record<string, OrderRecord>;
  add: (scent: Scent) => void;
  remove: (id: string) => void;
  setDrawer: (open: boolean) => void;
  clear: () => void;
  saveOrder: (order: OrderRecord) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      drawerOpen: false,
      orders: {},
      add: (scent) =>
        set((state) => ({
          cart: state.cart.some((l) => l.scent.id === scent.id)
            ? state.cart.map((l) =>
                l.scent.id === scent.id ? { ...l, quantity: l.quantity + 1 } : l
              )
            : [...state.cart, { scent, quantity: 1 }],
          drawerOpen: true,
        })),
      remove: (id) =>
        set((state) => ({
          cart: state.cart.flatMap((l) =>
            l.scent.id === id
              ? l.quantity > 1
                ? [{ ...l, quantity: l.quantity - 1 }]
                : []
              : [l]
          ),
        })),
      setDrawer: (drawerOpen) => set({ drawerOpen }),
      clear: () => set({ cart: [] }),
      saveOrder: (order) =>
        set((state) => ({
          orders: { ...state.orders, [order.ref]: order },
        })),
    }),
    {
      name: 'trendy-scents-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
      }),
    }
  )
)

export const cartCount = (cart: CartLine[]) => cart.reduce((sum, line) => sum + line.quantity, 0)
export const cartTotal = (cart: CartLine[]) => cart.reduce((sum, line) => sum + line.scent.price * line.quantity, 0)
export type { CartLine }

export default useStore

