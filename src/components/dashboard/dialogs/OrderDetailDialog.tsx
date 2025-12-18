import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, User } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  id: string;
  customer: string;
  customerPhone?: string;
  customerAddress?: string;
  items: string[];
  itemDetails?: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  shop: string | null;
  deliveryBoy: string | null;
  time: string;
  otp?: string;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-warning/20 text-warning-foreground border-warning/30" },
  preparing: { label: "Preparing", icon: Package, color: "bg-info/20 text-info border-info/30" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-primary/20 text-primary border-primary/30" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive/20 text-destructive border-destructive/30" },
};

interface OrderDetailDialogProps {
  order: OrderDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({ order, open, onOpenChange }: OrderDetailDialogProps) => {
  if (!order) return null;

  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Order {order.id}</span>
            <Badge variant="outline" className={config.color}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Customer</h3>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{order.customer}</span>
            </div>
            {order.customerPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {order.customerPhone}
              </div>
            )}
            {order.customerAddress && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {order.customerAddress}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Shop</p>
              <p className="font-medium text-sm">{order.shop || "Not assigned"}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Delivery</p>
              <p className="font-medium text-sm">{order.deliveryBoy || "Not assigned"}</p>
            </div>
          </div>

          {/* Time & OTP */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Time</span>
            <span className="font-medium">{order.time}</span>
          </div>

          {order.otp && order.status === "out_for_delivery" && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Delivery OTP</p>
              <p className="text-2xl font-bold tracking-widest text-primary">{order.otp}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
