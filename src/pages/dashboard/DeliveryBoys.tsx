import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/dashboard/StatCard";
import { Truck, UserCheck, Clock, Star, Search, Plus, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  status: "available" | "on_delivery" | "offline";
  ordersToday: number;
  totalOrders: number;
  rating: number;
  area: string;
}

const mockDeliveryBoys: DeliveryBoy[] = [
  { id: "DB001", name: "Ravi Kumar", phone: "9876543210", status: "available", ordersToday: 8, totalOrders: 456, rating: 4.8, area: "North Village" },
  { id: "DB002", name: "Suresh Singh", phone: "9876543211", status: "on_delivery", ordersToday: 12, totalOrders: 523, rating: 4.9, area: "East Village" },
  { id: "DB003", name: "Mohan Yadav", phone: "9876543212", status: "available", ordersToday: 6, totalOrders: 312, rating: 4.5, area: "West Village" },
  { id: "DB004", name: "Anil Sharma", phone: "9876543213", status: "on_delivery", ordersToday: 10, totalOrders: 489, rating: 4.7, area: "South Village" },
  { id: "DB005", name: "Deepak Verma", phone: "9876543214", status: "offline", ordersToday: 0, totalOrders: 234, rating: 4.6, area: "Central Area" },
  { id: "DB006", name: "Rahul Gupta", phone: "9876543215", status: "available", ordersToday: 5, totalOrders: 178, rating: 4.4, area: "Market Area" },
];

const statusColors = {
  available: "bg-success/20 text-success border-success/30",
  on_delivery: "bg-primary/20 text-primary border-primary/30",
  offline: "bg-muted text-muted-foreground border-muted",
};

const statusLabels = {
  available: "Available",
  on_delivery: "On Delivery",
  offline: "Offline",
};

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>(mockDeliveryBoys);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoy, setNewBoy] = useState({ name: "", phone: "", area: "" });

  const handleAddDeliveryBoy = () => {
    if (!newBoy.name || !newBoy.phone || !newBoy.area) {
      toast.error("Please fill all fields");
      return;
    }
    
    const newDeliveryBoy: DeliveryBoy = {
      id: `DB00${deliveryBoys.length + 1}`,
      name: newBoy.name,
      phone: newBoy.phone,
      status: "available",
      ordersToday: 0,
      totalOrders: 0,
      rating: 5.0,
      area: newBoy.area,
    };
    
    setDeliveryBoys([...deliveryBoys, newDeliveryBoy]);
    setNewBoy({ name: "", phone: "", area: "" });
    setIsDialogOpen(false);
    toast.success("Delivery boy added successfully");
  };

  const toggleStatus = (id: string) => {
    setDeliveryBoys(deliveryBoys.map(boy => 
      boy.id === id 
        ? { ...boy, status: boy.status === "offline" ? "available" : "offline" }
        : boy
    ));
  };

  const filteredBoys = deliveryBoys.filter(boy =>
    boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: deliveryBoys.length,
    available: deliveryBoys.filter(b => b.status === "available").length,
    onDelivery: deliveryBoys.filter(b => b.status === "on_delivery").length,
    offline: deliveryBoys.filter(b => b.status === "offline").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Delivery Partners</h1>
          <p className="text-muted-foreground">Manage your delivery team</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Delivery Partner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newBoy.name}
                  onChange={(e) => setNewBoy({ ...newBoy, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newBoy.phone}
                  onChange={(e) => setNewBoy({ ...newBoy, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Delivery Area</Label>
                <Input
                  id="area"
                  placeholder="Enter delivery area"
                  value={newBoy.area}
                  onChange={(e) => setNewBoy({ ...newBoy, area: e.target.value })}
                />
              </div>
              <Button onClick={handleAddDeliveryBoy} className="w-full" variant="hero">
                Add Partner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Partners" value={stats.total} icon={Truck} />
        <StatCard title="Available" value={stats.available} icon={UserCheck} change="Ready to deliver" changeType="positive" />
        <StatCard title="On Delivery" value={stats.onDelivery} icon={Clock} />
        <StatCard title="Offline" value={stats.offline} icon={Star} />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoys.map((boy) => (
          <div 
            key={boy.id} 
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                  {boy.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{boy.name}</h3>
                    <p className="text-sm text-muted-foreground">{boy.id}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[boy.status]}>
                    {statusLabels[boy.status]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {boy.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {boy.area}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-foreground font-medium">{boy.rating}</span>
                <span className="text-muted-foreground">• {boy.totalOrders} total orders</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <p className="text-xl font-bold text-foreground">{boy.ordersToday}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleStatus(boy.id)}
              >
                {boy.status === "offline" ? "Set Available" : "Set Offline"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoys;
