export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isPopular?: boolean;
  allergens?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
