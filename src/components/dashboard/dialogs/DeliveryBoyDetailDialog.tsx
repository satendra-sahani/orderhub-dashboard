import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MapPin, Star, Truck, Clock, UserCheck } from "lucide-react";

export interface DeliveryBoyDetail {
  id: string;
  name: string;
  phone: string;
  status: "available" | "on_delivery" | "offline";
  ordersToday: number;
  totalOrders: number;
  rating: number;
  area: string;
}

const statusConfig = {
  available: { label: "Available", icon: UserCheck, color: "bg-success/20 text-success border-success/30" },
  on_delivery: { label: "On Delivery", icon: Truck, color: "bg-primary/20 text-primary border-primary/30" },
  offline: { label: "Offline", icon: Clock, color: "bg-muted text-muted-foreground border-muted" },
};

interface DeliveryBoyDetailDialogProps {
  deliveryBoy: DeliveryBoyDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeliveryBoyDetailDialog = ({ deliveryBoy, open, onOpenChange }: DeliveryBoyDetailDialogProps) => {
  if (!deliveryBoy) return null;

  const config = statusConfig[deliveryBoy.status];
  const StatusIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                {deliveryBoy.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{deliveryBoy.name}</span>
              <div className="mt-1">
                <Badge variant="outline" className={config.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact & Area */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{deliveryBoy.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{deliveryBoy.area}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="font-medium">{deliveryBoy.rating}</span>
              <span className="text-muted-foreground">Rating</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Truck className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{deliveryBoy.ordersToday}</p>
              <p className="text-xs text-muted-foreground">Today's Deliveries</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{deliveryBoy.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
            </div>
          </div>

          {/* ID */}
          <div className="text-center text-sm text-muted-foreground">
            Partner ID: {deliveryBoy.id}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryBoyDetailDialog;
