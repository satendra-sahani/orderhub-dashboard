"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Clock, XCircle } from "lucide-react"
import { useCart } from "@/components/cart/CartContext"

const API_BASE = "https://orderhai-be.vercel.app"

interface OrderItem {
  name: string
  variantName?: string
  qty: number
  price: number
}

interface Order {
  id: string
  _id?: string
  createdAt: string
  items: OrderItem[]
  total: number
  paymentMethod: "COD" | "ONLINE"
  address: string
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
}

interface MyOrdersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MyOrdersSheet = ({ open, onOpenChange }: MyOrdersSheetProps) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    null,
  )

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const loadOrders = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to load orders")
        return
      }
      const mapped: Order[] = data.map((o: any) => ({
        id: o.id || o._id,
        _id: o._id,
        createdAt: o.createdAt,
        items: o.items || [],
        total: o.total,
        paymentMethod: o.paymentMethod || "COD",
        address: o.address,
        status:
          (o.status as
            | "PENDING"
            | "CONFIRMED"
            | "DELIVERED"
            | "CANCELLED") || "PENDING",
      }))
      setOrders(mapped)
      if (mapped.length > 0 && !selectedOrder) {
        setSelectedOrder(mapped[0])
      }
    } catch {
      toast.error("Network error while loading orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && token) {
      loadOrders()
    }
  }, [open, token])

  const handleCancelOrder = async (order: Order) => {
    if (!token) {
      toast.error("Login required to cancel orders")
      return
    }
    if (
      order.status === "CANCELLED" ||
      order.status === "DELIVERED"
    ) {
      toast.error("This order cannot be cancelled")
      return
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/users/orders/${order.id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Unable to cancel order")
        return
      }

      toast.success("Order cancelled")

      setOrders(prev =>
        prev.map(o =>
          o.id === order.id ? { ...o, status: "CANCELLED" } : o,
        ),
      )
      setSelectedOrder(prev =>
        prev && prev.id === order.id
          ? { ...prev, status: "CANCELLED" }
          : prev,
      )
    } catch {
      toast.error("Network error while cancelling order")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>My Orders</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex h-[calc(100vh-6rem)] flex-col gap-4">
          {/* List of orders */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading orders...
              </p>
            ) : orders.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Clock className="h-8 w-8" />
                <p className="font-medium">No orders yet</p>
                <p className="text-xs">
                  Start ordering to see them here
                </p>
              </div>
            ) : (
              orders.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedOrder(o)}
                  className={`w-full rounded-lg border p-3 text-left text-xs ${
                    selectedOrder?.id === o.id
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        ₹{o.total.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[11px] font-medium uppercase">
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                    {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Selected order details */}
          {selectedOrder && (
            <div className="space-y-2 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {new Date(
                    selectedOrder.createdAt,
                  ).toLocaleString()}
                </span>
                <span className="text-[11px] font-medium uppercase">
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold">
                  Items
                </p>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {item.name}
                      {item.variantName
                        ? ` (${item.variantName})`
                        : ""}{" "}
                      × {item.qty}
                    </span>
                    <span>
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 border-t">
                <p className="text-[11px] font-semibold">Address</p>
                <p className="text-[11px] text-muted-foreground">
                  {selectedOrder.address}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold">
                  Total: ₹{selectedOrder.total.toFixed(2)}
                </span>
                {selectedOrder.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() =>
                      handleCancelOrder(selectedOrder)
                    }
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Cancel order
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MyOrdersSheet
