import { categories } from "@/data/categories";
import { menuItems } from "@/data/menuItems";
import type { Category, MenuItem } from "@/types";

/**
 * Returns all menu items for a given restaurant.
 */
export async function getMenuItemsByRestaurant(
  restaurantId: string,
): Promise<MenuItem[]> {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}

/**
 * Returns a single menu item by ID, or null if not found.
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  return menuItems.find((item) => item.id === id) ?? null;
}

/**
 * Returns all food categories.
 */
export async function getCategories(): Promise<Category[]> {
  return categories;
}

/**
 * Returns a single category by ID, or null if not found.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  return categories.find((category) => category.id === id) ?? null;
}

/**
 * Returns menu items for a restaurant filtered by category.
 */
export async function getMenuItemsByRestaurantAndCategory(
  restaurantId: string,
  categoryId: string,
): Promise<MenuItem[]> {
  return menuItems.filter(
    (item) =>
      item.restaurantId === restaurantId && item.categoryId === categoryId,
  );
}
