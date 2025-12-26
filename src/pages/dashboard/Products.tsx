// Products.tsx – compact premium admin view with fixed stats row
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import StatCard from "@/components/dashboard/StatCard"
import {
  Package,
  Store,
  Percent,
  Search,
  MapPin,
  CheckCircle,
  Plus,
  Edit,
} from "lucide-react"
import { toast } from "sonner"
import { API_BASE_URL } from "@/components/config"

const API_BASE = API_BASE_URL

interface Product {
  _id: string
  name: string
  category: string
  description?: string
  details?: string
  price?: number
  sellingPrice?: number
  shopPrice?: number
  marginPercent?: number
  image: string
  rating: number
  isVeg?: boolean
  unit?: string
  inStock: boolean
  sponsor?: {
    shopId: string
    shopName: string
    discountPercent: number
    area: string
  }
}

interface Shop {
  _id: string
  name: string
  area: string
}

const Products = () => {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedSponsorProductId, setSelectedSponsorProductId] =
    useState<string | null>(null)

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    description: "",
    shopPrice: "",
    marginPercent: "20",
    image: "",
    rating: "4.5",
    unit: "",
    isVeg: true,
    inStock: true,
  })

  const [sponsorForm, setSponsorForm] = useState({
    shopId: "",
    discountPercent: "10",
    area: "",
  })

  // fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const url = new URL("/api/admin/products", API_BASE)
      if (searchTerm) url.searchParams.set("search", searchTerm)

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) throw new Error(await response.text())
      const data: Product[] = await response.json()
      setProductsList(data)
    } catch (error) {
      console.error("Fetch products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  // fetch shops
  const fetchShops = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/api/admin/shops`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (response.ok) {
        const data = await response.json()
        setShops(
          data.map((shop: any) => ({
            _id: shop._id,
            name: shop.name,
            area: shop.address?.city || shop.address?.line1 || "N/A",
          })),
        )
      }
    } catch (error) {
      console.error("Fetch shops:", error)
    }
  }, [])

  // toggle stock
  const toggleStock = async (productId: string, currentStock: boolean) => {
    try {
      setProductsList(prev =>
        prev.map(p => (p._id === productId ? { ...p, inStock: !currentStock } : p)),
      )

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inStock: !currentStock }),
      })

      if (!response.ok) {
        setProductsList(prev =>
          prev.map(p => (p._id === productId ? { ...p, inStock: currentStock } : p)),
        )
        throw new Error(await response.text())
      }

      toast.success(!currentStock ? "Product activated" : "Product deactivated")
    } catch (error) {
      console.error("Toggle error:", error)
      toast.error("Failed to update stock")
    }
  }

  const openEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description || "",
      shopPrice: product.shopPrice?.toString() || "",
      marginPercent: product.marginPercent?.toString() || "20",
      image: product.image,
      rating: product.rating.toString(),
      unit: product.unit || "",
      isVeg: product.isVeg ?? true,
      inStock: product.inStock,
    })
    setSelectedProductId(product._id)
    setIsProductDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.category || !productForm.shopPrice) {
      toast.error("Name, category, and price are required")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const body = {
        name: productForm.name.trim(),
        category: productForm.category.trim(),
        description: productForm.description.trim(),
        shopPrice: Number(productForm.shopPrice),
        marginPercent: Number(productForm.marginPercent),
        image: productForm.image.trim(),
        rating: Number(productForm.rating),
        unit: productForm.unit.trim(),
        isVeg: productForm.isVeg,
        inStock: productForm.inStock,
      }

      const url = selectedProductId
        ? `${API_BASE}/api/admin/products/${selectedProductId}`
        : `${API_BASE}/api/admin/products`
      const method = selectedProductId ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(selectedProductId ? "Product updated!" : "Product created!")
        setIsProductDialogOpen(false)
        setSelectedProductId(null)
        setProductForm({
          name: "",
          category: "",
          description: "",
          shopPrice: "",
          marginPercent: "20",
          image: "",
          rating: "4.5",
          unit: "",
          isVeg: true,
          inStock: true,
        })
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to save product")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const openSponsorDialog = (productId: string) => {
    const product = productsList.find(p => p._id === productId)
    if (product) {
      setSponsorForm({
        shopId: product.sponsor?.shopId || "",
        discountPercent: product.sponsor?.discountPercent?.toString() || "10",
        area: product.sponsor?.area || "",
      })
      setSelectedSponsorProductId(productId)
      setIsSponsorDialogOpen(true)
    }
  }

  const handleAssignSponsor = async () => {
    if (!selectedSponsorProductId || !sponsorForm.shopId) {
      toast.error("Please select shop")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${API_BASE}/api/admin/products/${selectedSponsorProductId}/sponsor`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token!}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sponsorForm),
        },
      )

      if (response.ok) {
        toast.success("Sponsor updated!")
        setIsSponsorDialogOpen(false)
        setSelectedSponsorProductId(null)
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update sponsor")
      }
    } catch (error) {
      toast.error("Network error")
    }
  }

  const handleRemoveSponsor = async (productId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}/sponsor`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token!}` },
      })

      if (response.ok) {
        toast.success("Sponsor removed")
        fetchProducts()
      }
    } catch (error) {
      toast.error("Failed to remove sponsor")
    }
  }

  // initial load – only once
  useEffect(() => {
    fetchShops()
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // debounce search – only when searchTerm changes and not empty
  useEffect(() => {
    if (!searchTerm) return

    const timeout = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchTerm, fetchProducts])

  const filteredProducts = productsList.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: productsList.length,
    sponsored: productsList.filter(p => p.sponsor).length,
    inStock: productsList.filter(p => p.inStock).length,
    avgDiscount: Math.round(
      productsList
        .filter(p => p.sponsor)
        .reduce((sum, p) => sum + (p.sponsor?.discountPercent || 0), 0) /
        (productsList.filter(p => p.sponsor).length || 1),
    ),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading products...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Product Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage {stats.total} premium products • {stats.sponsored} sponsored
          </p>
        </div>

        <Dialog
          open={isProductDialogOpen}
          onOpenChange={open => {
            setIsProductDialogOpen(open)
            if (!open) {
              setSelectedProductId(null)
              setProductForm({
                name: "",
                category: "",
                description: "",
                shopPrice: "",
                marginPercent: "20",
                image: "",
                rating: "4.5",
                unit: "",
                isVeg: true,
                inStock: true,
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-11 px-6 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          {/* dialog (unchanged except compact heights) */}
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProductId ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={productForm.name}
                  onChange={e =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  placeholder="Hand Wash"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={productForm.category}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      category: e.target.value,
                    })
                  }
                  placeholder="Personal Care"
                  className="h-10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input
                  value={productForm.description}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Quality hand wash"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Shop Price (₹) *</Label>
                <Input
                  type="number"
                  value={productForm.shopPrice}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      shopPrice: e.target.value,
                    })
                  }
                  placeholder="114"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Margin %</Label>
                <Input
                  type="number"
                  value={productForm.marginPercent}
                  onChange={e =>
                    setProductForm({
                      ...productForm,
                      marginPercent: e.target.value,
                    })
                  }
                  placeholder="25"
                  className="h-10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Image URL</Label>
                <Input
                  value={productForm.image}
                  onChange={e =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={productForm.rating}
                  onChange={e =>
                    setProductForm({ ...productForm, rating: e.target.value })
                  }
                  placeholder="4.4"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={productForm.unit}
                  onChange={e =>
                    setProductForm({ ...productForm, unit: e.target.value })
                  }
                  placeholder="1 pack"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.isVeg}
                    onChange={e =>
                      setProductForm({
                        ...productForm,
                        isVeg: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border"
                  />
                  Vegetarian
                </Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <Switch
                    checked={productForm.inStock}
                    onCheckedChange={checked =>
                      setProductForm({
                        ...productForm,
                        inStock: checked,
                      })
                    }
                  />
                  In Stock
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Button className="flex-1 h-10" onClick={handleSaveProduct}>
                {selectedProductId ? "Update Product" : "Create Product"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10"
                onClick={() => {
                  setIsProductDialogOpen(false)
                  setSelectedProductId(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* stats + search row – fixed alignment */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* stats boxes */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-xl">
          <StatCard
            title="Total Products"
            value={stats.total}
            icon={Package}
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="Sponsored"
            value={stats.sponsored}
            icon={Store}
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="In Stock"
            value={stats.inStock}
            icon={CheckCircle}
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="Avg Discount"
            value={`${stats.avgDiscount}%`}
            icon={Percent}
            className="rounded-2xl border bg-card shadow-sm"
          />
        </div>

        {/* search right aligned */}
        <div className="w-full max-w-xs lg:max-w-sm lg:self-end relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-11 rounded-full"
          />
        </div>
      </div>

      {/* product grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredProducts.map(product => {
          const selling =
            product.sellingPrice ?? product.price ?? product.shopPrice ?? 0

          return (
            <div
              key={product._id}
              className="group border rounded-2xl p-3 hover:shadow-md transition-all bg-card overflow-hidden"
            >
              {product.sponsor && (
                <div className="mb-2 p-2 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Store className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {product.sponsor.shopName}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[11px] px-1.5">
                      {product.sponsor.discountPercent}% OFF
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {product.sponsor.area}
                  </div>
                </div>
              )}

              {/* image */}
              <div className="relative mb-2 h-28">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg bg-muted/40"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => openEditProduct(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {/* info + pricing */}
              <div className="space-y-1 mb-2">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-muted-foreground capitalize">
                  {product.category} {product.unit && `• ${product.unit}`}
                </p>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-semibold text-foreground">
                      ₹{selling}
                    </span>
                    {product.shopPrice && product.sellingPrice && (
                      <span className="text-[11px] text-muted-foreground">
                        (Cost ₹{product.shopPrice})
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    {typeof product.shopPrice === "number" && (
                      <span className="px-1.5 py-0.5 rounded-full bg-muted">
                        Shop ₹{product.shopPrice}
                      </span>
                    )}
                    {typeof product.marginPercent === "number" && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        Margin {product.marginPercent}%
                      </span>
                    )}
                    {typeof product.sellingPrice === "number" && (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary/5 text-primary">
                        Sell ₹{product.sellingPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* stock strip */}
              <div className="flex items-center justify-between mb-2 px-2 py-1.5 bg-muted/60 rounded-lg">
                <span className="text-[11px] font-medium flex items-center gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      product.inStock ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <Switch
                  checked={product.inStock}
                  onCheckedChange={() =>
                    toggleStock(product._id, product.inStock)
                  }
                  className="scale-90 origin-right"
                />
              </div>

              {/* actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant={product.sponsor ? "outline" : "default"}
                  className="flex-1 h-9 text-[11px] font-medium"
                  onClick={() => openSponsorDialog(product._id)}
                >
                  Sponsor
                </Button>

                {product.sponsor && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-9 px-3 text-[11px]"
                    onClick={() => handleRemoveSponsor(product._id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* sponsor dialog */}
      <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSponsorProductId &&
              productsList.find(p => p._id === selectedSponsorProductId)
                ?.sponsor
                ? "Edit Sponsor"
                : "Add Sponsor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <Label>Shop</Label>
              <Select
                value={sponsorForm.shopId}
                onValueChange={v => {
                  const shop = shops.find(s => s._id === v)
                  setSponsorForm({
                    ...sponsorForm,
                    shopId: v,
                    area: shop?.area || "",
                  })
                }}
              >
                <SelectTrigger className="h-10" />
                <SelectContent>
                  {shops.map(shop => (
                    <SelectItem key={shop._id} value={shop._id}>
                      {shop.name} • {shop.area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount %</Label>
              <Select
                value={sponsorForm.discountPercent}
                onValueChange={v =>
                  setSponsorForm({ ...sponsorForm, discountPercent: v })
                }
              >
                <SelectTrigger className="h-10" />
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map(p => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}% OFF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Area</Label>
              <Input
                value={sponsorForm.area}
                onChange={e =>
                  setSponsorForm({ ...sponsorForm, area: e.target.value })
                }
                placeholder="North Village"
                className="h-10"
              />
            </div>

            <Button className="w-full h-10" onClick={handleAssignSponsor}>
              {selectedSponsorProductId &&
              productsList.find(p => p._id === selectedSponsorProductId)
                ?.sponsor
                ? "Update Sponsor"
                : "Assign Sponsor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search
          </p>
          <Button onClick={() => setIsProductDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first product
          </Button>
        </div>
      )}
    </div>
  )
}

export default Products
