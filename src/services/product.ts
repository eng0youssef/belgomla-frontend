import { apiClient, getAdminToken } from "./api-client";
import { ProductResponse, CreateProductRequest, ApiResponse } from "@/types/api";

export async function getActiveProducts(): Promise<ProductResponse[]> {
  const response = await apiClient<ProductResponse[]>("/public/products");
  return response;
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await apiClient<ProductResponse>(`/public/products/${id}`);
  return response;
}

export async function createProduct(data: CreateProductRequest): Promise<ApiResponse<ProductResponse>> {
  const token = getAdminToken();
  const response = await apiClient<ApiResponse<ProductResponse>>("/admin/products", {
    method: "POST",
    token,
    body: data,
  });
  return response;
}

export async function updateProduct(id: string, data: CreateProductRequest): Promise<ApiResponse<ProductResponse>> {
  const token = getAdminToken();
  const response = await apiClient<ApiResponse<ProductResponse>>(`/admin/products/${id}`, {
    method: "PUT",
    token,
    body: data,
  });
  return response;
}
