import { useState } from "react";
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
import OrderDetailDialog, { OrderDetail } from "@/components/dashboard/dialogs/OrderDetailDialog";
import ShopDetailDialog, { ShopDetail } from "@/components/dashboard/dialogs/ShopDetailDialog";
import DeliveryBoyDetailDialog, { DeliveryBoyDetail } from "@/components/dashboard/dialogs/DeliveryBoyDetailDialog";
import CustomerDetailDialog, { CustomerDetail } from "@/components/dashboard/dialogs/CustomerDetailDialog";
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";

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
  time: string;
  otp?: string;
}

const mockOrders: Order[] = [
  { id: "ORD001", customer: "Rajesh Kumar", customerPhone: "9876543201", customerAddress: "Main Market, North", items: ["Burger", "Chowmin"], total: 180, status: "pending", shop: null, deliveryBoy: null, time: "10:30 AM" },
  { id: "ORD002", customer: "Priya Singh", customerPhone: "9876543202", customerAddress: "Bus Stand Road", items: ["Momos", "Fried Rice"], total: 220, status: "preparing", shop: "Krishna Foods", deliveryBoy: null, time: "10:25 AM" },
  { id: "ORD003", customer: "Amit Verma", customerPhone: "9876543203", customerAddress: "Temple Road", items: ["Biryani"], total: 150, status: "out_for_delivery", shop: "Sharma Kitchen", deliveryBoy: "Ravi Kumar", time: "10:15 AM", otp: "4521" },
  { id: "ORD004", customer: "Sunita Devi", customerPhone: "9876543204", customerAddress: "School Road", items: ["Gol Gappe", "Chilli Potato"], total: 120, status: "delivered", shop: "Village Snacks", deliveryBoy: "Suresh Singh", time: "09:45 AM" },
  { id: "ORD005", customer: "Vikram Yadav", customerPhone: "9876543205", items: ["Chicken Roll", "Anda Roll"], total: 200, status: "cancelled", shop: null, deliveryBoy: null, time: "09:30 AM" },
  { id: "ORD006", customer: "Meena Kumari", customerPhone: "9876543206", customerAddress: "Hospital Road", items: ["Momos", "Chowmin"], total: 160, status: "pending", shop: null, deliveryBoy: null, time: "10:45 AM" },
];

const mockShopsData: Record<string, ShopDetail> = {
  "Krishna Foods": { id: "SHP001", name: "Krishna Foods", owner: "Krishna Sharma", phone: "9876543220", address: "Main Market, North Village", isActive: true, ordersToday: 25, totalOrders: 1240, specialties: ["Biryani", "Fried Rice", "Chinese"] },
  "Sharma Kitchen": { id: "SHP002", name: "Sharma Kitchen", owner: "Ramesh Sharma", phone: "9876543221", address: "Bus Stand Road, East Village", isActive: true, ordersToday: 18, totalOrders: 890, specialties: ["Momos", "Chowmin", "Noodles"] },
  "Village Snacks": { id: "SHP003", name: "Village Snacks", owner: "Sunil Verma", phone: "9876543222", address: "Temple Road, West Village", isActive: true, ordersToday: 30, totalOrders: 1560, specialties: ["Gol Gappe", "Chilli Potato", "Snacks"] },
  "Gupta Corner": { id: "SHP004", name: "Gupta Corner", owner: "Manoj Gupta", phone: "9876543223", address: "School Road, South Village", isActive: false, ordersToday: 0, totalOrders: 670, specialties: ["Burger", "Rolls", "Fast Food"] },
  "Desi Delights": { id: "SHP005", name: "Desi Delights", owner: "Priya Singh", phone: "9876543224", address: "Hospital Road, Central Area", isActive: true, ordersToday: 22, totalOrders: 1100, specialties: ["Anda Roll", "Chicken Roll", "Egg Items"] },
};

const mockDeliveryBoysData: Record<string, DeliveryBoyDetail> = {
  "Ravi Kumar": { id: "DB001", name: "Ravi Kumar", phone: "9876543210", status: "on_delivery", ordersToday: 8, totalOrders: 456, rating: 4.8, area: "North Village" },
  "Suresh Singh": { id: "DB002", name: "Suresh Singh", phone: "9876543211", status: "available", ordersToday: 12, totalOrders: 523, rating: 4.9, area: "East Village" },
  "Mohan Yadav": { id: "DB003", name: "Mohan Yadav", phone: "9876543212", status: "available", ordersToday: 6, totalOrders: 312, rating: 4.5, area: "West Village" },
  "Anil Sharma": { id: "DB004", name: "Anil Sharma", phone: "9876543213", status: "on_delivery", ordersToday: 10, totalOrders: 489, rating: 4.7, area: "South Village" },
  "Deepak Verma": { id: "DB005", name: "Deepak Verma", phone: "9876543214", status: "offline", ordersToday: 0, totalOrders: 234, rating: 4.6, area: "Central Area" },
};

const mockShops = ["Krishna Foods", "Sharma Kitchen", "Village Snacks", "Gupta Corner", "Desi Delights"];
const mockDeliveryBoys = ["Ravi Kumar", "Suresh Singh", "Mohan Yadav", "Anil Sharma", "Deepak Verma"];

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

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedShop, setSelectedShop] = useState<ShopDetail | null>(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<DeliveryBoyDetail | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);

  const handleAssignShop = (orderId: string, shop: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, shop, status: "preparing" as const }
        : order
    ));
  };

  const handleAssignDelivery = (orderId: string, deliveryBoy: string) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, deliveryBoy, status: "out_for_delivery" as const, otp }
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

  // Click handlers
  const handleOrderClick = (order: Order) => {
    setSelectedOrder({
      ...order,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
    });
  };

  const handleShopClick = (shopName: string) => {
    const shop = mockShopsData[shopName];
    if (shop) setSelectedShop(shop);
  };

  const handleDeliveryBoyClick = (name: string) => {
    const boy = mockDeliveryBoysData[name];
    if (boy) setSelectedDeliveryBoy(boy);
  };

  const handleCustomerClick = (order: Order) => {
    setSelectedCustomer({
      id: `CUST${order.id.slice(3)}`,
      name: order.customer,
      phone: order.customerPhone || "N/A",
      address: order.customerAddress,
      totalOrders: Math.floor(Math.random() * 20) + 1,
      joinedDate: "Nov 2024",
    });
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
                <TableHead>Shop</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell>
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="font-medium text-primary hover:underline cursor-pointer"
                    >
                      {order.id}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleCustomerClick(order)}
                      className="text-foreground hover:text-primary hover:underline cursor-pointer"
                    >
                      {order.customer}
                    </button>
                  </TableCell>
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
                      <button
                        onClick={() => handleShopClick(order.shop!)}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                      >
                        {order.shop}
                      </button>
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
                      <button
                        onClick={() => handleDeliveryBoyClick(order.deliveryBoy!)}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                      >
                        {order.deliveryBoy}
                      </button>
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

      {/* Detail Dialogs */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
      <ShopDetailDialog
        shop={selectedShop}
        open={!!selectedShop}
        onOpenChange={(open) => !open && setSelectedShop(null)}
      />
      <DeliveryBoyDetailDialog
        deliveryBoy={selectedDeliveryBoy}
        open={!!selectedDeliveryBoy}
        onOpenChange={(open) => !open && setSelectedDeliveryBoy(null)}
      />
      <CustomerDetailDialog
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      />
    </div>
  );
};

export default Orders;
