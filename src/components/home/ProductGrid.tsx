// src/components/home/ProductGrid.tsx
"use client"

import type { Product } from "@/pages/Index"
import ProductCardCompact from "./ProductCardCompact"
import { useCart } from "@/components/cart/CartContext"

interface ProductGridProps {
  products: Product[]
  onAddProduct: (product: Product) => void
}

const ProductGrid = ({ products, onAddProduct }: ProductGridProps) => {
  const { addItem } = useCart()

  if (products.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No products found.
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 px-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map(product => (
        <ProductCardCompact
          key={product.id}
          product={product}
          onCustomize={onAddProduct}
          onQuickAdd={() => addItem(product)}
        />
      ))}
    </div>
  )
}

export default ProductGrid
