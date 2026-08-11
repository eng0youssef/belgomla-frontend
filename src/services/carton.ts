import type { ApiResponse, ActiveCartonResponse } from "@/types/api";
import { apiClient, getAdminToken } from "./api-client";

// ─── Admin Carton Types ───────────────────────────────────────

export interface AdminCartonDetail {
  id: string;
  cartonNumber: number;
  confirmedCount: number;
  capacity: number;
  status: string;
  createdAt: string;
  filledAt?: string | null;
  progressPercent: number;
}

export interface AdminCartonsResponse {
  success: boolean;
  data: AdminCartonDetail[];
  count: number;
}

export type CartonStatusTransition =
  | "Purchased"
  | "Delivered"
  | "Cancelled";

// ─── Fetch admin cartons by product ──────────────────────────

/**
 * Get all cartons for a product (admin view — all statuses).
 */
export async function getAdminCartonsByProduct(
  productId: string
): Promise<AdminCartonDetail[]> {
  const token = getAdminToken();
  const response = await apiClient<AdminCartonsResponse>(
    `/admin/cartons/product/${productId}`,
    { token }
  );

  if (!response.success) {
    throw new Error("فشل جلب بيانات الكراتين");
  }

  return response.data;
}

// ─── Update carton status (lifecycle transition) ──────────────

/**
 * Advance a carton to the next lifecycle status.
 * Valid transitions:
 *   Open      → Cancelled
 *   Filled    → Purchased | Cancelled
 *   Purchased → Delivered | Cancelled
 */
export async function updateCartonStatus(
  cartonId: string,
  newStatus: CartonStatusTransition
): Promise<void> {
  const token = getAdminToken();
  await apiClient<unknown>(`/admin/cartons/${cartonId}/status`, {
    method: "PATCH",
    token,
    body: { status: newStatus },
  });
}

// ─── Manual overrides (Admin) ──────────────────────────────────

export async function updateCartonCounter(
  cartonId: string,
  confirmedCount: number
): Promise<void> {
  const token = getAdminToken();
  await apiClient<unknown>(`/admin/cartons/${cartonId}/counter`, {
    method: "PATCH",
    token,
    body: { confirmedCount },
  });
}

export async function forceCreateCarton(productId: string): Promise<void> {
  const token = getAdminToken();
  await apiClient<unknown>(`/admin/cartons/product/${productId}/force-create`, {
    method: "POST",
    token,
  });
}

// ─── Public carton for product (customer-facing progress) ─────

/**
 * Fetch the active open carton for a product (public endpoint).
 */
export async function getActiveCarton(
  productId: string
): Promise<ActiveCartonResponse | null> {

  try {
    const response = await apiClient<ApiResponse<ActiveCartonResponse | null>>(
      `/public/cartons/${productId}`
    );

    if (!response.success) {
      throw new Error(response.message || "فشل تحميل بيانات الكارتونة");
    }

    return response.data ?? null;
  } catch (error) {
    throw new Error("فشل تحميل بيانات الكارتونة");
  }
}
