import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const CART_KEY = "sapori_cart";
const EMPTY_CART: CartItem[] = [];
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const LEGACY_MOCK_ID_PATTERN = /^prod-\d+$/;

type CartListener = () => void;
const listeners = new Set<CartListener>();

let cartSnapshot: CartItem[] = EMPTY_CART;
let snapshotHydrated = false;

export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyCartChange(): void {
  listeners.forEach((listener) => listener());
}

function hydrateSnapshot(): void {
  if (typeof window === "undefined") return;

  const data = localStorage.getItem(CART_KEY);
  cartSnapshot = data ? (JSON.parse(data) as CartItem[]) : EMPTY_CART;
  snapshotHydrated = true;
}

/** Stable snapshot for useSyncExternalStore — same reference until the cart changes. */
export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  if (!snapshotHydrated) hydrateSnapshot();
  return cartSnapshot;
}

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function isInCart(productId: string): boolean {
  return getCart().some((item) => item.productId === productId);
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  if (!snapshotHydrated) hydrateSnapshot();
  return cartSnapshot;
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  cartSnapshot = items.length === 0 ? EMPTY_CART : [...items];
  snapshotHydrated = true;
  notifyCartChange();
}

export function addToCart(product: Product): void {
  const cart = [...getCart()];
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

export function updateCartItemQuantity(
  productId: string,
  quantity: number,
): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart().map((entry) =>
    entry.productId === productId ? { ...entry, quantity } : entry,
  );
  const item = cart.find((entry) => entry.productId === productId);

  if (item) {
    saveCart(cart);
  }
}

export function getCartItemCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  cartSnapshot = EMPTY_CART;
  snapshotHydrated = true;
  notifyCartChange();
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function isValidCartProductId(productId: string): boolean {
  return OBJECT_ID_PATTERN.test(productId);
}

export function getStaleCartItems(items: CartItem[]): CartItem[] {
  return items.filter(
    (item) =>
      LEGACY_MOCK_ID_PATTERN.test(item.productId) ||
      !OBJECT_ID_PATTERN.test(item.productId),
  );
}

export function removeStaleCartItems(): number {
  const cart = getCart();
  const valid = cart.filter((item) => isValidCartProductId(item.productId));
  const removed = cart.length - valid.length;

  if (removed > 0) {
    saveCart(valid);
  }

  return removed;
}
