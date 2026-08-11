import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveCarton,
  getAdminCartonsByProduct,
  updateCartonStatus,
  updateCartonCounter,
  forceCreateCarton,
} from "@/services/carton";
import type { ActiveCartonResponse } from "@/types/api";
import type { AdminCartonDetail, CartonStatusTransition } from "@/services/carton";
import { getAdminToken } from "@/services/api-client";

const DEFAULT_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID ||
  "00000000-0000-0000-0000-000000000001";

/**
 * Hook to fetch and auto-refresh the active carton data.
 * Refetches every 30 seconds for live counter updates.
 */
export function useActiveCarton(productId?: string) {
  return useQuery<ActiveCartonResponse | null, Error>({
    queryKey: ["activeCarton", productId || DEFAULT_PRODUCT_ID],
    queryFn: () => getActiveCarton(productId || DEFAULT_PRODUCT_ID),
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
  });
}

/**
 * Hook to fetch all cartons for a product (admin).
 */
export function useAdminCartons(productId: string) {
  return useQuery<AdminCartonDetail[]>({
    queryKey: ["adminCartons", productId],
    queryFn: () => getAdminCartonsByProduct(productId),
    enabled: !!getAdminToken() && !!productId,
    refetchInterval: 30 * 1000,
  });
}

/**
 * Hook to update carton lifecycle status (admin).
 */
export function useUpdateCartonStatus(productId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { cartonId: string; status: CartonStatusTransition }
  >({
    mutationFn: ({ cartonId, status }) => updateCartonStatus(cartonId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCartons", productId] });
      queryClient.invalidateQueries({ queryKey: ["activeCarton"] });
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
    },
  });
}

export function useUpdateCartonCounter(productId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { cartonId: string; confirmedCount: number }
  >({
    mutationFn: ({ cartonId, confirmedCount }) => updateCartonCounter(cartonId, confirmedCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCartons", productId] });
      queryClient.invalidateQueries({ queryKey: ["activeCarton"] });
    },
  });
}

export function useForceCreateCarton() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (productId: string) => forceCreateCarton(productId),
    onSuccess: (_, productId: string) => {
      queryClient.invalidateQueries({ queryKey: ["adminCartons", productId] });
      queryClient.invalidateQueries({ queryKey: ["activeCarton"] });
    },
  });
}
