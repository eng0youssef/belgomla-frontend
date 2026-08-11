import type {
  ApiResponse,
  AdminLoginRequest,
  LoginResponse,
  PendingOrderResponse,
  DepositConfirmationResponse,
} from "@/types/api";
import {
  apiClient,
  getAdminToken,
  setAdminToken,
} from "./api-client";

/**
 * Admin login — returns JWT token.
 */
export async function adminLogin(
  credentials: AdminLoginRequest
): Promise<LoginResponse> {
  const response = await apiClient<ApiResponse<LoginResponse>>(
    "/admin/auth/login",
    {
      method: "POST",
      body: credentials,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "بيانات الدخول غلط");
  }

  setAdminToken(response.data.token);
  return response.data;
}

/**
 * Fetch all orders pending deposit confirmation.
 */
export async function getPendingOrders(): Promise<PendingOrderResponse[]> {
  const token = getAdminToken();
  const response = await apiClient<ApiResponse<PendingOrderResponse[]>>(
    "/admin/orders/pending",
    { token }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تحميل الطلبات");
  }

  return response.data;
}

/**
 * Confirm a customer's deposit — the primary admin action.
 */
export async function confirmDeposit(
  orderId: string
): Promise<DepositConfirmationResponse> {
  const token = getAdminToken();
  const response = await apiClient<ApiResponse<DepositConfirmationResponse>>(
    `/admin/orders/${orderId}/confirm-deposit`,
    {
      method: "POST",
      token,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تأكيد العربون");
  }

  return response.data;
}
