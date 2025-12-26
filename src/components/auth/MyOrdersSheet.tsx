// MyOrdersSheet.tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useUserAuth } from "./UserAuthContext"
import { useCart } from "../cart/CartContext"

import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
} from "lucide-react"

interface OrderItem {
  name: string
  variant?: string
  quantity: number
  price: number
}

export interface UserOrder {
  id: string
  items: OrderItem[]
  total: number
  status:
    | "pending"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
  shop?: string
  deliveryBoy?: string
  time: string
  address: string
  otp?: string
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-warning/20 text-warning-foreground",
  },
  preparing: {
    label: "Preparing",
    icon: Package,
    color: "bg-info/20 text-info",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "bg-primary/20 text-primary",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-success/20 text-success",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-destructive/20 text-destructive",
  },
}

interface MyOrdersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MyOrdersSheet = ({ open, onOpenChange }: MyOrdersSheetProps) => {
  const { user } = useUserAuth()
  const { orders } = useCart()
  const [selectedOrder, setSelectedOrder] =
    useState<UserOrder | null>(null)

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {selectedOrder ? `Order ${selectedOrder.id}` : "My Orders"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex h-full flex-col gap-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 inline-flex items-center gap-1 px-0 text-xs"
                onClick={() => setSelectedOrder(null)}
              >
                ← Back to Orders
              </Button>

              {/* Status */}
              {(() => {
                const config = statusConfig[selectedOrder.status]
                const Icon = config.icon
                return (
                  <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${config.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">
                          {config.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedOrder.time}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.otp && (
                      <Badge
                        variant="outline"
                        className="border-dashed text-[10px]"
                      >
                        OTP: {selectedOrder.otp}
                      </Badge>
                    )}
                  </div>
                )
              })()}

              {/* OTP for delivery */}
              {selectedOrder.status === "out_for_delivery" &&
                selectedOrder.otp && (
                  <div className="rounded-lg bg-primary/5 p-3 text-[11px] text-primary">
                    <p className="font-semibold">
                      Delivery OTP: {selectedOrder.otp}
                    </p>
                    <p className="text-[10px] text-primary/80">
                      Share this with delivery partner
                    </p>
                  </div>
                )}

              {/* Items */}
              <div className="space-y-2 rounded-lg border bg-card p-3 text-xs">
                <p className="mb-1 text-sm font-semibold">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span>
                      {item.name}{" "}
                      {item.variant && `(${item.variant})`} x
                      {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs font-semibold">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shop & Delivery Info */}
              {selectedOrder.shop && (
                <div className="space-y-2 rounded-lg border bg-card p-3 text-xs">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Shop
                    </p>
                    <p className="text-xs font-medium">
                      {selectedOrder.shop}
                    </p>
                  </div>

                  {selectedOrder.deliveryBoy && (
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        Delivery Partner
                      </p>
                      <p className="text-xs font-medium">
                        {selectedOrder.deliveryBoy}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Address
                    </p>
                    <p className="text-xs">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col gap-3">
              {orders.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                  <Package className="h-10 w-10 text-muted-foreground/70" />
                  <p className="font-medium">No orders yet</p>
                  <p className="text-xs">
                    Start ordering to see them here
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-2 overflow-auto">
                  {orders.map((order) => {
                    const config = statusConfig[order.status]
                    const Icon = config.icon
                    const itemsLabel = order.items
                      .map((i) => i.name)
                      .join(", ")
                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => setSelectedOrder(order as any)}
                        className="w-full rounded-lg border border-border bg-card p-4 text-left text-xs hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                #{order.id}
                              </span>
                              <Badge
                                variant="outline"
                                className={`flex items-center gap-1 border-0 px-1.5 py-0.5 text-[10px] ${config.color}`}
                              >
                                <Icon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {itemsLabel}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 text-[11px]">
                            <span className="font-semibold">
                              ₹{order.total.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(
                                order.createdAt,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="line-clamp-1">
                            {order.address}
                          </span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MyOrdersSheet
