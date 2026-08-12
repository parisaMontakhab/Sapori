export const queryKeys = {
  products: {
    all: ["products"] as const,
    detail: (id: string) => ["products", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
};
