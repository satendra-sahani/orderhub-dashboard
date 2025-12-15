import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from "@/components/dashboard/StatCard";
import { Package, AlertTriangle, CheckCircle, TrendingUp, Search, Plus, Minus } from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

const mockStocks: StockItem[] = [
  { id: "STK001", name: "Burger Patty", category: "Meat", quantity: 150, minStock: 50, unit: "pcs", lastUpdated: "2 hours ago" },
  { id: "STK002", name: "Noodles", category: "Dry Goods", quantity: 80, minStock: 30, unit: "kg", lastUpdated: "1 hour ago" },
  { id: "STK003", name: "Momo Sheets", category: "Frozen", quantity: 25, minStock: 40, unit: "packs", lastUpdated: "3 hours ago" },
  { id: "STK004", name: "Rice", category: "Dry Goods", quantity: 200, minStock: 50, unit: "kg", lastUpdated: "5 hours ago" },
  { id: "STK005", name: "Chicken", category: "Meat", quantity: 15, minStock: 30, unit: "kg", lastUpdated: "30 mins ago" },
  { id: "STK006", name: "Potatoes", category: "Vegetables", quantity: 100, minStock: 40, unit: "kg", lastUpdated: "4 hours ago" },
  { id: "STK007", name: "Cooking Oil", category: "Cooking", quantity: 50, minStock: 20, unit: "liters", lastUpdated: "1 day ago" },
  { id: "STK008", name: "Eggs", category: "Dairy", quantity: 300, minStock: 100, unit: "pcs", lastUpdated: "2 hours ago" },
];

const Stocks = () => {
  const [stocks, setStocks] = useState<StockItem[]>(mockStocks);
  const [searchTerm, setSearchTerm] = useState("");

  const updateStock = (id: string, change: number) => {
    setStocks(stocks.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change), lastUpdated: "Just now" }
        : item
    ));
  };

  const filteredStocks = stocks.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: stocks.length,
    lowStock: stocks.filter(s => s.quantity < s.minStock).length,
    healthy: stocks.filter(s => s.quantity >= s.minStock).length,
    outOfStock: stocks.filter(s => s.quantity === 0).length,
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    const percentage = (quantity / minStock) * 100;
    if (quantity === 0) return { color: "bg-destructive", label: "Out of Stock", textColor: "text-destructive" };
    if (percentage < 100) return { color: "bg-warning", label: "Low Stock", textColor: "text-warning-foreground" };
    return { color: "bg-success", label: "In Stock", textColor: "text-success" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
        <p className="text-muted-foreground">Monitor and manage your inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={stats.total} icon={Package} />
        <StatCard title="Low Stock" value={stats.lowStock} icon={AlertTriangle} change="Needs restock" changeType="negative" />
        <StatCard title="Healthy Stock" value={stats.healthy} icon={CheckCircle} changeType="positive" />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={TrendingUp} changeType="negative" />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stocks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks.map((item) => {
          const status = getStockStatus(item.quantity, item.minStock);
          const percentage = Math.min((item.quantity / item.minStock) * 100, 100);
          
          return (
            <div 
              key={item.id} 
              className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
                <Badge variant="outline" className={`${status.color}/20 ${status.textColor} border-0 text-xs`}>
                  {status.label}
                </Badge>
              </div>
              
              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{item.quantity}</span>
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">Min: {item.minStock} {item.unit}</p>
              </div>

              <Progress value={percentage} className="h-2 mb-3" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.lastUpdated}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => updateStock(item.id, -10)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => updateStock(item.id, 10)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stocks;
