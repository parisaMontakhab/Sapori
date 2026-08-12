import { ApiError, apiFetch } from "@/lib/api";
import { mapProduct, type BackendProduct } from "@/lib/mappers";
import type { Product } from "@/types";

interface ProductsListResponse {
  success: boolean;
  data: {
    products: BackendProduct[];
  };
}

interface ProductDetailResponse {
  status: string;
  data: {
    data: BackendProduct;
  };
}

const PRODUCTS_FETCH_LIMIT = 100;

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch<ProductsListResponse>(
    `/products?limit=${PRODUCTS_FETCH_LIMIT}`,
  );

  return response.data.products.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiFetch<ProductDetailResponse>(`/products/${id}`);
    return mapProduct(response.data.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
