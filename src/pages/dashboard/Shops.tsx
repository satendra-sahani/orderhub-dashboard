import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/dashboard/StatCard";
import { Store, CheckCircle, XCircle, TrendingUp, Search, Plus, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

interface Shop {
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

const mockShops: Shop[] = [
  { 
    id: "SHP001", 
    name: "Krishna Foods", 
    owner: "Krishna Sharma",
    phone: "9876543220", 
    address: "Main Market, North Village",
    isActive: true, 
    ordersToday: 25, 
    totalOrders: 1240,
    specialties: ["Biryani", "Fried Rice", "Chinese"]
  },
  { 
    id: "SHP002", 
    name: "Sharma Kitchen", 
    owner: "Ramesh Sharma",
    phone: "9876543221", 
    address: "Bus Stand Road, East Village",
    isActive: true, 
    ordersToday: 18, 
    totalOrders: 890,
    specialties: ["Momos", "Chowmin", "Noodles"]
  },
  { 
    id: "SHP003", 
    name: "Village Snacks", 
    owner: "Sunil Verma",
    phone: "9876543222", 
    address: "Temple Road, West Village",
    isActive: true, 
    ordersToday: 30, 
    totalOrders: 1560,
    specialties: ["Gol Gappe", "Chilli Potato", "Snacks"]
  },
  { 
    id: "SHP004", 
    name: "Gupta Corner", 
    owner: "Manoj Gupta",
    phone: "9876543223", 
    address: "School Road, South Village",
    isActive: false, 
    ordersToday: 0, 
    totalOrders: 670,
    specialties: ["Burger", "Rolls", "Fast Food"]
  },
  { 
    id: "SHP005", 
    name: "Desi Delights", 
    owner: "Priya Singh",
    phone: "9876543224", 
    address: "Hospital Road, Central Area",
    isActive: true, 
    ordersToday: 22, 
    totalOrders: 1100,
    specialties: ["Anda Roll", "Chicken Roll", "Egg Items"]
  },
];

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShop, setNewShop] = useState({ 
    name: "", 
    owner: "", 
    phone: "", 
    address: "",
    specialties: "" 
  });

  const handleAddShop = () => {
    if (!newShop.name || !newShop.owner || !newShop.phone || !newShop.address) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const shop: Shop = {
      id: `SHP00${shops.length + 1}`,
      name: newShop.name,
      owner: newShop.owner,
      phone: newShop.phone,
      address: newShop.address,
      isActive: true,
      ordersToday: 0,
      totalOrders: 0,
      specialties: newShop.specialties.split(",").map(s => s.trim()).filter(Boolean),
    };
    
    setShops([...shops, shop]);
    setNewShop({ name: "", owner: "", phone: "", address: "", specialties: "" });
    setIsDialogOpen(false);
    toast.success("Shop added successfully");
  };

  const toggleShopStatus = (id: string) => {
    setShops(shops.map(shop => 
      shop.id === id 
        ? { ...shop, isActive: !shop.isActive }
        : shop
    ));
    toast.success("Shop status updated");
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: shops.length,
    active: shops.filter(s => s.isActive).length,
    inactive: shops.filter(s => !s.isActive).length,
    todayOrders: shops.reduce((sum, s) => sum + s.ordersToday, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shop Management</h1>
          <p className="text-muted-foreground">Manage partner shops for order assignment</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  placeholder="Enter shop name"
                  value={newShop.name}
                  onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner Name *</Label>
                <Input
                  id="owner"
                  placeholder="Enter owner name"
                  value={newShop.owner}
                  onChange={(e) => setNewShop({ ...newShop, owner: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopPhone">Phone Number *</Label>
                <Input
                  id="shopPhone"
                  placeholder="Enter phone number"
                  value={newShop.phone}
                  onChange={(e) => setNewShop({ ...newShop, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter shop address"
                  value={newShop.address}
                  onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input
                  id="specialties"
                  placeholder="e.g., Momos, Biryani, Chinese"
                  value={newShop.specialties}
                  onChange={(e) => setNewShop({ ...newShop, specialties: e.target.value })}
                />
              </div>
              <Button onClick={handleAddShop} className="w-full" variant="hero">
                Add Shop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Shops" value={stats.total} icon={Store} />
        <StatCard title="Active" value={stats.active} icon={CheckCircle} change="Accepting orders" changeType="positive" />
        <StatCard title="Inactive" value={stats.inactive} icon={XCircle} />
        <StatCard title="Today's Orders" value={stats.todayOrders} icon={TrendingUp} change="+15% from yesterday" changeType="positive" />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Shops Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShops.map((shop) => (
          <div 
            key={shop.id} 
            className={`bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 ${!shop.isActive && 'opacity-60'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground">{shop.owner}</p>
                </div>
              </div>
              <Switch 
                checked={shop.isActive} 
                onCheckedChange={() => toggleShopStatus(shop.id)}
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {shop.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {shop.address}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {shop.specialties.map((specialty, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold text-foreground">{shop.ordersToday}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold text-foreground">{shop.totalOrders}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;
