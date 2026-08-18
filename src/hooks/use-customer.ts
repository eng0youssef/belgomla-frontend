import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  customerLogin,
  customerRegister,
  sendRegistrationOtp,
  registerWithOtp,
  resendOtp,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetCustomerPassword,
  getCustomerDashboard,
  updateCustomerProfile,
  cancelCustomerOrder,
} from "@/services/customer";
import { getCustomerToken, removeCustomerToken } from "@/services/api-client";
import { useMounted } from "./use-mounted";
import type {
  CustomerLoginRequest,
  CustomerRegisterRequest,
  CustomerAuthResponse,
  CustomerDashboardResponse,
  UpdateCustomerProfileRequest,
  SendOtpRequest,
  SendOtpResponse,
  RegisterWithOtpRequest,
  ResendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
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

export function useSendRegistrationOtp() {
  return useMutation<SendOtpResponse, Error, SendOtpRequest>({
    mutationFn: sendRegistrationOtp,
  });
}

export function useRegisterWithOtp() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, RegisterWithOtpRequest>({
    mutationFn: registerWithOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useResendOtp() {
  return useMutation<SendOtpResponse, Error, ResendOtpRequest>({
    mutationFn: resendOtp,
  });
}

export function useSendForgotPasswordOtp() {
  return useMutation<SendOtpResponse, Error, SendOtpRequest>({
    mutationFn: sendForgotPasswordOtp,
  });
}

export function useVerifyForgotPasswordOtp() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpRequest>({
    mutationFn: verifyForgotPasswordOtp,
  });
}

export function useResetCustomerPassword() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, ResetPasswordRequest>({
    mutationFn: resetCustomerPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useRegisterWithFirebase() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, import("@/types/api").RegisterWithFirebaseRequest>({
    mutationFn: (data) => import("@/services/customer").then((m) => m.registerWithFirebase(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-dashboard"] });
    },
  });
}

export function useResetPasswordWithFirebase() {
  const queryClient = useQueryClient();
  return useMutation<CustomerAuthResponse, Error, import("@/types/api").ResetPasswordWithFirebaseRequest>({
    mutationFn: (data) => import("@/services/customer").then((m) => m.resetPasswordWithFirebase(data)),
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
