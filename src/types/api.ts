// ============================================================
// BelGomla API Type Definitions
// Maps 1:1 to the .NET 9 backend DTOs
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum CartonStatus {
  Open = "Open",
  Filled = "Filled",
  Purchased = "Purchased",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum OrderStatus {
  PendingDeposit = "PendingDeposit",
  DepositConfirmed = "DepositConfirmed",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

// ─── API Envelope ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ProductResponse {
  id: string;
  name: string;
  imageUrl?: string | null;
  wholesalePrice: number;
  standardPrice: number;
  minDiscountPrice: number;
  cartonCapacity: number;
  maxReferrals: number;
  referralDiscountPerReferral: number;
  depositAmount: number;
  isActive: boolean;
}

// ─── Carton DTOs ─────────────────────────────────────────────

export interface ActiveCartonResponse {
  cartonId: string;
  productId: string;
  productName: string;
  cartonNumber: number;
  confirmedCount: number;
  capacity: number;
  progressPercent: number;
  status: CartonStatus;
}

// ─── Order DTOs ──────────────────────────────────────────────

export interface CreateOrderRequest {
  productId: string;
  customerFullName: string;
  customerPhone: string;
  villageName: string;
  referralCode?: string | null;
}

export interface OrderResponse {
  orderId: string;
  cartonId: string;
  cartonNumber: number;
  customerName: string;
  customerPhone: string;
  personalReferralCode: string;
  originalPrice: number;
  appliedDiscount: number;
  finalPrice: number;
  depositAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// ─── Admin DTOs ──────────────────────────────────────────────

export interface CreateProductRequest {
  name: string;
  imageUrl?: string | null;
  wholesalePrice: number;
  standardPrice: number;
  minDiscountPrice: number;
  cartonCapacity: number;
  maxReferrals: number;
  referralDiscountPerReferral: number;
  depositAmount: number;
}


export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  username: string;
}

export interface PendingOrderResponse {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  villageName: string;
  productName: string;
  cartonNumber: number;
  originalPrice: number;
  appliedDiscount: number;
  finalPrice: number;
  depositAmount: number;
  status: OrderStatus;
  createdAt: string;
  referralCodeUsed?: string | null;
}

export interface DepositConfirmationResponse {
  orderId: string;
  newOrderStatus: OrderStatus;
  newCartonConfirmedCount: number;
  cartonCapacity: number;
  cartonIsFilled: boolean;
  newCartonCreatedId?: string | null;
}

// ─── Customer Auth & OTP DTOs ──────────────────────────────

export enum OtpPurpose {
  Registration = "Registration",
  PasswordReset = "PasswordReset",
}

export interface SendOtpRequest {
  phoneNumber?: string;
  email?: string;
}

export interface SendOtpResponse {
  cooldownSeconds: number;
  message: string;
}

export interface RegisterWithOtpRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  villageName: string;
  password: string;
  otpCode: string;
  referralCode?: string | null;
}

export interface ResendOtpRequest {
  phoneNumber?: string;
  email?: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpRequest {
  phoneNumber?: string;
  email?: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
  expiresAt: string;
  message: string;
}

export interface ResetPasswordRequest {
  phoneNumber?: string;
  email?: string;
  resetToken: string;
  newPassword: string;
}

export interface RegisterWithFirebaseRequest {
  fullName: string;
  phoneNumber: string;
  villageName: string;
  password: string;
  firebaseIdToken: string;
  referralCode?: string | null;
}

export interface ResetPasswordWithFirebaseRequest {
  phoneNumber: string;
  firebaseIdToken: string;
  newPassword: string;
}

export interface CustomerRegisterRequest {
  fullName: string;
  phoneNumber: string;
  villageName: string;
  password: string;
  referralCode?: string | null;
}

export interface UpdateCustomerProfileRequest {
  fullName: string;
  villageName: string;
  phoneNumber?: string;
  password?: string;
}

export interface CustomerLoginRequest {
  phoneNumber: string;
  password: string;
}

export interface CustomerAuthResponse {
  token: string;
  expiresAt: string;
  customerName: string;
  phoneNumber: string;
  personalReferralCode: string;
}

// ─── Customer Dashboard DTOs ─────────────────────────────────

export interface CustomerDashboardResponse {
  customerId: string;
  fullName: string;
  phoneNumber: string;
  villageName: string;
  personalReferralCode: string;
  memberSince: string;
  orderSummary: CustomerOrderSummary;
  orders: CustomerOrderResponse[];
  referralProgress: ReferralProgressResponse;
}

export interface CustomerOrderSummary {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  totalSaved: number;
}

export interface CustomerOrderResponse {
  orderId: string;
  productId: string;
  productName: string;
  cartonNumber: number;
  originalPrice: number;
  appliedDiscount: number;
  finalPrice: number;
  depositAmount: number;
  status: OrderStatus;
  statusArabic: string;
  cartonCapacity: number;
  cartonConfirmedCount: number;
  cartonStatus: CartonStatus;
  createdAt: string;
  depositConfirmedAt?: string | null;
}

// ─── Referral DTOs ───────────────────────────────────────────

export interface ReferralProgressResponse {
  customerName: string;
  personalReferralCode: string;
  confirmedReferrals: number;
  maxReferrals: number;
  totalDiscountEarned: number;
  discountPerReferral: number;
  referrals: ReferralItemResponse[];
}

export interface ReferralItemResponse {
  referredCustomerName: string;
  discountAmount: number;
  isApplied: boolean;
  orderCreatedAt: string;
}
