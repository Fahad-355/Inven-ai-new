import { AlertTriangle, Package, TrendingDown, ShieldAlert, RefreshCw } from "lucide-react";
import { getLowStockProducts, getProducts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function LowStock() {
  const items = getLowStockProducts();
  const totalProducts = getProducts().length;
  const criticalCount = items.filter((p) => p.quantity <= 1).length;
  const warningCount = items.filter((p) => p.quantity > 1 && p.quantity < 5).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Low Stock Alerts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and manage products that need restocking
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{items.length}</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical (≤ 1 unit)</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{warningCount}</p>
              <p className="text-xs text-muted-foreground">Warning (2-4 units)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock health bar */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-card-foreground">Inventory Health</p>
          <p className="text-xs text-muted-foreground">
            {totalProducts - items.length} of {totalProducts} products well-stocked
          </p>
        </div>
        <Progress value={((totalProducts - items.length) / totalProducts) * 100} className="h-2.5" />
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">Needs Attention</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="bg-card rounded-xl p-16 shadow-card border border-border/50 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">All products are well-stocked</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Great job! None of your products are below the minimum threshold.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            {items.length} product{items.length !== 1 && "s"} below threshold
          </p>
          <div className="grid gap-2.5">
            {items
              .sort((a, b) => a.quantity - b.quantity)
              .map((p) => {
                const isCritical = p.quantity <= 1;
                return (
                  <div
                    key={p.id}
                    className="bg-card rounded-xl p-4 shadow-card border border-border/50 flex items-center justify-between animate-fade-in hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isCritical ? "bg-destructive/10" : "bg-orange-500/10"
                      }`}>
                        <AlertTriangle className={`h-4.5 w-4.5 ${
                          isCritical ? "text-destructive" : "text-orange-500"
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.category} · ${p.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-1">
                        <p className="text-xs text-muted-foreground">Stock Level</p>
                        <div className="w-20 mt-1">
                          <Progress value={(p.quantity / 5) * 100} className="h-1.5" />
                        </div>
                      </div>
                      <Badge
                        variant={isCritical ? "destructive" : "secondary"}
                        className="text-xs min-w-[60px] justify-center"
                      >
                        {p.quantity} left
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
