import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  MapPin, 
  Phone,
  ShieldCheck,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface DeliveryOrder {
  id: string;
  orderId: string;
  customer: string;
  customerPhone: string;
  address: string;
  deliveryBoy: string;
  deliveryBoyPhone: string;
  items: string[];
  total: number;
  status: "arrived" | "pending_otp" | "delivered" | "cancelled";
  otp: string;
  estimatedTime: string;
}

const mockDeliveries: DeliveryOrder[] = [
  {
    id: "DEL001",
    orderId: "ORD003",
    customer: "Amit Verma",
    customerPhone: "9876543100",
    address: "House 45, Main Road, North Village",
    deliveryBoy: "Ravi Kumar",
    deliveryBoyPhone: "9876543210",
    items: ["Chicken Biryani (Full)", "Raita"],
    total: 200,
    status: "pending_otp",
    otp: "4521",
    estimatedTime: "5 mins"
  },
  {
    id: "DEL002",
    orderId: "ORD008",
    customer: "Sunita Devi",
    customerPhone: "9876543101",
    address: "Shop 12, Market Area, East Village",
    deliveryBoy: "Suresh Singh",
    deliveryBoyPhone: "9876543211",
    items: ["Veg Chowmin (Full)", "Momos (Half)"],
    total: 140,
    status: "arrived",
    otp: "7834",
    estimatedTime: "Arrived"
  },
  {
    id: "DEL003",
    orderId: "ORD010",
    customer: "Rahul Gupta",
    customerPhone: "9876543102",
    address: "Near Temple, West Village",
    deliveryBoy: "Mohan Yadav",
    deliveryBoyPhone: "9876543212",
    items: ["Burger (Large)", "Chilli Potato"],
    total: 180,
    status: "delivered",
    otp: "2156",
    estimatedTime: "Delivered"
  },
  {
    id: "DEL004",
    orderId: "ORD012",
    customer: "Priya Singh",
    customerPhone: "9876543103",
    address: "Hospital Road, Central Area",
    deliveryBoy: "Anil Sharma",
    deliveryBoyPhone: "9876543213",
    items: ["Chicken Roll", "Anda Roll"],
    total: 110,
    status: "cancelled",
    otp: "9023",
    estimatedTime: "-"
  },
];

const statusColors = {
  arrived: "bg-info/20 text-info border-info/30",
  pending_otp: "bg-warning/20 text-warning-foreground border-warning/30",
  delivered: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels = {
  arrived: "Arrived",
  pending_otp: "Pending OTP",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DeliverySystem = () => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(mockDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const handleVerifyOtp = () => {
    if (!selectedDelivery) return;
    
    if (enteredOtp === selectedDelivery.otp) {
      setDeliveries(deliveries.map(d => 
        d.id === selectedDelivery.id 
          ? { ...d, status: "delivered" as const, estimatedTime: "Delivered" }
          : d
      ));
      toast.success("OTP Verified! Order delivered successfully");
      setIsOtpDialogOpen(false);
      setEnteredOtp("");
      setSelectedDelivery(null);
    } else {
      toast.error("Invalid OTP! Please try again");
    }
  };

  const handleCancelDelivery = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id 
        ? { ...d, status: "cancelled" as const, estimatedTime: "-" }
        : d
    ));
    toast.success("Delivery cancelled");
  };

  const handleMarkArrived = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id 
        ? { ...d, status: "arrived" as const, estimatedTime: "Arrived" }
        : d
    ));
    toast.success("Marked as arrived. OTP verification required.");
  };

  const openOtpVerification = (delivery: DeliveryOrder) => {
    setSelectedDelivery(delivery);
    setEnteredOtp("");
    setIsOtpDialogOpen(true);
  };

  const filteredDeliveries = deliveries.filter(d =>
    d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.deliveryBoy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === "pending_otp" || d.status === "arrived").length,
    delivered: deliveries.filter(d => d.status === "delivered").length,
    cancelled: deliveries.filter(d => d.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Delivery System</h1>
        <p className="text-muted-foreground">Track deliveries and verify with OTP</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Deliveries" value={stats.total} icon={Truck} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} change="Needs verification" changeType="negative" />
        <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} changeType="positive" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search deliveries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Deliveries Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((delivery) => (
          <div 
            key={delivery.id} 
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{delivery.orderId}</h3>
                  <Badge variant="outline" className={statusColors[delivery.status]}>
                    {statusLabels[delivery.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{delivery.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">₹{delivery.total}</p>
                <p className="text-xs text-muted-foreground">{delivery.estimatedTime}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{delivery.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {delivery.customerPhone}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {delivery.items.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm mb-3">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{delivery.deliveryBoy}</span>
                <span className="text-muted-foreground">• {delivery.deliveryBoyPhone}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {delivery.status === "pending_otp" && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkArrived(delivery.id)}
                      className="flex-1"
                    >
                      Mark Arrived
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleCancelDelivery(delivery.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {delivery.status === "arrived" && (
                  <>
                    <Button 
                      size="sm"
                      variant="hero"
                      onClick={() => openOtpVerification(delivery)}
                      className="flex-1 gap-1"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Verify OTP
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleCancelDelivery(delivery.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {delivery.status === "delivered" && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Delivered Successfully</span>
                  </div>
                )}
                {delivery.status === "cancelled" && (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Delivery Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              OTP Verification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedDelivery && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">{selectedDelivery.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer</span>
                  <span className="font-medium text-foreground">{selectedDelivery.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">₹{selectedDelivery.total}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Enter 4-Digit OTP from Customer</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="text-center text-2xl font-bold tracking-widest h-14"
              />
              <p className="text-xs text-muted-foreground text-center">
                Ask customer for the OTP sent to their phone
              </p>
            </div>

            <Button 
              onClick={handleVerifyOtp} 
              className="w-full" 
              variant="hero"
              disabled={enteredOtp.length !== 4}
            >
              <ShieldCheck className="w-4 h-4" />
              Verify & Complete Delivery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliverySystem;
