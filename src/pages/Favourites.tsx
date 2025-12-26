// src/pages/Favourites.tsx
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/home/Header"
import ProductGrid from "@/components/home/ProductGrid"
import { API_BASE_URL } from "@/components/config"
import type { Product } from "./Index"
import { toast } from "sonner"

const API_BASE = API_BASE_URL || "https://orderhai-be.vercel.app"

const Favourites = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const navigate = useNavigate()

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  useEffect(() => {
    const loadFavorites = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(
          `${API_BASE}/api/users/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Failed to load favourites")
          setLoading(false)
          return
        }

        const mapped: Product[] = (data || []).map((p: any) => ({
          id: p._id,
          name: p.name,
          category: p.category,
          description: p.description ?? "",
          price: p.sellingPrice ?? p.price ?? 0,
          image: p.image,
          rating: p.rating,
          isVeg: p.isVeg,
          unit: p.unit,
          variants: p.variants?.map((v: any) => ({
            id: v._id ?? v.id,
            name: v.name ?? v.label ?? "Regular",
            price: v.price,
          })),
          sponsor: p.sponsor
            ? {
                shopId: p.sponsor.shopId,
                shopName: p.sponsor.shopName,
                discountPercent: p.sponsor.discountPercent,
                area: p.sponsor.area,
              }
            : undefined,
        }))

        setProducts(mapped)
      } catch {
        toast.error("Network error while loading favourites")
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [token])

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    )
  })

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onViewOrders={() => setIsOrdersOpen(true)}
      />

      <main className="mx-auto mt-2 max-w-5xl px-3 pb-16 sm:px-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-base font-semibold sm:text-lg">
            Favourites
          </h1>
          <button
            className="text-xs text-primary underline"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-muted-foreground">
            Loading favourites...
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            No favourites yet. Tap the heart on a product to save
            it here.
          </p>
        ) : (
          <ProductGrid
            products={filtered}
            onAddProduct={() => {}}
          />
        )}
      </main>
    </>
  )
}

export default Favourites
