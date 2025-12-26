// types.ts
export type ProductVariant = {
  id: string
  name: string
  price: number
}

export type ProductSponsor = {
  shopId: string
  shopName: string
  discountPercent: number
}

export type Product = {
  id: string
  name: string
  description: string
  image: string
  price: number
  rating: number
  unit?: string
  category: string
  isVeg?: boolean
  sponsor?: ProductSponsor
  variants?: ProductVariant[]
}
