"use client";

import { useEffect, useState, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from "@/components/dashboard/StatCard";
import OrderDetailDialog, {
  OrderDetail,
} from "@/components/dashboard/dialogs/OrderDetailDialog";
import ShopDetailDialog, {
  ShopDetail,
} from "@/components/dashboard/dialogs/ShopDetailDialog";
import DeliveryBoyDetailDialog, {
  DeliveryBoyDetail,
} from "@/components/dashboard/dialogs/DeliveryBoyDetailDialog";
import CustomerDetailDialog, {
  CustomerDetail,
} from "@/components/dashboard/dialogs/CustomerDetailDialog";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/components/config";
import { toast } from "sonner";

const API_BASE = API_BASE_URL;

interface OrderStatusTimeline {
  createdAt: string;
  assignedShopAt?: string;
  assignedDeliveryAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface Order {
  id: string;
  customer: string;
  customerPhone?: string;
  customerAddress?: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  shop: string | null;
  deliveryBoy: string | null;
  time: string; // formatted HH:MM
  createdAt?: string | null; // ISO from backend
  otp?: string;
  shopPrice: number;
  shopMargin: number;
  shopPaid: boolean;
  paymentMode: "CASH" | "ONLINE" | "UPI";
  couponCode?: string;
  offerPrice?: number;
  lat?: number;
  lng?: number;
  timeline: OrderStatusTimeline;
}

interface AssignShopOption {
  id: string;
  name: string;
  distanceKm: number;
  rating: number;
  address?: string;
  products: string[];
}

interface DeliveryBoyOption {
  id: string;
  name: string;
  phone: string;
  distanceKm: number;
  activeOrders: number;
  lat?: number;
  lng?: number;
}

// static riders for now
const deliveryBoyOptions: DeliveryBoyOption[] = [
  {
    id: "DB001",
    name: "Ravi Kumar",
    phone: "9876543210",
    distanceKm: 0.7,
    activeOrders: 3,
    lat: 28.3001,
    lng: 76.3001,
  },
  {
    id: "DB002",
    name: "Suresh Singh",
    phone: "9876543211",
    distanceKm: 1.1,
    activeOrders: 5,
    lat: 28.3102,
    lng: 76.3102,
  },
  {
    id: "DB003",
    name: "Mohan Yadav",
    phone: "9876543212",
    distanceKm: 0.4,
    activeOrders: 2,
    lat: 28.3203,
    lng: 76.3203,
  },
  {
    id: "DB004",
    name: "Anil Sharma",
    phone: "9876543213",
    distanceKm: 1.8,
    activeOrders: 4,
    lat: 28.3304,
    lng: 76.3304,
  },
];

const statusColors: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  preparing: "bg-sky-100 text-sky-800 border-sky-200",
  out_for_delivery: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const statusLabels: Record<Order["status"], string> = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedShop, setSelectedShop] = useState<ShopDetail | null>(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoyDetail | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetail | null>(null);

  const [assignShopModalOpen, setAssignShopModalOpen] = useState(false);
  const [assignShopOrder, setAssignShopOrder] = useState<Order | null>(null);
  const [assignShopOptions, setAssignShopOptions] = useState<AssignShopOption[]>(
    []
  );
  const [assignShopLoading, setAssignShopLoading] = useState(false);

  const [assignDeliveryModalOpen, setAssignDeliveryModalOpen] = useState(false);
  const [assignDeliveryOrder, setAssignDeliveryOrder] =
    useState<Order | null>(null);

  const [statusTimelineOrder, setStatusTimelineOrder] =
    useState<Order | null>(null);

  // fetch orders
  const fetchOrders = useCallback(
    async (opts?: { search?: string; status?: string }) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const url = new URL("/api/admin/orders", API_BASE);
        const search = opts?.search ?? searchTerm;
        const status = opts?.status ?? statusFilter;

        if (search) url.searchParams.set("search", search);
        if (status && status !== "all") url.searchParams.set("status", status);

        const res = await fetch(url.toString(), {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("fetchOrders", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter]
  );

  useEffect(() => {
    fetchOrders();
  }, []); // initial load

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders();
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter, fetchOrders]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderClick = (order: Order) => {
    
    setSelectedOrder({
      id: order.id,
      customer: order.customer,
      phone: order.customerPhone || "",
      address: order.customerAddress || "",
      items: order.items,
      total: order.total,
      paymentMode: order.paymentMode,
     // @ts-ignore
      status: statusLabels[order.status],
      otp: order.otp,
      createdAt: order.createdAt || undefined,
    });
  };

  const handleShopClick = (shopName: string) => {

    // @ts-ignore
        setSelectedShop({
          id: shopName,
          name: shopName,
          owner: "",
          phone: "",
          address: "",
          isActive: true,
          ordersToday: 0,
          totalOrders: 0,
        });
  };

  const handleDeliveryBoyClick = (name: string) => {
    const boy = deliveryBoyOptions.find((b) => b.name === name);
    if (boy) {
      setSelectedDeliveryBoy({
        id: boy.id,
        name: boy.name,
        phone: boy.phone,
        status: "available",
        ordersToday: boy.activeOrders,
        totalOrders: 0,
        rating: 4.7,
        area: "",
      });
    }
  };

  const handleCustomerClick = (order: Order) => {
    setSelectedCustomer({
      id: `CUST_${order.id}`,
      name: order.customer,
      phone: order.customerPhone || "N/A",
      address: order.customerAddress,
      totalOrders: 1,
      joinedDate: "2024",
    });
  };

  // ---- ASSIGN SHOP ----
  const openAssignShopModal = async (order: Order) => {
    setAssignShopOrder(order);
    setAssignShopModalOpen(true);
    setAssignShopLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/api/admin/orders/${order.id}/nearest-shops`;
      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data: AssignShopOption[] = await res.json();
      setAssignShopOptions(
        data.map((s) => ({
          ...s,
          products: s.products || [],
        }))
      );
    } catch (err) {
      console.error("nearest shops", err);
      toast.error("Failed to load shops");
      setAssignShopOptions([]);
    } finally {
      setAssignShopLoading(false);
    }
  };

  const closeAssignShopModal = () => {
    setAssignShopModalOpen(false);
    setAssignShopOrder(null);
    setAssignShopOptions([]);
  };

  const handleAssignShop = async (orderId: string, shop: AssignShopOption) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/admin/orders/${orderId}/assign-shop`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ shopId: shop.id }),
        }
      );
      if (!res.ok) throw new Error(await res.text());

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                shop: shop.name,
                status: "preparing",
                timeline: {
                  ...order.timeline,
                  assignedShopAt: order.timeline.assignedShopAt || "Now",
                },
              }
            : order
        )
      );
      toast.success("Shop assigned");
    } catch (err) {
      console.error("handleAssignShop", err);
      toast.error("Failed to assign shop");
    }
  };

  const handleSelectShopFromModal = async (shopName: string, shopId: string) => {
    if (assignShopOrder) {
      const shopOption = assignShopOptions.find((s) => s.id === shopId);
      if (shopOption) {
        await handleAssignShop(assignShopOrder.id, shopOption);
      }
      closeAssignShopModal();
    }
  };

  // ---- ASSIGN DELIVERY ----
  const openAssignDeliveryModal = (order: Order) => {
    setAssignDeliveryOrder(order);
    setAssignDeliveryModalOpen(true);
  };

  const closeAssignDeliveryModal = () => {
    setAssignDeliveryModalOpen(false);
    setAssignDeliveryOrder(null);
  };

  const handleAssignDelivery = async (orderId: string, deliveryBoy: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/admin/orders/${orderId}/assign-delivery`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ deliveryBoyName: deliveryBoy }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                deliveryBoy,
                status: "out_for_delivery",
                otp: data.otp || order.otp,
                timeline: {
                  ...order.timeline,
                  assignedDeliveryAt:
                    order.timeline.assignedDeliveryAt || "Now",
                  pickedUpAt: order.timeline.pickedUpAt || "Soon",
                },
              }
            : order
        )
      );
      toast.success("Delivery boy assigned");
    } catch (err) {
      console.error("handleAssignDelivery", err);
      toast.error("Failed to assign delivery boy");
    }
  };

  const handleSelectDeliveryBoyFromModal = async (boyName: string) => {
    if (assignDeliveryOrder) {
      await handleAssignDelivery(assignDeliveryOrder.id, boyName);
      closeAssignDeliveryModal();
    }
  };

  // ---- MARK SHOP PAID ----
  const handleMarkShopPaid = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/admin/orders/${orderId}/mark-shop-paid`,
        {
          method: "PATCH",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, shopPaid: true } : order
        )
      );
      toast.success("Marked as paid");
    } catch (err) {
      console.error("handleMarkShopPaid", err);
      toast.error("Failed to mark as paid");
    }
  };

  const openStatusTimeline = (order: Order) => {
    setStatusTimelineOrder(order);
  };

  const closeStatusTimeline = () => {
    setStatusTimelineOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and assign orders to shops and delivery boys.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.total.toString()}
          icon={ShoppingBag}
        />
        <StatCard
          title="Pending"
          value={stats.pending.toString()}
          icon={Clock}
        />
        <StatCard
          title="Delivered"
          value={stats.delivered.toString()}
          icon={CheckCircle}
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled.toString()}
          icon={XCircle}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[150px]">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shop & Pricing</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Coupon / Offer</TableHead>
              <TableHead className="w-[90px] text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-sm">
                  Loading orders...
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="align-top">
                  {/* Order ID + total */}
                  <TableCell>
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="font-medium text-primary hover:underline text-sm text-left"
                    >
                      {order.id}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      Order: ₹{order.total}
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <button
                      onClick={() => handleCustomerClick(order)}
                      className="text-sm font-medium hover:text-primary hover:underline text-left"
                    >
                      {order.customer}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </div>
                  </TableCell>

                  {/* Items */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[11px] px-2 py-0.5"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <button
                      onClick={() => openStatusTimeline(order)}
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusColors[order.status]} hover:brightness-95`}
                    >
                      {statusLabels[order.status]}
                      {order.otp ? ` · OTP: ${order.otp}` : ""}
                    </button>
                  </TableCell>

                  {/* Shop & Pricing */}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {order.shop ? (
                        <>
                          <button
                            onClick={() => handleShopClick(order.shop!)}
                            className="text-sm text-muted-foreground hover:text-primary hover:underline text-left"
                          >
                            {order.shop}
                          </button>
                          <button
                            className="text-[11px] text-primary underline-offset-2 hover:underline self-start"
                            onClick={() => openAssignShopModal(order)}
                          >
                            Change shop
                          </button>
                        </>
                      ) : order.status === "pending" ? (
                        <button
                          className="text-[11px] text-primary underline-offset-2 hover:underline self-start"
                          onClick={() => openAssignShopModal(order)}
                        >
                          Assign shop
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No shop
                        </span>
                      )}

                      <div>Shop price: ₹{order.shopPrice}</div>
                      <div>Margin: ₹{order.shopMargin}</div>
                      <div>Mode: {order.paymentMode}</div>

                      <label className="inline-flex items-center gap-1 mt-1 text-[11px]">
                        <input
                          type="checkbox"
                          checked={order.shopPaid}
                          onChange={() =>
                            !order.shopPaid && handleMarkShopPaid(order.id)
                          }
                          className="h-3 w-3 rounded border"
                        />
                        <span>Paid to shop</span>
                      </label>

                      {!order.shopPaid && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 h-6 text-[11px] px-2 py-0"
                          onClick={() => handleMarkShopPaid(order.id)}
                        >
                          Mark as paid
                        </Button>
                      )}
                    </div>
                  </TableCell>

                  {/* Delivery */}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {order.deliveryBoy ? (
                        <>
                          <button
                            onClick={() =>
                              handleDeliveryBoyClick(order.deliveryBoy!)
                            }
                            className="text-sm text-muted-foreground hover:text-primary hover:underline text-left"
                          >
                            {order.deliveryBoy}
                          </button>
                          <button
                            className="text-[11px] text-primary underline-offset-2 hover:underline self-start"
                            onClick={() => openAssignDeliveryModal(order)}
                          >
                            Change rider
                          </button>
                        </>
                      ) : order.status === "preparing" ? (
                        <button
                          className="text-[11px] text-primary underline-offset-2 hover:underline self-start"
                          onClick={() => openAssignDeliveryModal(order)}
                        >
                          Assign rider
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Coupon / Offer */}
                  <TableCell>
                    {order.couponCode ? (
                      <div className="flex flex-col gap-1 text-xs">
                        <span>Coupon: {order.couponCode}</span>
                        {order.offerPrice && (
                          <span>Offer price: ₹{order.offerPrice}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No coupon
                      </span>
                    )}
                  </TableCell>

                  {/* Time */}
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {order.time}
                  </TableCell>
                </TableRow>
              ))}

            {!loading && filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-sm">
                  No orders found for current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail dialogs */}
      <OrderDetailDialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder || undefined}
      />
      <ShopDetailDialog
        open={!!selectedShop}
        onOpenChange={(open) => !open && setSelectedShop(null)}
        shop={selectedShop || undefined}
      />
      <DeliveryBoyDetailDialog
        open={!!selectedDeliveryBoy}
        onOpenChange={(open) => !open && setSelectedDeliveryBoy(null)}
        deliveryBoy={selectedDeliveryBoy || undefined}
      />
      <CustomerDetailDialog
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
        customer={selectedCustomer || undefined}
      />

      {/* Assign Shop big modal */}
      <Dialog
        open={assignShopModalOpen}
        onOpenChange={(open) => !open && closeAssignShopModal()}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign shop to order</DialogTitle>
            <DialogDescription>
              Select the best shop for this order based on distance and products.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-[1.1fr,1.3fr]">
            {/* Left: customer + order */}
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Customer & Order</h3>
                {assignShopOrder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        assignShopOrder.lat != null &&
                        assignShopOrder.lng != null
                      ) {
                        copyToClipboard(
                          `${assignShopOrder.lat}, ${assignShopOrder.lng}`
                        );
                      } else {
                        copyToClipboard(
                          assignShopOrder.customerAddress || ""
                        );
                      }
                    }}
                  >
                    Copy location
                  </Button>
                )}
              </div>

              {assignShopOrder ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Order ID</div>
                    <div className="font-medium">{assignShopOrder.id}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Customer</div>
                    <div className="font-medium">
                      {assignShopOrder.customer}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-muted-foreground">Phone</div>
                      <div className="font-medium">
                        {assignShopOrder.customerPhone || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Time</div>
                      <div className="font-medium">
                        {assignShopOrder.time}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Address</div>
                    <div className="font-medium">
                      {assignShopOrder.customerAddress || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Items</div>
                    <div className="flex flex-wrap gap-1">
                      {assignShopOrder.items.map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[11px] px-2 py-0.5"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Order amount</div>
                    <div className="font-semibold">
                      ₹{assignShopOrder.total}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No order selected.
                </div>
              )}
            </div>

            {/* Right: shops list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Available Shops</h3>
              </div>

              {assignShopLoading && (
                <div className="text-xs text-muted-foreground">
                  Loading shops...
                </div>
              )}

              {!assignShopLoading && assignShopOptions.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  No shop suggestions found.
                </div>
              )}

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {assignShopOptions.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() =>
                      handleSelectShopFromModal(shop.name, shop.id)
                    }
                    className="w-full text-left rounded-lg border hover:bg-muted/60 px-3 py-2.5 transition flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{shop.name}</div>
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>

                    <div className="flex items-center text-[11px] text-muted-foreground gap-2">
                      <span>{shop?.distanceKm ? shop?.distanceKm?.toFixed(2) : (Math.random() * 10).toFixed(2)} km away</span>
                      <span>•</span>
                      <span>⭐ {shop.rating}</span>
                    </div>

                    {shop.address && (
                      <div className="text-[11px] text-muted-foreground">
                        {shop.address}
                      </div>
                    )}

                    {shop.products && shop.products.length > 0 && (
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        <span className="font-medium">
                          Popular products:{" "}
                        </span>
                        <span>
                          {shop.products.slice(0, 4).join(", ")}
                          {shop.products.length > 4 && " ..."}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Delivery big modal */}
      <Dialog
        open={assignDeliveryModalOpen}
        onOpenChange={(open) => !open && closeAssignDeliveryModal()}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign delivery boy</DialogTitle>
            <DialogDescription>
              Choose the best delivery boy based on distance and current load.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-[1.1fr,1.3fr]">
            {/* Left: assigned shop + order info */}
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Shop & Order</h3>
                {assignDeliveryOrder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        assignDeliveryOrder.lat != null &&
                        assignDeliveryOrder.lng != null
                      ) {
                        copyToClipboard(
                          `${assignDeliveryOrder.lat}, ${assignDeliveryOrder.lng}`
                        );
                      } else {
                        copyToClipboard(
                          assignDeliveryOrder.customerAddress || ""
                        );
                      }
                    }}
                  >
                    Copy location
                  </Button>
                )}
              </div>

              {assignDeliveryOrder ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Order ID</div>
                    <div className="font-medium">
                      {assignDeliveryOrder.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Customer</div>
                    <div className="font-medium">
                      {assignDeliveryOrder.customer}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Assigned shop</div>
                    <div className="font-medium">
                      {assignDeliveryOrder.shop || "Not assigned"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Address</div>
                    <div className="font-medium">
                      {assignDeliveryOrder.customerAddress || "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-muted-foreground">Time</div>
                      <div className="font-medium">
                        {assignDeliveryOrder.time}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Amount</div>
                      <div className="font-semibold">
                        ₹{assignDeliveryOrder.total}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Items</div>
                    <div className="flex flex-wrap gap-1">
                      {assignDeliveryOrder.items.map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[11px] px-2 py-0.5"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No order selected.
                </div>
              )}
            </div>

            {/* Right: delivery boys list with distance + copy location */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Delivery Boys</h3>
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {deliveryBoyOptions.map((boy) => (
                  <div
                    key={boy.id}
                    className="w-full rounded-lg border hover:bg-muted/60 px-3 py-2.5 transition flex flex-col gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDeliveryBoyFromModal(boy.name);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {boy.name} ({boy.phone})
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDeliveryBoyFromModal(boy.name);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>{boy.distanceKm.toFixed(1)} km away</span>
                      <span>•</span>
                      <span>{boy.activeOrders} active orders</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[11px] px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${boy.lat}, ${boy.lng}`);
                        }}
                      >
                        Copy location
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status timeline dialog */}
      <Dialog
        open={!!statusTimelineOrder}
        onOpenChange={(open) => !open && closeStatusTimeline()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Order status history • {statusTimelineOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Track when the order was placed, assigned, picked and delivered.
            </DialogDescription>
          </DialogHeader>

          {statusTimelineOrder && (
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-medium">Timeline</div>
              </div>
              <div className="space-y-1">
                <div>
                  <div className="text-muted-foreground">Order placed</div>
                  <div className="font-medium">
                    {statusTimelineOrder.timeline.createdAt}
                  </div>
                </div>
                {statusTimelineOrder.timeline.assignedShopAt && (
                  <div>
                    <div className="text-muted-foreground">Shop assigned</div>
                    <div className="font-medium">
                      {statusTimelineOrder.timeline.assignedShopAt}
                    </div>
                  </div>
                )}
                {statusTimelineOrder.timeline.assignedDeliveryAt && (
                  <div>
                    <div className="text-muted-foreground">
                      Delivery assigned
                    </div>
                    <div className="font-medium">
                      {statusTimelineOrder.timeline.assignedDeliveryAt}
                    </div>
                  </div>
                )}
                {statusTimelineOrder.timeline.pickedUpAt && (
                  <div>
                    <div className="text-muted-foreground">Picked up</div>
                    <div className="font-medium">
                      {statusTimelineOrder.timeline.pickedUpAt}
                    </div>
                  </div>
                )}
                {statusTimelineOrder.timeline.deliveredAt && (
                  <div>
                    <div className="text-muted-foreground">Delivered</div>
                    <div className="font-medium">
                      {statusTimelineOrder.timeline.deliveredAt}
                    </div>
                  </div>
                )}
                {statusTimelineOrder.timeline.cancelledAt && (
                  <div>
                    <div className="text-muted-foreground">Cancelled</div>
                    <div className="font-medium">
                      {statusTimelineOrder.timeline.cancelledAt}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
