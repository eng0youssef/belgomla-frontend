import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/orders";
import type { CreateOrderRequest, OrderResponse } from "@/types/api";

/**
 * Hook to place a reservation order.
 * Invalidates the carton query on success to refresh the counter.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, CreateOrderRequest>({
    mutationFn: createOrder,
    onSuccess: () => {
      // Refresh carton data to update the live counter
      queryClient.invalidateQueries({ queryKey: ["activeCarton"] });
    },
  });
}
