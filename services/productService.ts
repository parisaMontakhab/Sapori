import { ApiError, apiFetch } from "@/lib/api";
import { mapProduct, type BackendProduct } from "@/lib/mappers";
import type { Product } from "@/types";

interface ProductsListResponse {
  success: boolean;
  results: number;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
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
export const MENU_PAGE_SIZE = 6;

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface PaginatedProducts {
  products: Product[];
  results: number;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

function buildProductsQuery(params: ProductsQueryParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? MENU_PAGE_SIZE));

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  return searchParams.toString();
}

export async function getProductsPaginated(
  params: ProductsQueryParams = {},
): Promise<PaginatedProducts> {
  const response = await apiFetch<ProductsListResponse>(
    `/products?${buildProductsQuery(params)}`,
  );

  return {
    products: response.data.products.map(mapProduct),
    results: response.results,
    page: response.page,
    limit: response.limit,
    totalProducts: response.totalProducts,
    totalPages: response.totalPages,
  };
}

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
