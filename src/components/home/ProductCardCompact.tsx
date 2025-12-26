// src/components/home/ProductCardCompact.tsx
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Minus,
  Star,
  Store,
  Percent,
  Loader2,
  Heart,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Product } from "@/pages/Index"
import { useFavorites } from "@/hooks/useFavorites"
import { useCart } from "@/components/cart/CartContext"

interface ProductCardCompactProps {
  product: Product
  onCustomize: (product: Product) => void
  onQuickAdd: (product: Product) => void
}

const ProductCardCompact = ({
  product,
  onCustomize,
}: ProductCardCompactProps) => {
  const navigate = useNavigate()
  const [isNavigating, setIsNavigating] = useState(false)

  const {
    id,
    name,
    price,
    image,
    description,
    rating,
    isVeg,
    variants,
    sponsor,
    unit,
    category,
  } = product

  const basePrice =
    variants && variants.length > 0
      ? Math.min(...variants.map(v => v.price))
      : price

  const discountedPrice = sponsor
    ? Math.round(
        basePrice * (1 - sponsor.discountPercent / 100),
      )
    : basePrice

  const isSponsored = !!sponsor

  // favourites
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(product.id)

  // cart integration
  const { items, addItem, updateQty, removeItem } = useCart()

  const cartEntry = useMemo(
    () => items.find(i => i.productId === product.id),
    [items, product.id],
  )
  const qty = cartEntry?.qty ?? 0

  const goToDetail = () => {
    if (isNavigating) return
    setIsNavigating(true)
    navigate(`/product/${id}`)
  }

  const handleAdd = () => {
    addItem(product)
  }

  const handleDecrease = () => {
    if (!cartEntry) return
    if (cartEntry.qty <= 1) {
      removeItem(cartEntry.id)
    } else {
      updateQty(cartEntry.id, cartEntry.qty - 1)
    }
  }

  const handleIncrease = () => {
    if (!cartEntry) {
      addItem(product)
    } else {
      updateQty(cartEntry.id, cartEntry.qty + 1)
    }
  }

  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-muted-foreground/15 bg-white p-2 shadow-[0_2px_6px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
      {/* Top row: fav + image */}
      <div className="flex items-start justify-between">
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className="rounded-full border border-muted-foreground/20 bg-white/90 p-1 shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${
              fav ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={goToDetail}
          className="relative flex flex-1 items-center justify-center"
        >
          {isSponsored && (
            <Badge className="absolute right-1 top-1 flex items-center gap-1 bg-emerald-600 px-1.5 py-0.5 text-[9px]">
              <Percent className="h-3 w-3" />
              Sponsored
            </Badge>
          )}

          <img
            src={image}
            alt={name}
            className="h-20 w-auto object-contain sm:h-24"
          />

          {isNavigating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </button>
      </div>

      {/* Name & meta */}
      <div className="mt-1 flex-1 space-y-0.5">
        <p className="line-clamp-2 text-xs font-semibold sm:text-sm">
          {name}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {category} {unit ? `• ${unit}` : ""}
        </p>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          {typeof rating === "number" && rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
              {rating.toFixed(1)}
            </span>
          )}

          {isVeg !== undefined && (
            <span className="ml-auto flex items-center gap-1">
              <span
                className={`inline-flex h-3 w-3 items-center justify-center rounded-[3px] border ${
                  isVeg ? "border-emerald-600" : "border-red-600"
                }`}
              >
                <span
                  className={`block h-2 w-2 rounded-[2px] ${
                    isVeg ? "bg-emerald-600" : "bg-red-600"
                  }`}
                />
              </span>
              <span className="text-[10px]">
                {isVeg ? "VEG" : "NON-VEG"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Price + Add / qty */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            ₹{discountedPrice}
          </span>
          {discountedPrice !== basePrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              ₹{basePrice}
            </span>
          )}
        </div>

        {qty === 0 ? (
          <Button
            type="button"
            size="sm"
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px]"
            onClick={handleAdd}
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-1 rounded-full border px-2 py-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-xs font-semibold">
              {qty}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Order now -> detail */}
      <Button
        type="button"
        size="sm"
        className="mt-2 w-full rounded-full bg-emerald-600 text-[11px] hover:bg-emerald-700"
        onClick={goToDetail}
      >
        Order now
      </Button>

      {description && (
        <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Store className="h-3 w-3" />
        <span>Delivered by order hai in 10–15 mins</span>
      </div>
    </div>
  )
}

export default ProductCardCompact
