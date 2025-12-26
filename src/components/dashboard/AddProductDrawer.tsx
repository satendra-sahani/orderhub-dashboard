"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Product } from "@/data/products"

export type UnitType = "pcs" | "kg" | "g" | "litre" | "ml"

export interface EditableProduct
  extends Omit<Product, "id" | "sponsor" | "variants"> {
  id?: string
  category: string
  baseUnit: UnitType
  baseQuantity: number
  marginPercent: number
  mrp: number
  offerPrice: number
}

interface AddProductDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: EditableProduct) => void
  categories: string[]
  initialProduct?: EditableProduct | null
}

const EMPTY: EditableProduct = {
  name: "",
  description: "",
  image: "",
  price: 0,
  rating: 4.5,
  isVeg: true,
  category: "",
  baseUnit: "pcs",
  baseQuantity: 1,
  marginPercent: 20,
  mrp: 0,
  offerPrice: 0,
}

const AddProductDrawer = ({
  open,
  onOpenChange,
  onSave,
  categories,
  initialProduct,
}: AddProductDrawerProps) => {
  const [form, setForm] = useState<EditableProduct>(EMPTY)

  useEffect(() => {
    if (open) {
      setForm(initialProduct ?? EMPTY)
    }
  }, [open, initialProduct])

  const update = <K extends keyof EditableProduct>(
    key: K,
    value: EditableProduct[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleAutoPrice = () => {
    if (!form.mrp || !form.marginPercent) return
    const basePrice = Math.round(
      form.mrp * (1 - form.marginPercent / 100),
    )
    setForm((prev) => ({
      ...prev,
      price: basePrice,
      offerPrice: basePrice,
    }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required")
      return
    }
    if (!form.category.trim()) {
      toast.error("Category is required")
      return
    }
    if (!form.image.trim()) {
      toast.error("Image URL is required")
      return
    }
    if (!form.offerPrice || form.offerPrice <= 0) {
      toast.error("Enter a valid price")
      return
    }

    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      image: form.image.trim(),
    })
    toast.success(
      initialProduct ? "Product updated" : "Product added",
    )
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {initialProduct ? "Edit Product" : "Add Product"}
          </SheetTitle>
          <SheetDescription>
            Fill basic details, pricing, unit and rating. Keep it simple
            for shop owners.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex h-[calc(100vh-6rem)] flex-col gap-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-sm">
            {/* BASIC */}
            <div className="space-y-3 rounded-lg border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Basic info
              </p>

              <div className="space-y-1.5">
                <Label>Product name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Amul Taaza Milk"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category || undefined}
                  onValueChange={(value) => update("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    update("description", e.target.value)
                  }
                  placeholder="Short description for users"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        form.isVeg ? "default" : "outline"
                      }
                      onClick={() => update("isVeg", true)}
                    >
                      Veg
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        !form.isVeg ? "default" : "outline"
                      }
                      onClick={() => update("isVeg", false)}
                    >
                      Non‑veg
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[form.rating]}
                      min={1}
                      max={5}
                      step={0.1}
                      onValueChange={([v]) =>
                        update("rating", Number(v.toFixed(1)))
                      }
                      className="w-32"
                    />
                    <span className="text-sm font-semibold">
                      {form.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIT & PACK */}
            <div className="space-y-3 rounded-lg border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Unit & pack
              </p>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.baseQuantity}
                    onChange={(e) =>
                      update(
                        "baseQuantity",
                        Number(e.target.value) || 0,
                      )
                    }
                    placeholder="e.g. 1, 500"
                  />
                </div>
                <div className="w-36 space-y-1.5">
                  <Label>Unit</Label>
                  <Select
                    value={form.baseUnit}
                    onValueChange={(v: UnitType) =>
                      update("baseUnit", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="g">Gram</SelectItem>
                      <SelectItem value="litre">Litre</SelectItem>
                      <SelectItem value="ml">ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className="space-y-3 rounded-lg border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Pricing & margin
              </p>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.mrp}
                    onChange={(e) =>
                      update("mrp", Number(e.target.value) || 0)
                    }
                    placeholder="Printed MRP"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label>Margin (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={80}
                    value={form.marginPercent}
                    onChange={(e) =>
                      update(
                        "marginPercent",
                        Number(e.target.value) || 0,
                      )
                    }
                    placeholder="e.g. 20"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoPrice}
              >
                Auto‑calculate price from MRP
              </Button>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label>Sell price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.offerPrice || form.price}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0
                      update("offerPrice", v)
                      update("price", v)
                    }}
                    placeholder="What user pays"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label>Off price (optional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      update("price", Number(e.target.value) || 0)
                    }
                    placeholder="Strike‑through price"
                  />
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="space-y-3 rounded-lg border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Image
              </p>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {form.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={form.image}
                    alt={form.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <span className="text-xs text-muted-foreground">
                    Preview
                  </span>
                </div>
              )}
            </div>

            {/* VISIBILITY */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div>
                <p className="text-sm font-medium">Show on app</p>
                <p className="text-xs text-muted-foreground">
                  Disable if out of stock or seasonal.
                </p>
              </div>
              <Switch
                checked={Boolean((form as any).isActive ?? true)}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    // optional flag, ignored by existing UI if not used
                    isActive: checked,
                  }) as any)
                }
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="border-t pt-2">
            <Button className="w-full" onClick={handleSubmit}>
              {initialProduct ? "Save changes" : "Add product"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddProductDrawer
