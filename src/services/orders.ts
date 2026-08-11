import type {
  ApiResponse,
  CreateOrderRequest,
  OrderResponse,
} from "@/types/api";
import { apiClient } from "./api-client";

/**
 * Place a new reservation order.
 * Returns the created order with referral code.
 */
export async function createOrder(
  data: CreateOrderRequest
): Promise<OrderResponse> {
  const response = await apiClient<ApiResponse<OrderResponse>>(
    "/public/orders",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل في تسجيل الحجز");
  }

  return response.data;
}
