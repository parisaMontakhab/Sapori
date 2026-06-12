import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Margherita Pizza",
    description: "Tomato, mozzarella, and fresh basil.",
    price: 10,
    imageUrl: "/images/margherita.jpg",
    category: "Pizza",
  },
  {
    id: "prod-2",
    name: "Spaghetti Carbonara",
    description: "Egg, pecorino, guanciale, and black pepper.",
    price: 14,
    imageUrl: "/images/carbonara.jpg",
    category: "Pasta",
  },
  {
    id: "prod-3",
    name: "Bruschetta",
    description: "Grilled bread with tomato, garlic, and olive oil.",
    price: 7,
    imageUrl: "/images/bruschetta.jpg",
    category: "Antipasti",
  },
  {
    id: "prod-4",
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers with mascarpone cream.",
    price: 8,
    imageUrl: "/images/tiramisu.jpg",
    category: "Dolci",
  },
  {
    id: "prod-5",
    name: "Lasagna",
    description: "Layers of pasta, ragù, and béchamel.",
    price: 15,
    imageUrl: "/images/lasagna.jpg",
    category: "Pasta",
  },
  {
    id: "prod-6",
    name: "Caprese Salad",
    description: "Tomato, mozzarella, and basil with olive oil.",
    price: 9,
    imageUrl: "/images/caprese.jpg",
    category: "Insalate",
  },
];
