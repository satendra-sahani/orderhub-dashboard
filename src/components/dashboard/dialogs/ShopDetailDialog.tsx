import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Store, Phone, MapPin, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export interface ShopDetail {
  id: string;
  name: string;
  owner: string;
  phone: string;
  address: string;
  isActive: boolean;
  ordersToday: number;
  totalOrders: number;
  specialties: string[];
}

interface ShopDetailDialogProps {
  shop: ShopDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShopDetailDialog = ({ shop, open, onOpenChange }: ShopDetailDialogProps) => {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>{shop.name}</span>
              <Badge 
                variant="outline" 
                className={`ml-2 ${shop.isActive ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}
              >
                {shop.isActive ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                )}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Owner & Contact */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Owner</span>
              <span className="font-medium">{shop.owner}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {shop.phone}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <span className="flex items-center gap-2 text-right max-w-[60%]">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {shop.address}
              </span>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-medium mb-2 text-sm text-muted-foreground">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {shop.specialties.map((specialty, i) => (
                <Badge key={i} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{shop.ordersToday}</p>
              <p className="text-xs text-muted-foreground">Today's Orders</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Store className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{shop.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailDialog;
