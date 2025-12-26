// src/pages/Shops.tsx
"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
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
import { Label } from "@/components/ui/label"
import StatCard from "@/components/dashboard/StatCard"
import {
  Store,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  Plus,
  MapPin,
  Phone,
  Boxes,
  Crosshair,
  Edit,
} from "lucide-react"
import { toast } from "sonner"
import { API_BASE_URL } from "@/components/config"

const API_BASE = API_BASE_URL

// ---------- Types ----------

interface ApiShopProduct {
  productId: string
  name: string
  category: string
  sellingPrice: number
  image: string
  unit: string
}

interface ApiShop {
  _id: string
  name: string
  ownerName: string
  phone: string
  isActive: boolean
  tags: string[]
  products?: ApiShopProduct[]
  address: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
    latitude?: number
    longitude?: number
  }
}

interface Shop {
  id: string
  name: string
  owner: string
  phone: string
  address: string
  isActive: boolean
  ordersToday: number
  totalOrders: number
  specialties: string[]
  latitude?: number
  longitude?: number
  products: ApiShopProduct[]
}

interface Product {
  _id: string
  name: string
  category: string
  price?: number
  sellingPrice?: number
  shopPrice?: number
  image: string
}

// ---------- Component ----------

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingShopId, setEditingShopId] = useState<string | null>(null)

  const [newShop, setNewShop] = useState({
    name: "",
    owner: "",
    phone: "",
    address: "",
    specialties: "",
    latitude: "",
    longitude: "",
    productSearch: "",
    selectedProductIds: [] as string[],
  })

  // ---------- Mappers & fetchers ----------

  const mapApiShop = (s: ApiShop): Shop => {
    const addr = s.address || {}
    const displayAddress =
      addr.line1 ||
      addr.city ||
      [addr.line1, addr.line2, addr.city].filter(Boolean).join(", ") ||
      ""

    return {
      id: s._id,
      name: s.name,
      owner: s.ownerName,
      phone: s.phone,
      isActive: s.isActive,
      specialties: s.tags || [],
      address: displayAddress,
      latitude: addr.latitude,
      longitude: addr.longitude,
      ordersToday: 0,
      totalOrders: 0,
      products: s.products || [],
    }
  }

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/admin/shops`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!res.ok) throw new Error(await res.text())
      const data: ApiShop[] = await res.json()
      setShops(data.map(mapApiShop))
    } catch (e) {
      console.error(e)
      toast.error("Failed to load shops")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const url = new URL("/api/admin/products", API_BASE)
      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!res.ok) throw new Error(await res.text())
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
      toast.error("Failed to load products")
    }
  }, [])

  useEffect(() => {
    fetchShops()
    fetchProducts()
  }, [fetchShops, fetchProducts])

  // ---------- Derived data ----------

  const filteredAddProducts = useMemo(() => {
    const term = newShop.productSearch.toLowerCase()
    if (!term) return products
    return products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    )
  }, [products, newShop.productSearch])

  const stats = {
    total: shops.length,
    active: shops.filter(s => s.isActive).length,
    inactive: shops.filter(s => !s.isActive).length,
    todayOrders: shops.reduce((sum, s) => sum + s.ordersToday, 0),
  }

  const filteredShops = shops.filter(
    shop =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ---------- Handlers ----------

  const resetForm = () => {
    setNewShop({
      name: "",
      owner: "",
      phone: "",
      address: "",
      specialties: "",
      latitude: "",
      longitude: "",
      productSearch: "",
      selectedProductIds: [],
    })
    setEditingShopId(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (shop: Shop) => {
    setEditingShopId(shop.id)
    setNewShop({
      name: shop.name,
      owner: shop.owner,
      phone: shop.phone,
      address: shop.address,
      specialties: shop.specialties.join(", "),
      latitude: shop.latitude ? String(shop.latitude) : "",
      longitude: shop.longitude ? String(shop.longitude) : "",
      productSearch: "",
      selectedProductIds: shop.products.map(p => p.productId),
    })
    setIsDialogOpen(true)
  }

  const toggleShopStatus = async (id: string) => {
    const shop = shops.find(s => s.id === id)
    if (!shop) return
    const newStatus = !shop.isActive

    setShops(prev =>
      prev.map(s => (s.id === id ? { ...s, isActive: newStatus } : s)),
    )

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/api/admin/shops/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      })
      if (!res.ok) {
        setShops(prev =>
          prev.map(s => (s.id === id ? { ...s, isActive: !newStatus } : s)),
        )
        throw new Error(await res.text())
      }
      toast.success("Shop status updated")
    } catch (e) {
      console.error(e)
      toast.error("Failed to update shop status")
    }
  }

  const toggleProductInNewShop = (productId: string) => {
    setNewShop(prev => {
      const exists = prev.selectedProductIds.includes(productId)
      return {
        ...prev,
        selectedProductIds: exists
          ? prev.selectedProductIds.filter(id => id !== productId)
          : [...prev.selectedProductIds, productId],
      }
    })
  }

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setNewShop(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        toast.success("Location captured")
      },
      () => {
        toast.error("Unable to get location")
      },
    )
  }

  const handleSaveShop = async () => {
    if (!newShop.name.trim() || !newShop.owner.trim() || !newShop.phone.trim()) {
      toast.error("Name, owner and phone are required")
      return
    }
    if (!newShop.address.trim()) {
      toast.error("Address is required")
      return
    }

    const payload = {
      name: newShop.name.trim(),
      ownerName: newShop.owner.trim(),
      phone: newShop.phone.trim(),
      isActive: true,
      tags: newShop.specialties
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      address: {
        line1: newShop.address.trim(),
        city: "",
        state: "",
        pincode: "",
        latitude: newShop.latitude ? Number(newShop.latitude) : undefined,
        longitude: newShop.longitude ? Number(newShop.longitude) : undefined,
      },
      productIds: newShop.selectedProductIds,
    }

    const isEdit = Boolean(editingShopId)
    const url = isEdit
      ? `${API_BASE}/api/admin/shops/${editingShopId}`
      : `${API_BASE}/api/admin/shops`
    const method = isEdit ? "PATCH" : "POST"

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.message || `Failed to ${isEdit ? "update" : "add"} shop`)
        return
      }

      const apiShop: ApiShop = await res.json()
      const mapped = mapApiShop(apiShop)

      if (isEdit) {
        setShops(prev =>
          prev.map(s => (s.id === mapped.id ? mapped : s)),
        )
        toast.success("Shop updated successfully")
      } else {
        setShops(prev => [...prev, mapped])
        toast.success("Shop added successfully")
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (e) {
      console.error(e)
      toast.error("Network error while saving shop")
    }
  }

  // ---------- JSX ----------

  if (loading && shops.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading shops...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Shop Management
          </h1>
          <p className="text-muted-foreground">
            Manage partner shops for order assignment
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={open => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button variant="hero" className="h-11 px-6 rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Shop
            </Button>
          </DialogTrigger>

          {/* Add / Edit shop dialog */}
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingShopId ? "Edit Shop" : "Add New Shop"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto pr-1 md:grid-cols-[1.1fr_1.3fr]">
              {/* Left: basic details + location */}
              <div className="space-y-5 pr-0 md:pr-4">
                <div className="space-y-1.5">
                  <Label>Basic details</Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="shopName" className="text-xs">
                        Shop Name *
                      </Label>
                      <Input
                        id="shopName"
                        placeholder="e.g. Krishna Foods"
                        value={newShop.name}
                        onChange={e =>
                          setNewShop(prev => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="owner" className="text-xs">
                        Owner Name *
                      </Label>
                      <Input
                        id="owner"
                        placeholder="e.g. Krishna Sharma"
                        value={newShop.owner}
                        onChange={e =>
                          setNewShop(prev => ({
                            ...prev,
                            owner: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="shopPhone" className="text-xs">
                        Phone Number *
                      </Label>
                      <Input
                        id="shopPhone"
                        placeholder="e.g. 9876543210"
                        value={newShop.phone}
                        onChange={e =>
                          setNewShop(prev => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="specialties" className="text-xs">
                        Tags / Specialties
                      </Label>
                      <Input
                        id="specialties"
                        placeholder="Biryani, Chinese"
                        value={newShop.specialties}
                        onChange={e =>
                          setNewShop(prev => ({
                            ...prev,
                            specialties: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="Main Market, Near Bus Stand, Narnaund"
                    value={newShop.address}
                    onChange={e =>
                      setNewShop(prev => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Latitude / Longitude</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Lat"
                      value={newShop.latitude}
                      onChange={e =>
                        setNewShop(prev => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Lng"
                      value={newShop.longitude}
                      onChange={e =>
                        setNewShop(prev => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      className="shrink-0"
                    >
                      <Crosshair className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Optional. Use GPS button to auto‑fill from current location.
                  </p>
                </div>
              </div>

              {/* Right: dynamic product multi-select */}
              <div className="space-y-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pt-0 md:pl-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      Assign products to this shop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select all items this shop will sell
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Selected:{" "}
                    <span className="font-semibold text-foreground">
                      {newShop.selectedProductIds.length}
                    </span>
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or category"
                    value={newShop.productSearch}
                    onChange={e =>
                      setNewShop(prev => ({
                        ...prev,
                        productSearch: e.target.value,
                      }))
                    }
                    className="pl-9"
                  />
                </div>

                <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-md border border-border/60 bg-muted/40 p-1.5">
                  {filteredAddProducts.map(p => {
                    const checked = newShop.selectedProductIds.includes(p._id)
                    const price = p.sellingPrice ?? p.price ?? p.shopPrice ?? 0
                    return (
                      <label
                        key={p._id}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-background px-2 py-1 text-xs"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5"
                          checked={checked}
                          onChange={() => toggleProductInNewShop(p._id)}
                        />
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-7 w-7 rounded object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <span className="font-medium text-foreground">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {p.category} • ₹{price}
                          </span>
                        </div>
                      </label>
                    )
                  })}

                  {filteredAddProducts.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      No products match this search.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                variant="hero"
                onClick={handleSaveShop}
                disabled={loading}
              >
                {editingShopId ? "Update shop" : "Save shop"}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats + Search row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-xl">
          <StatCard
            title="Total Shops"
            value={stats.total}
            icon={Store}
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon={CheckCircle}
            change="Accepting orders"
            changeType="positive"
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon={XCircle}
            className="rounded-2xl border bg-card shadow-sm"
          />
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders}
            icon={TrendingUp}
            change="+15% from yesterday"
            changeType="positive"
            className="rounded-2xl border bg-card shadow-sm"
          />
        </div>

        <div className="w-full max-w-xs lg:max-w-sm lg:self-end relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shops..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-11 rounded-full"
          />
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredShops.map(shop => (
          <div
            key={shop.id}
            className={`rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md ${
              !shop.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {shop.owner}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(shop)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Switch
                  checked={shop.isActive}
                  onCheckedChange={() => toggleShopStatus(shop.id)}
                />
              </div>
            </div>

            <div className="mb-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {shop.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {shop.address}
              </div>
              {shop.latitude && shop.longitude && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Crosshair className="h-3.5 w-3.5" />
                  {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                </div>
              )}
            </div>

            <div className="mb-3 flex flex-wrap gap-1">
              {shop.specialties.map((specialty, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* Assigned products list */}
            <div className="mb-3 space-y-1.5">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Boxes className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground">
                  Assigned products
                </span>
              </div>

              {shop.products.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  No products assigned
                </p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {shop.products.map(p => (
                    <Badge
                      key={p.productId}
                      variant="outline"
                      className="text-[11px] font-normal px-2 py-0.5"
                    >
                      {p.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold text-foreground">
                  {shop.ordersToday}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-foreground">
                  {shop.totalOrders}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShops.length === 0 && !loading && (
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No shops found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or add a new shop.
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first shop
          </Button>
        </div>
      )}
    </div>
  )
}

export default Shops
