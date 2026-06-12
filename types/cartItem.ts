export interface CartItem {
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
