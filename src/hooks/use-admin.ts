import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  getPendingOrders,
  confirmDeposit,
} from "@/services/admin";
import { getAdminToken } from "@/services/api-client";
import { useMounted } from "./use-mounted";
import type {
  AdminLoginRequest,
  LoginResponse,
  PendingOrderResponse,
  DepositConfirmationResponse,
} from "@/types/api";
import { OrderStatus } from "@/types/api";

/**
 * Hook for admin login.
 */
export function useAdminLogin() {
  return useMutation<LoginResponse, Error, AdminLoginRequest>({
    mutationFn: adminLogin,
  });
}

/**
 * Hook to fetch pending orders (admin).
 */
export function usePendingOrders() {
  const mounted = useMounted();
  return useQuery<PendingOrderResponse[]>({
    queryKey: ["pendingOrders"],
    queryFn: getPendingOrders,
    refetchInterval: 30 * 1000,
    enabled: mounted && !!getAdminToken(),
    retry: (failureCount, error) => {
      // Do not retry auth failures — api-client handles 401 redirect to login
      if (error instanceof Error && error.message.includes("401")) return false;
      return failureCount < 1;
    },
  });
}



/**
 * Hook to confirm a customer's deposit.
 * Uses optimistic updates to immediately remove the order from the pending list.
 */
export function useConfirmDeposit() {
  const queryClient = useQueryClient();

  type MutationContext = {
    previousOrders: PendingOrderResponse[] | undefined;
  };

  return useMutation<DepositConfirmationResponse, Error, string, MutationContext>({
    mutationFn: confirmDeposit,
    onMutate: async (orderId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["pendingOrders"] });

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData<PendingOrderResponse[]>(
        ["pendingOrders"]
      );

      // Optimistically update: remove the confirmed order
      if (previousOrders) {
        queryClient.setQueryData<PendingOrderResponse[]>(
          ["pendingOrders"],
          previousOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: OrderStatus.DepositConfirmed }
              : order
          )
        );
      }

      return { previousOrders };
    },
    onError: (_err, _orderId, context) => {
      // Revert on error
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["pendingOrders"],
          context.previousOrders
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["activeCarton"] });
    },
  });
}
