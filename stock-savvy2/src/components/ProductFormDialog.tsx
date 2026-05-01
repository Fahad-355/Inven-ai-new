import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/lib/data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: { name: string; price: number; quantity: number; category: string }) => void;
}

export function ProductFormDialog({ open, onOpenChange, product, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setQuantity(String(product.quantity));
      setCategory(product.category);
    } else {
      setName("");
      setPrice("");
      setQuantity("");
      setCategory("");
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, price: parseFloat(price) || 0, quantity: parseInt(quantity) || 0, category });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Wireless Mouse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
              <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qty" className="text-sm font-medium">Quantity</Label>
              <Input id="qty" type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="0" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat" className="text-sm font-medium">Category</Label>
            <Input id="cat" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Electronics" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{product ? "Save Changes" : "Add Product"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
