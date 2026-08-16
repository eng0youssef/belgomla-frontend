import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerLogin, customerRegister, getCustomerDashboard, updateCustomerProfile, cancelCustomerOrder } from "@/services/customer";
import { getCustomerToken, removeCustomerToken } from "@/services/api-client";
import { useMounted } from "./use-mounted";
import type {
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerAuthResponse,
  CustomerDashboardResponse,
  UpdateCustomerProfileRequest,
} from "@/types/api";

export function useCustomerLogin() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, CustomerLoginRequest>({
    mutationFn: customerLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useCustomerRegister() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, CustomerRegisterRequest>({
    mutationFn: customerRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useCustomerDashboard() {
  const mounted = useMounted();
  return useQuery<CustomerDashboardResponse, Error>({
    queryKey: ["customer-dashboard"],
    queryFn: getCustomerDashboard,
    enabled: mounted && !!getCustomerToken(),
    retry: false,
  });
}


export function useCustomerLogout() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      removeCustomerToken();
    },
    onSuccess: () => {
      // Clear ALL cached query data to prevent data leakage between sessions
      queryClient.clear();
    },
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, UpdateCustomerProfileRequest>({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useCancelCustomerOrder() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (orderId: string) => cancelCustomerOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}
