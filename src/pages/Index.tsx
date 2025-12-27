// src/pages/Index.tsx
"use client"

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react"

import Header from "@/components/home/Header"
import CategoryBar from "@/components/home/CategoryBar"
import ProductGrid from "@/components/home/ProductGrid"
import MyOrdersSheet from "@/components/auth/MyOrdersSheet"
import { API_BASE_URL } from "@/components/config"
import Footer from "@/components/home/Footer"

const API_BASE = API_BASE_URL || ""

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  rating?: number
  isVeg?: boolean
  unit?: string
  variants?: { id: string; name: string; price: number }[]
  sponsor?: {
    shopId: string
    shopName: string
    discountPercent: number
    area: string
  }
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] =
    useState<string>("All")
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/products`)
      if (!res.ok) throw new Error(await res.text())
      const raw = await res.json()

      const mapped: Product[] = raw.map((p: any) => ({
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

      const cats = Array.from(
        new Set(
          mapped
            .map(p => p.category)
            .filter((c: string | undefined) => !!c),
        ),
      ) as string[]
      setCategories(["All", ...cats])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Filter only by search; category grouping handled below
  const searchFiltered = useMemo(() => {
    const q = searchTerm.toLowerCase()
    if (!q) return products
    return products.filter(product => {
      const inName = product.name.toLowerCase().includes(q)
      const inDesc = (product.description || "")
        .toLowerCase()
        .includes(q)
      return inName || inDesc
    })
  }, [products, searchTerm])

  // Group products by category for Blinkit-style sections
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of searchFiltered) {
      const cat = p.category || "Others"
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(p)
    }
    return map
  }, [searchFiltered])

  const handleViewOrders = () => setIsOrdersOpen(true)

  const handleCategoryChange = (name: string) => {
    setActiveCategory(name)
  }

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onViewOrders={handleViewOrders}
      />

      <main className="mx-auto mt-2 max-w-5xl px-3 pb-16 sm:px-4">
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Loading products...
          </p>
        ) : searchFiltered.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No products found.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {/* If a specific category is selected (not All), show only that section */}
            {(activeCategory === "All"
              ? categories.filter(c => c !== "All")
              : [activeCategory]
            ).map(catName => {
              const items = productsByCategory.get(catName) || []
              if (!items.length) return null

              // up to 8–10 items depending on screen; here we cap at 10
              const visible = items.slice(0, 10)
              const hasMore = items.length > visible.length

              return (
                <section key={catName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold sm:text-base">
                      {catName}
                    </h2>
                    {hasMore && (
                      <button
                        type="button"
                        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                        onClick={() => setActiveCategory(catName)}
                      >
                        See more
                      </button>
                    )}
                  </div>

                  <ProductGrid
                    products={visible}
                    onAddProduct={() => {}}
                  />
                </section>
              )
            })}
          </div>
        )}

        <MyOrdersSheet
          open={isOrdersOpen}
          onOpenChange={setIsOrdersOpen}
        />
      </main>
      <Footer />
    </>
  )
}

export default Index
