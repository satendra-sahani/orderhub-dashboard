// src/pages/ProductDetail.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, Star, Truck, ShieldCheck, Heart, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL } from "@/components/config"
import { useCart } from "@/components/cart/CartContext"
import Header from "@/components/home/Header"
import type { Product } from "@/pages/Index"
import { useFavorites } from "@/hooks/useFavorites"

const API_BASE = API_BASE_URL || ""

interface ApiRelated {
  _id: string
  name: string
  category: string
  image: string
}

interface ApiProduct {
  _id: string
  name: string
  category: string
  description?: string
  image: string
  unit?: string
  isVeg?: boolean
  rating?: number
  price: number
  relatedProduct?: ApiRelated[]
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<ApiRelated[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, items } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  // header props (local search only, no fetch here)
  const [searchTerm, setSearchTerm] = useState("")
  const handleViewOrders = () => {}

  useEffect(() => {
    const fetchOne = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/products/${id}`)
        if (!res.ok) throw new Error(await res.text())
        const p: ApiProduct = await res.json()

        const mapped: Product = {
          id: p._id,
          name: p.name,
          category: p.category,
          description: p.description ?? "",
          price: p.price,
          image: p.image,
          rating: p.rating,
          isVeg: p.isVeg,
          unit: p.unit,
          variants: [],
          sponsor: undefined,
        }

        setProduct(mapped)
        setRelated(p.relatedProduct || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOne()
  }, [id])

  const inCartQty = useMemo(() => {
    if (!product) return 0
    return items
      .filter(i => i.productId === product.id)
      .reduce((sum, i) => sum + i.qty, 0)
  }, [items, product])

  if (loading || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading product...
      </div>
    )
  }

  const { name, image, description, price, rating, unit, category } =
    product

  const favActive = isFavorite(product.id)

  return (
    <div className="flex min-h-screen flex-col bg-muted/15">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onViewOrders={handleViewOrders}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-3 pb-16 pt-4 sm:px-4">
        {/* breadcrumb / back */}
        <div className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Link
            to="/"
            className="flex items-center gap-1 font-medium text-emerald-700"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to home
          </Link>
          <span className="mx-1">/</span>
          <span className="truncate">{category}</span>
        </div>

        {/* main row: aligned cards */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* left card */}
          <section className="flex-1 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-full flex-col gap-4 md:flex-row">
              {/* image */}
              <div className="flex w-full items-center justify-center rounded-2xl bg-muted p-4 md:w-1/2">
                <img
                  src={image}
                  alt={name}
                  className="h-64 w-full max-w-xs object-contain sm:h-72"
                />
              </div>

              {/* text */}
              <div className="flex flex-1 flex-col justify-center gap-3">
                <div className="space-y-1">
                  <h1 className="text-base font-semibold leading-snug sm:text-lg">
                    {name}
                  </h1>
                  <p className="text-[11px] text-muted-foreground">
                    {category} {unit ? `• ${unit}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{price}
                  </span>
                  {rating && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    Expected delivery: 15–20 minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Safe & secure checkout
                  </span>
                </div>

                {/* actions row: keep layout, add heart + in-cart state */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* favourite button, small and before main CTA */}
                  <Button
                    variant={favActive ? "default" : "outline"}
                    size="icon"
                    className={`h-9 w-9 ${
                      favActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : ""
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favActive ? "fill-current" : ""
                      }`}
                    />
                  </Button>

                  {/* main CTA: Add vs In cart, same styling */}
                  {inCartQty > 0 ? (
                    <Button
                      className="h-9 flex-1 bg-emerald-600 text-xs hover:bg-emerald-700 sm:flex-none sm:px-6"
                      variant="default"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      In cart ({inCartQty})
                    </Button>
                  ) : (
                    <Button
                      className="h-9 flex-1 bg-emerald-600 text-xs hover:bg-emerald-700 sm:flex-none sm:px-6"
                      onClick={() => addItem(product)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add to Cart
                    </Button>
                  )}

                  {/* existing Buy Now button unchanged */}
                  <Button
                    variant="outline"
                    className="h-9 flex-1 text-xs sm:flex-none sm:px-4"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* right green card */}
          <aside className="w-full rounded-2xl bg-emerald-600 p-4 text-white shadow-sm lg:w-80 lg:self-stretch">
            <div className="flex h-full flex-col justify-center gap-2">
              <div>
                <p className="text-sm font-semibold">
                  15–20 min doorstep delivery
                </p>
                <p className="mt-1 text-xs text-emerald-50">
                  Personal care essentials delivered fast with secure
                  packaging.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-emerald-50/90">
                <Badge className="bg-emerald-500 text-[10px]">
                  Easy returns
                </Badge>
                <Badge className="bg-emerald-500 text-[10px]">
                  Genuine products
                </Badge>
              </div>
            </div>
          </aside>
        </div>

        {/* related items */}
        {related.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Related items
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Customers also viewed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {related.map(item => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="group flex flex-col rounded-xl border bg-card p-2 text-xs shadow-sm transition hover:border-emerald-500"
                >
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform duration-150 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {item.category}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default ProductDetail
