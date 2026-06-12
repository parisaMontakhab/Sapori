import { products } from "@/data/products";
import type { Product } from "@/types";

// TODO: Replace with GET /api/products
export async function getProducts(): Promise<Product[]> {
  return products;
}

// TODO: Replace with GET /api/products/:id
export async function getProductById(id: string): Promise<Product | null> {
  return products.find((product) => product.id === id) ?? null;
}
