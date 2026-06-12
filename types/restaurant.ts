import type { Address } from "./address";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  categoryIds: string[];
  imageUrl: string;
  coverImageUrl?: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minimumOrder: number;
  address: Address;
  isOpen: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
