import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const CART_KEY = "sapori_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_KEY);
  return data ? (JSON.parse(data) as CartItem[]) : [];
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
