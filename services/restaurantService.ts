import { restaurants } from "@/data/restaurants";
import type { Restaurant } from "@/types";

/**
 * Returns all restaurants.
 * Replace the mock implementation with an Express API call when the backend is ready.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  return restaurants;
}

/**
 * Returns a single restaurant by ID, or null if not found.
 */
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  return restaurants.find((restaurant) => restaurant.id === id) ?? null;
}

/**
 * Returns a single restaurant by URL slug, or null if not found.
 */
export async function getRestaurantBySlug(
  slug: string,
): Promise<Restaurant | null> {
  return restaurants.find((restaurant) => restaurant.slug === slug) ?? null;
}

/**
 * Returns featured restaurants for homepage highlights.
 */
export async function getFeaturedRestaurants(): Promise<Restaurant[]> {
  return restaurants.filter((restaurant) => restaurant.featured);
}

/**
 * Returns restaurants that are currently open for delivery.
 */
export async function getOpenRestaurants(): Promise<Restaurant[]> {
  return restaurants.filter((restaurant) => restaurant.isOpen);
}
