import type {
  ApiResponse,
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerAuthResponse,
  CustomerDashboardResponse,
  UpdateCustomerProfileRequest,
} from "@/types/api";
import {
  apiClient,
  getCustomerToken,
  setCustomerToken,
} from "./api-client";

/**
 * Customer login — returns JWT token and customer details.
 */
export async function customerLogin(
  credentials: CustomerLoginRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/login",
    {
      method: "POST",
      body: credentials,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "بيانات الدخول غلط");
  }

  setCustomerToken(response.data.token);
  return response.data;
}

/**
 * Customer register — creates a new account or adds password to existing one.
 */
export async function customerRegister(
  data: CustomerRegisterRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/register",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تسجيل الحساب");
  }

  setCustomerToken(response.data.token);
  return response.data;
}

/**
 * Fetch customer dashboard data (requires customer token).
 */
export async function getCustomerDashboard(): Promise<CustomerDashboardResponse> {
  const token = getCustomerToken();
  const response = await apiClient<ApiResponse<CustomerDashboardResponse>>(
    "/customer/me",
    { token }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تحميل لوحة التحكم");
  }

  return response.data;
}

/**
 * Update customer profile.
 */
export async function updateCustomerProfile(
  data: UpdateCustomerProfileRequest
): Promise<boolean> {
  const token = getCustomerToken();
  const response = await apiClient<ApiResponse<boolean>>(
    "/customer/me/profile",
    {
      method: "PUT",
      body: data,
      token,
    }
  );

  if (!response.success) {
    throw new Error(response.message || "فشل تحديث البيانات");
  }

  return response.data ?? false;
}

/**
 * Cancel a customer's order.
 */
export async function cancelCustomerOrder(orderId: string): Promise<void> {
  const token = getCustomerToken();
  if (!token) throw new Error("غير مصرح");

  await apiClient(`/customer/me/orders/${orderId}/cancel`, {
    method: "DELETE",
    token,
  });
}