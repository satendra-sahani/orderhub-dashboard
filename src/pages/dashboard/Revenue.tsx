import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { IndianRupee, TrendingUp, ShoppingBag, Users, Calendar } from "lucide-react";

const revenueData = [
  { name: "Mon", revenue: 4500, orders: 45 },
  { name: "Tue", revenue: 5200, orders: 52 },
  { name: "Wed", revenue: 4800, orders: 48 },
  { name: "Thu", revenue: 6100, orders: 61 },
  { name: "Fri", revenue: 7500, orders: 75 },
  { name: "Sat", revenue: 8200, orders: 82 },
  { name: "Sun", revenue: 7800, orders: 78 },
];

const topItems = [
  { name: "Momos", sales: 320, revenue: 32000 },
  { name: "Biryani", sales: 280, revenue: 42000 },
  { name: "Chowmin", sales: 250, revenue: 25000 },
  { name: "Burger", sales: 220, revenue: 22000 },
  { name: "Fried Rice", sales: 180, revenue: 18000 },
];

const categoryData = [
  { name: "Fast Food", value: 35, color: "hsl(24, 95%, 53%)" },
  { name: "Chinese", value: 28, color: "hsl(142, 70%, 45%)" },
  { name: "Indian", value: 22, color: "hsl(200, 80%, 50%)" },
  { name: "Snacks", value: 15, color: "hsl(45, 93%, 47%)" },
];

const Revenue = () => {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue</h1>
          <p className="text-muted-foreground">Track your earnings and sales performance</p>
        </div>
        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="₹44,100" 
          icon={IndianRupee} 
          change="+18% from last week" 
          changeType="positive" 
        />
        <StatCard 
          title="Total Orders" 
          value="441" 
          icon={ShoppingBag} 
          change="+12% from last week" 
          changeType="positive" 
        />
        <StatCard 
          title="Avg Order Value" 
          value="₹100" 
          icon={TrendingUp} 
          change="+5% from last week" 
          changeType="positive" 
        />
        <StatCard 
          title="Active Customers" 
          value="286" 
          icon={Users} 
          change="+8% from last week" 
          changeType="positive" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [`₹${value}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(24, 95%, 53%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-sm text-muted-foreground">₹{item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.sales / 320) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-20 text-right">
                  {item.sales} sold
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Revenue;
