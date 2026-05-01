// Mock product data and state management
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  createdAt: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", price: 79.99, quantity: 12, category: "Electronics", createdAt: "2026-04-01" },
  { id: "2", name: "Organic Coffee Beans", price: 14.99, quantity: 3, category: "Food", createdAt: "2026-04-02" },
  { id: "3", name: "Leather Wallet", price: 45.00, quantity: 28, category: "Accessories", createdAt: "2026-04-03" },
  { id: "4", name: "Ceramic Mug Set", price: 24.99, quantity: 2, category: "Home", createdAt: "2026-04-03" },
  { id: "5", name: "Running Shoes", price: 129.99, quantity: 7, category: "Footwear", createdAt: "2026-04-04" },
  { id: "6", name: "Notebook Pack", price: 9.99, quantity: 45, category: "Stationery", createdAt: "2026-04-05" },
  { id: "7", name: "Bluetooth Speaker", price: 59.99, quantity: 4, category: "Electronics", createdAt: "2026-04-05" },
  { id: "8", name: "Scented Candle", price: 18.50, quantity: 1, category: "Home", createdAt: "2026-04-06" },
  { id: "9", name: "Sunglasses", price: 34.99, quantity: 15, category: "Accessories", createdAt: "2026-04-06" },
  { id: "10", name: "Yoga Mat", price: 29.99, quantity: 9, category: "Fitness", createdAt: "2026-04-07" },
];

let products = [...initialProducts];
let nextId = 11;

export function getProducts(): Product[] {
  return [...products];
}

export function addProduct(data: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...data,
    id: String(nextId++),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  products = [product, ...products];
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const len = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < len;
}

export function getLowStockProducts(threshold = 5): Product[] {
  return products.filter((p) => p.quantity < threshold);
}

export function getTotalValue(): number {
  return products.reduce((sum, p) => sum + p.price * p.quantity, 0);
}

// Chart data helpers
export function getCategoryData() {
  const map = new Map<string, { count: number; value: number }>();
  for (const p of products) {
    const existing = map.get(p.category) || { count: 0, value: 0 };
    map.set(p.category, { count: existing.count + p.quantity, value: existing.value + p.price * p.quantity });
  }
  return Array.from(map, ([name, data]) => ({ name, items: data.count, value: Math.round(data.value) }));
}

export function getStockLevelData() {
  return products.map((p) => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name, quantity: p.quantity }));
}
