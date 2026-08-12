"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getProductById, getProducts } from "@/services/productService";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ""),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}
