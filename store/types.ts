import type { CartItem } from "@/types";

/**
 * Cart state shape for future client-side state management.
 * Will be wired to Zustand, Redux, or React Context when UI is built.
 */
export interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}

export const initialCartState: CartState = {
  items: [],
  restaurantId: null,
};
