import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getProducts, getLowStockProducts, getTotalValue, getCategoryData, getStockLevelData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["hsl(234,85%,60%)", "hsl(262,83%,58%)", "hsl(142,72%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(200,80%,50%)"];

export default function Dashboard() {
  const products = getProducts();
  const lowStock = getLowStockProducts();
  const totalValue = getTotalValue();
  const categoryData = getCategoryData();
  const stockData = getStockLevelData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your inventory</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={products.length} subtitle="Items in catalog" icon={Package} />
        <StatCard
          title="Low Stock"
          value={lowStock.length}
          subtitle="Below 5 units"
          icon={AlertTriangle}
          iconClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle="Total retail value"
          icon={DollarSign}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title="Categories"
          value={categoryData.length}
          subtitle="Product categories"
          icon={TrendingUp}
          iconClassName="bg-primary/10 text-primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category value chart */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
          <h3 className="text-sm font-semibold mb-4">Value by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`$${v}`, "Value"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock levels line chart */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Stock Levels</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Quantity per product</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-[10px] text-muted-foreground">Low (&lt;5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: "hsl(234,85%,60%)" }} />
                <span className="text-[10px] text-muted-foreground">Normal</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stockData}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(234,85%,60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(234,85%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [v, "Qty"]}
              />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="hsl(234,85%,60%)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--card))", stroke: "hsl(234,85%,60%)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(234,85%,60%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
        <h3 className="text-sm font-semibold mb-4">Recent Products</h3>
        <div className="divide-y divide-border">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-card-foreground">${p.price.toFixed(2)}</span>
                {p.quantity < 5 ? (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{p.quantity} left</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{p.quantity} in stock</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
