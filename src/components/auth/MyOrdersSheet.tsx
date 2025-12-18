import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUserAuth } from "./UserAuthContext";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight } from "lucide-react";

interface OrderItem {
  name: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface UserOrder {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  shop?: string;
  deliveryBoy?: string;
  time: string;
  address: string;
  otp?: string;
}

// Mock user orders (in real app, fetch from backend)
const mockUserOrders: UserOrder[] = [
  {
    id: "ORD007",
    items: [
      { name: "Biryani", variant: "Full", quantity: 1, price: 180 },
      { name: "Raita", quantity: 1, price: 30 },
    ],
    total: 210,
    status: "out_for_delivery",
    shop: "Krishna Foods",
    deliveryBoy: "Ravi Kumar",
    time: "Today, 11:30 AM",
    address: "123, Main Street, Village",
    otp: "4521",
  },
  {
    id: "ORD008",
    items: [
      { name: "Momos", variant: "Steam", quantity: 2, price: 80 },
    ],
    total: 160,
    status: "delivered",
    shop: "Sharma Kitchen",
    deliveryBoy: "Suresh",
    time: "Yesterday, 7:45 PM",
    address: "123, Main Street, Village",
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-warning/20 text-warning-foreground" },
  preparing: { label: "Preparing", icon: Package, color: "bg-info/20 text-info" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-primary/20 text-primary" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-success/20 text-success" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive/20 text-destructive" },
};

interface MyOrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MyOrdersSheet = ({ open, onOpenChange }: MyOrdersSheetProps) => {
  const { user } = useUserAuth();
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {selectedOrder ? `Order ${selectedOrder.id}` : "My Orders"}
          </SheetTitle>
        </SheetHeader>

        {selectedOrder ? (
          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="mb-2"
            >
              ← Back to Orders
            </Button>

            {/* Status */}
            <div className="flex items-center gap-2">
              {(() => {
                const config = statusConfig[selectedOrder.status];
                const Icon = config.icon;
                return (
                  <Badge className={config.color}>
                    <Icon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                );
              })()}
              <span className="text-sm text-muted-foreground">{selectedOrder.time}</span>
            </div>

            {/* OTP for delivery */}
            {selectedOrder.status === "out_for_delivery" && selectedOrder.otp && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Delivery OTP</p>
                <p className="text-2xl font-bold tracking-widest text-primary">{selectedOrder.otp}</p>
                <p className="text-xs text-muted-foreground mt-1">Share this with delivery partner</p>
              </div>
            )}

            {/* Items */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-3">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.name} {item.variant && `(${item.variant})`} x{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Shop & Delivery Info */}
            {selectedOrder.shop && (
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shop</span>
                  <span className="font-medium">{selectedOrder.shop}</span>
                </div>
                {selectedOrder.deliveryBoy && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Partner</span>
                    <span className="font-medium">{selectedOrder.deliveryBoy}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[60%]">{selectedOrder.address}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {mockUserOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              mockUserOrders.map((order) => {
                const config = statusConfig[order.status];
                const Icon = config.icon;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-card border border-border rounded-lg p-4 text-left hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={config.color} variant="outline">
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.map(i => i.name).join(", ")}
                        </p>
                        <p className="text-sm font-medium mt-1">₹{order.total}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{order.time}</p>
                  </button>
                );
              })
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MyOrdersSheet;
