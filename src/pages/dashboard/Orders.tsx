import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  shop: string | null;
  deliveryBoy: string | null;
  time: string;
}

const mockOrders: Order[] = [
  { id: "ORD001", customer: "Rajesh Kumar", items: ["Burger", "Chowmin"], total: 180, status: "pending", shop: null, deliveryBoy: null, time: "10:30 AM" },
  { id: "ORD002", customer: "Priya Singh", items: ["Momos", "Fried Rice"], total: 220, status: "preparing", shop: "Krishna Foods", deliveryBoy: null, time: "10:25 AM" },
  { id: "ORD003", customer: "Amit Verma", items: ["Biryani"], total: 150, status: "out_for_delivery", shop: "Sharma Kitchen", deliveryBoy: "Ravi", time: "10:15 AM" },
  { id: "ORD004", customer: "Sunita Devi", items: ["Gol Gappe", "Chilli Potato"], total: 120, status: "delivered", shop: "Village Snacks", deliveryBoy: "Suresh", time: "09:45 AM" },
  { id: "ORD005", customer: "Vikram Yadav", items: ["Chicken Roll", "Anda Roll"], total: 200, status: "cancelled", shop: null, deliveryBoy: null, time: "09:30 AM" },
  { id: "ORD006", customer: "Meena Kumari", items: ["Momos", "Chowmin"], total: 160, status: "pending", shop: null, deliveryBoy: null, time: "10:45 AM" },
];

const mockShops = ["Krishna Foods", "Sharma Kitchen", "Village Snacks", "Gupta Corner", "Desi Delights"];
const mockDeliveryBoys = ["Ravi", "Suresh", "Mohan", "Anil", "Deepak"];

const statusColors = {
  pending: "bg-warning/20 text-warning-foreground border-warning/30",
  preparing: "bg-info/20 text-info border-info/30",
  out_for_delivery: "bg-primary/20 text-primary border-primary/30",
  delivered: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleAssignShop = (orderId: string, shop: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, shop, status: "preparing" as const }
        : order
    ));
  };

  const handleAssignDelivery = (orderId: string, deliveryBoy: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, deliveryBoy, status: "out_for_delivery" as const }
        : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage and assign orders to shops</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} change="Needs attention" changeType="negative" />
        <StatCard title="Delivered" value={stats.delivered} icon={CheckCircle} change="+12% today" changeType="positive" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
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

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assign Shop</TableHead>
                <TableHead>Assign Delivery</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.shop ? (
                      <span className="text-sm text-muted-foreground">{order.shop}</span>
                    ) : order.status === "pending" ? (
                      <Select onValueChange={(value) => handleAssignShop(order.id, value)}>
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockShops.map(shop => (
                            <SelectItem key={shop} value={shop}>{shop}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.deliveryBoy ? (
                      <span className="text-sm text-muted-foreground">{order.deliveryBoy}</span>
                    ) : order.status === "preparing" ? (
                      <Select onValueChange={(value) => handleAssignDelivery(order.id, value)}>
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDeliveryBoys.map(boy => (
                            <SelectItem key={boy} value={boy}>{boy}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
