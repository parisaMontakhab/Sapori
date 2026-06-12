// Verified Unsplash URLs — used only on the Home page.
// Each product has a unique, working food photo.
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1600&q=80";

export const PRODUCT_IMAGES: Record<string, string> = {
  // Margherita Pizza
  "prod-1":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  // Spaghetti Carbonara
  "prod-2":
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  // Bruschetta
  "prod-3":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  // Tiramisu
  "prod-4":
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
  // Lasagna
  "prod-5":
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
  // Caprese Salad
  "prod-6":
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
};

export const FALLBACK_IMAGE = PRODUCT_IMAGES["prod-1"];
