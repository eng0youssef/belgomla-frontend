import type {
  ApiResponse,
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
  try {
    const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
      "/auth/customer/login",
      {
        method: "POST",
        body: credentials,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "بيانات الدخول غير صحيحة، تأكد من رقم الهاتف وكلمة المرور");
    }

    setCustomerToken(response.data.token);
    return response.data;
  } catch (error: any) {
    if (error?.message?.includes("Invalid phone number or password") || error?.message?.includes("401")) {
      throw new Error("بيانات الدخول غير صحيحة، تأكد من رقم الهاتف وكلمة المرور");
    }
    throw error;
  }
}

/**
 * Customer register (legacy direct) — creates a new account or adds password to existing one.
 */
export async function customerRegister(
  data: CustomerRegisterRequest
): Promise<CustomerAuthResponse> {
  try {
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
  } catch (error: any) {
    if (error?.message?.includes("already registered")) {
      throw new Error("يوجد حساب مسجل بالفعل برقم الهاتف هذا");
    }
    throw error;
  }
}

/**
 * Send registration OTP to customer's mobile number.
 */
export async function sendRegistrationOtp(
  data: SendOtpRequest
): Promise<SendOtpResponse> {
  const response = await apiClient<ApiResponse<SendOtpResponse>>(
    "/auth/customer/register/send-otp",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل إرسال كود التحقق");
  }

  return response.data;
}

/**
 * Verify OTP and register customer account.
 */
export async function registerWithOtp(
  data: RegisterWithOtpRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/register/verify-and-register",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تأكيد الرمز وتسجيل الحساب");
  }

  setCustomerToken(response.data.token);
  return response.data;
}

/**
 * Resend OTP (Registration or PasswordReset).
 */
export async function resendOtp(
  data: ResendOtpRequest
): Promise<SendOtpResponse> {
  const response = await apiClient<ApiResponse<SendOtpResponse>>(
    "/auth/customer/resend-otp",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل إعادة إرسال كود التحقق");
  }

  return response.data;
}

/**
 * Send forgot password OTP to customer's mobile number.
 */
export async function sendForgotPasswordOtp(
  data: SendOtpRequest
): Promise<SendOtpResponse> {
  const response = await apiClient<ApiResponse<SendOtpResponse>>(
    "/auth/customer/forgot-password/send-otp",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "لا يوجد حساب مسجل بهذا الرقم");
  }

  return response.data;
}

/**
 * Verify forgot password OTP and receive reset token.
 */
export async function verifyForgotPasswordOtp(
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  const response = await apiClient<ApiResponse<VerifyOtpResponse>>(
    "/auth/customer/forgot-password/verify-otp",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "كود التحقق غير صحيح أو انتهت صلاحيته");
  }

  return response.data;
}

/**
 * Set new password using reset token.
 */
export async function resetCustomerPassword(
  data: ResetPasswordRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/forgot-password/reset",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تغيير كلمة المرور");
  }

  setCustomerToken(response.data.token);
  return response.data;
}

/**
 * Register with Firebase verified ID token.
 */
export async function registerWithFirebase(
  data: import("@/types/api").RegisterWithFirebaseRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/register/firebase",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل التسجيل عبر Firebase");
  }

  setCustomerToken(response.data.token);
  return response.data;
}

/**
 * Reset password with Firebase verified ID token.
 */
export async function resetPasswordWithFirebase(
  data: import("@/types/api").ResetPasswordWithFirebaseRequest
): Promise<CustomerAuthResponse> {
  const response = await apiClient<ApiResponse<CustomerAuthResponse>>(
    "/auth/customer/forgot-password/firebase-reset",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "فشل تعيين كلمة المرور عبر Firebase");
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