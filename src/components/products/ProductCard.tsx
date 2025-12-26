// ProductCard.tsx (web)
"use client"

import React from "react"
// import { Card, CardContent } from "@/components/ui/card" // adjust import or use div
import { Heart, ShoppingCart, ArrowRight } from "lucide-react"
// import { products } from "../products"
import type { Product } from "../products/types"
import { cn } from "@/lib/utils" // or your own classnames helper

type Props = {
  product: Product
  onAddToCart: () => void
  onOrderNow: () => void
  isFavourite: boolean
  onToggleFavourite: () => void
  onOpenDetail?: () => void
}

export const ProductCard: React.FC<Props> = ({
  product,
  onAddToCart,
  onOrderNow,
  isFavourite,
  onToggleFavourite,
  onOpenDetail,
}) => {
  const basePrice =
    product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : product.price

  const discountedPrice = product.sponsor
    ? Math.round(basePrice * (1 - product.sponsor.discountPercent / 100))
    : basePrice

  return (
    <div className="group relative flex flex-col rounded-xl border bg-white shadow-sm">
      <button
        type="button"
        onClick={onOpenDetail}
        className="relative h-40 w-full overflow-hidden rounded-t-xl"
      >
        <img
          src={product.image}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          alt={product.name}
        />
        {product.sponsor && (
          <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
            {product.sponsor.discountPercent}% OFF
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={onToggleFavourite}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
      >
        <Heart
          size={18}
          className={cn(
            "transition-colors",
            isFavourite ? "fill-red-500 text-red-500" : "text-gray-500",
          )}
        />
      </button>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2">
        <button
          type="button"
          onClick={onOpenDetail}
          className="text-left text-sm font-semibold text-gray-900 line-clamp-1"
        >
          {product.name}
        </button>

        {product.unit && (
          <p className="text-[11px] text-gray-500">{product.unit}</p>
        )}

        <div className="mt-1 flex items-center justify-between gap-2">
          <div>
            {product.sponsor ? (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">
                  ₹{discountedPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{basePrice}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                ₹{basePrice}
              </span>
            )}
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
              ⭐ {product.rating}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={onOrderNow}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
        >
          Order Now
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
