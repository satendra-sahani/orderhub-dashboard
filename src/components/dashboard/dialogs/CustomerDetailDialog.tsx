import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MapPin, ShoppingBag, Calendar } from "lucide-react";

export interface CustomerDetail {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalOrders: number;
  joinedDate: string;
}

interface CustomerDetailDialogProps {
  customer: CustomerDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerDetailDialog = ({ customer, open, onOpenChange }: CustomerDetailDialogProps) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {customer.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>{customer.name}</span>
              <p className="text-sm text-muted-foreground font-normal">Customer</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Info */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Joined {customer.joinedDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Total Orders</span>
              </div>
              <span className="text-2xl font-bold">{customer.totalOrders}</span>
            </div>
          </div>

          {/* ID */}
          <div className="text-center text-sm text-muted-foreground">
            Customer ID: {customer.id}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailDialog;
