// src/components/cart/CartContext.tsx (web)

"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react"
import type { Product } from "../products/types"

const API_BASE = "https://orderhai-be.vercel.app"

type CartItem = {
  id: string
  productId: string
  name: string
  variantName: string
  price: number
  qty: number
  image?: string
}

type Order = {
  id: string
  createdAt: string
  items: CartItem[]
  total: number
  paymentMethod: "COD" | "ONLINE"
  address: string
  status: "pending" | "confirmed" | "delivered" | "cancelled",
  location?: { lat: number; lng: number }
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, variantId?: string) => Promise<void> | void
  updateQty: (id: string, qty: number) => Promise<void> | void
  removeItem: (id: string) => Promise<void> | void
  clear: () => Promise<void> | void
  subtotal: number
  deliveryFee: number
  total: number
  appliedCoupon: string | null
  applyCoupon: (code: string) => boolean
  orders: Order[]
  placeOrder: (params: {
    paymentMethod: "COD" | "ONLINE"
    address: string
    phone: string
    name?: string
    notes?: string,
    location?: { lat: number; lng: number }
  }) => Promise<Order | null>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const DELIVERY_FEE = 5

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  // HYDRATE CART ON MOUNT
  useEffect(() => {
    const token = getToken()
    if (!token) return

    const loadCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) return
        const data = await res.json()
        const mapped: CartItem[] =
          (data.items || []).map((it: any) => ({
            id: `${it.product}-${it.variantName || "default"}`,
            productId:
              typeof it.product === "string"
                ? it.product
                : it.product?._id,
            name: it.name,
            variantName: it.variantName || "Regular",
            price: it.price,
            qty: it.qty,
            image: it.image,
          })) ?? []
        setItems(mapped)
      } catch {
        // ignore
      }
    }

    loadCart()
  }, [])

  // ADD
  const addItem = async (product: Product, variantId?: string) => {
    const variants =
      product.variants && product.variants.length > 0
        ? product.variants
        : [
            {
              id: product.id,
              name: "Regular",
              price: product.price,
            },
          ]

    const selectedVariant =
      variants.find(v => v.id === variantId) ?? variants[0]

    const basePrice = selectedVariant.price
    const finalPrice = product.sponsor
      ? Math.round(
          basePrice * (1 - product.sponsor.discountPercent / 100),
        )
      : basePrice

    const cartId = `${product.id}-${selectedVariant.id}`

    // optimistic local update
    setItems(prev => {
      const existing = prev.find(i => i.id === cartId)
      if (existing) {
        return prev.map(i =>
          i.id === cartId ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [
        ...prev,
        {
          id: cartId,
          productId: product.id,
          name: product.name,
          variantName: selectedVariant.name,
          price: finalPrice,
          qty: 1,
          image: product.image,
        },
      ]
    })

    const token = getToken()
    if (!token) return

    try {
      await fetch(`${API_BASE}/api/users/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          qty: 1,
          variantName: selectedVariant.name,
        }),
      })
    } catch {
      // ignore
    }
  }

  // UPDATE QTY
  const updateQty = async (id: string, qty: number) => {
    let target: CartItem | undefined

    setItems(prev => {
      const found = prev.find(i => i.id === id)
      target = found
      if (qty <= 0) {
        return prev.filter(i => i.id !== id)
      }
      return prev.map(i => (i.id === id ? { ...i, qty } : i))
    })

    const token = getToken()
    if (!token || !target) return

    try {
      await fetch(
        `${API_BASE}/api/users/cart/${target.productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qty,
            variantName: target.variantName,
          }),
        },
      )
    } catch {
      // ignore
    }
  }

  // REMOVE
  const removeItem = async (id: string) => {
    let target: CartItem | undefined

    setItems(prev => {
      target = prev.find(i => i.id === id)
      return prev.filter(i => i.id !== id)
    })

    const token = getToken()
    if (!token || !target) return

    try {
      await fetch(
        `${API_BASE}/api/users/cart/${target.productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            variantName: target.variantName,
          }),
        },
      )
    } catch {
      // ignore
    }
  }

  // CLEAR
  const clear = async () => {
    setItems([])

    const token = getToken()
    if (!token) return

    try {
      await fetch(`${API_BASE}/api/users/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      // ignore
    }
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  )

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0
  const totalBeforeCoupon = subtotal + deliveryFee

  const total = useMemo(() => {
    if (!appliedCoupon) return totalBeforeCoupon
    if (appliedCoupon === "ORDERHAI50") {
      return Math.max(0, totalBeforeCoupon - 50)
    }
    return totalBeforeCoupon
  }, [appliedCoupon, totalBeforeCoupon])

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase()
    if (normalized === "ORDERHAI50") {
      setAppliedCoupon(normalized)
      return true
    }
    return false
  }

  const placeOrder: CartContextType["placeOrder"] = async ({
    paymentMethod,
    address,
    phone,
    name,
    notes,
    location,
  }) => {
    if (items.length === 0) return null

    const token = getToken()

    const backendItems = items.map(i => ({
      product: i.productId, // mongoose expects "product"
      name: i.name,
      variantName: i.variantName,
      price: i.price,
      qty: i.qty,
    }))

    try {
      const res = await fetch(`${API_BASE}/api/users/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: backendItems,
          paymentMethod,
          address,
          phone,
          name,
          notes,
          location,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order")
      }

      const newOrder: Order = {
        id: data.id || data._id,
        createdAt: data.createdAt,
        items,
        total,
        paymentMethod,
        address,
        location,
        status:
          (data.status as
            | "pending"
            | "confirmed"
            | "delivered"
            | "cancelled") || "pending",
      }

      setOrders(prev => [newOrder, ...prev])
      await clear()
      setAppliedCoupon(null)

      return newOrder
    } catch (e) {
      console.error(e)
      return null
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clear,
        subtotal,
        deliveryFee,
        total,
        appliedCoupon,
        applyCoupon,
        orders,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
