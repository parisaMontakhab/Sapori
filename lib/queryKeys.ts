export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params: {
      page: number;
      limit: number;
      search?: string;
      category?: string;
    }) => ["products", params] as const,
    detail: (id: string) => ["products", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    product: (productId: string) => ["reviews", productId] as const,
  },
};
