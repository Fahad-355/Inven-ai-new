import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProducts, addProduct, updateProduct, deleteProduct, Product } from "@/lib/data";
import { ProductFormDialog } from "@/components/ProductFormDialog";
import { toast } from "sonner";

export default function Products() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const products = getProducts().filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (p: Product) => { setEditing(p); setDialogOpen(true); };
  const handleDelete = (id: string) => { deleteProduct(id); toast.success("Product deleted"); refresh(); };

  const handleSubmit = (data: { name: string; price: number; quantity: number; category: string }) => {
    if (editing) {
      updateProduct(editing.id, data);
      toast.success("Product updated");
    } else {
      addProduct(data);
      toast.success("Product added");
    }
    refresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your inventory items</p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left font-medium text-muted-foreground py-3 px-4">Product</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-4">Category</th>
                <th className="text-right font-medium text-muted-foreground py-3 px-4">Price</th>
                <th className="text-right font-medium text-muted-foreground py-3 px-4">Qty</th>
                <th className="text-right font-medium text-muted-foreground py-3 px-4">Status</th>
                <th className="text-right font-medium text-muted-foreground py-3 px-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-card-foreground">{p.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.category}</td>
                  <td className="py-3 px-4 text-right text-card-foreground">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-card-foreground">{p.quantity}</td>
                  <td className="py-3 px-4 text-right">
                    {p.quantity < 5 ? (
                      <Badge variant="destructive" className="text-[10px]">Low</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">In Stock</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} onSubmit={handleSubmit} />
    </div>
  );
}
