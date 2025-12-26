// src/pages/MyOrders.tsx
"use client"

import { useEffect, useState } from "react"
import Header from "@/components/home/Header"
import { API_BASE_URL } from "@/components/config"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { XCircle } from "lucide-react"

const API_BASE = API_BASE_URL || "https://orderhai-be.vercel.app"

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
    status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED",
    orderId?: string
}

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(
        null,
    )
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [dummyOrdersSheetOpen, setDummyOrdersSheetOpen] =
        useState(false) // Header prop compatibility
    const navigate = useNavigate()

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null

    const loadOrders = async () => {
        if (!token) {
            setOrders([])
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/users/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.message || "Failed to load orders")
                setIsLoading(false)
                return
            }

            const mapped: Order[] = data.map((o: any) => ({
                id: o.id || o._id,
                _id: o._id,
                orderId: o.orderId,
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
            if (mapped.length > 0) {
                setSelectedOrder(mapped[0])
            } else {
                setSelectedOrder(null)
            }
        } catch {
            toast.error("Network error while loading orders")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [token])

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
                    headers: { Authorization: `Bearer ${token}` },
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

    const filteredOrders = orders.filter(o => {
        if (!searchTerm.trim()) return true
        const q = searchTerm.toLowerCase()
        const itemsStr = o.items
            .map(i => i.name)
            .join(", ")
            .toLowerCase()
        return (
            itemsStr.includes(q) ||
            o.address.toLowerCase().includes(q) ||
            o.status.toLowerCase().includes(q)
        )
    })

    return (
        <>
            <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onViewOrders={() => setDummyOrdersSheetOpen(true)}
            />

            <main className="mx-auto mt-2 max-w-5xl px-3 pb-16 sm:px-4">
                <div className="mb-3 flex items-center justify-between">
                    <h1 className="text-base font-semibold sm:text-lg">
                        My Orders
                    </h1>
                    <button
                        className="text-xs text-primary underline"
                        onClick={() => navigate("/")}
                    >
                        Back to home
                    </button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                    {/* Orders list */}
                    <div className="w-full md:w-1/2">
                        {isLoading ? (
                            <p className="py-4 text-sm text-muted-foreground">
                                Loading orders...
                            </p>
                        ) : filteredOrders.length === 0 ? (
                            <div className="py-8 text-sm text-muted-foreground">
                                No orders yet. Start ordering to see them here.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredOrders.map(o => (
                                    <button
                                        key={o.id}
                                        type="button"
                                        onClick={() => setSelectedOrder(o)}
                                        className={`w-full rounded-lg border p-3 text-left text-xs ${selectedOrder?.id === o.id
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
                                                    {new Date(
                                                        o.createdAt,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-medium uppercase">
                                                {o.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                                            {o.items
                                                .map(i => `${i.name} ×${i.qty}`)
                                                .join(", ")}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected order details */}
                    <div className="w-full md:w-1/2">
                        {selectedOrder ? (
                            <div className="space-y-3 rounded-lg border bg-card p-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </span>
                                    <span className="text-[11px] font-medium uppercase">
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Order ID: {selectedOrder.orderId || selectedOrder.id}
                                </p>

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

                                <div className="space-y-1 border-t pt-2">
                                    <p className="text-[11px] font-semibold">
                                        Address
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {selectedOrder.address}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t pt-2">
                                    <span className="text-sm font-semibold">
                                        Total: ₹{selectedOrder.total.toFixed(2)}
                                    </span>
                                    {selectedOrder.status === "PENDING" && (
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]"
                                            onClick={() =>
                                                handleCancelOrder(selectedOrder)
                                            }
                                        >
                                            <XCircle className="h-3 w-3" />
                                            Cancel order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-sm text-muted-foreground">
                                Select an order to see details.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default MyOrdersPage
