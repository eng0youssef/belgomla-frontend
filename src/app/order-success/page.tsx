"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  MessageCircle,
  Package,
  CreditCard,
  ArrowRight,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { whatsappShareUrl } from "@/lib/utils";
import { getCustomerToken, apiClient } from "@/services/api-client";
import type { OrderResponse } from "@/types/api";
import { PAYMENT_PHONE, PAYMENT_LABEL } from "@/lib/constants";

// ─── Referral code sanitizer ──────────────────────────────────────────────────
// Allow only alphanumeric codes 4–16 chars long.
// The API always returns clean codes, but we validate defensively.
const SAFE_CODE_RE = /^[A-Z0-9]{4,16}$/i;

function sanitizeCode(raw: string | null | undefined): string {
  if (!raw || !SAFE_CODE_RE.test(raw.trim())) return "";
  return raw.trim().toUpperCase();
}

// ─── Order data fetcher ───────────────────────────────────────────────────────

function useOrderById(orderId: string) {
  return useQuery<OrderResponse, Error>({
    queryKey: ["order", orderId],
    queryFn: () => apiClient<OrderResponse>(`/public/orders/${orderId}`),
    enabled: !!orderId,
    staleTime: Infinity,   // order data is immutable once created
    retry: 2,
  });
}

// ─── Main content (inside Suspense) ──────────────────────────────────────────

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  // The ONLY thing we read from URL params is the orderId (non-sensitive).
  // All financial data (price, carton number, name) comes from the API.
  const orderId = params.get("orderId") ?? "";

  const { data: order, isLoading, isError } = useOrderById(orderId);

  // ─── Derived values (all from API, never from URL params) ──────────────────

  const referralCode = sanitizeCode(order?.personalReferralCode);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = referralCode ? `${origin}?ref=${referralCode}` : "";
  const shareText = referralLink
    ? `أنا لسه حاجزت بسعر الجملة من موقع بالجملة! 🎉 خش احجز معايا واحنا نوفر مع بعض. استخدم اللينك ده: ${referralLink}`
    : "";

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center" dir="rtl">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">رابط غير صحيح</h1>
        <p className="text-gray-500 font-bold mb-6">لم يتم العثور على رقم الطلب في الرابط.</p>
        <Button onClick={() => router.push("/")} className="gap-2 font-black rounded-2xl">
          <ArrowRight className="w-4 h-4" /> الرئيسية
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center" dir="rtl">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">تعذّر تحميل الطلب</h1>
        <p className="text-gray-500 font-bold mb-6">
          حدث خطأ أثناء جلب بيانات طلبك. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.
        </p>
        <Button onClick={() => router.push("/")} className="gap-2 font-black rounded-2xl">
          <ArrowRight className="w-4 h-4" /> الرئيسية
        </Button>
      </div>
    );
  }

  // ─── Success UI ────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white"
      dir="rtl"
    >
      {/* Hero Success Banner */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white pt-16 pb-24 px-4 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black mb-2"
          >
            تم الحجز بنجاح! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-100 font-bold"
          >
            {/* customerName comes from the API — never from URL params */}
            أهلاً {order.customerName}، حجزك اتسجّل وجاري المراجعة
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-12 relative z-20 space-y-5 pb-16">
        {/* Order Summary Card — all values from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-black text-gray-800">تفاصيل طلبك</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-bold text-sm">رقم الطلب</span>
              <span className="font-black text-gray-600 text-xs" dir="ltr">{order.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-bold text-sm">رقم الكارتونة</span>
              <span className="font-black text-gray-800">#{order.cartonNumber}</span>
            </div>
            {order.appliedDiscount > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 font-bold text-sm">خصم الإحالة</span>
                <span className="font-black text-purple-600">- {order.appliedDiscount} ج.م</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-bold text-sm">السعر النهائي</span>
              {/* finalPrice from API — cannot be forged via URL */}
              <span className="font-black text-emerald-600 text-lg">{order.finalPrice} ج.م</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-700" />
            </div>
            <h2 className="font-black text-amber-800">ادفع العربون دلوقتي</h2>
          </div>

          <p className="text-sm text-amber-700 font-bold mb-4">
            عشان يتأكد حجزك، حوّل العربون على الرقم ده دلوقتي:
          </p>

          <div className="bg-white rounded-2xl p-4 text-center mb-4 shadow-sm border border-amber-100">
            <p className="text-xs text-gray-400 font-bold mb-1">{PAYMENT_LABEL}</p>
            <p className="text-3xl font-black text-gray-800 tracking-widest" dir="ltr">
              {PAYMENT_PHONE}
            </p>
          </div>

          <div className="bg-amber-100/70 rounded-xl p-3 text-xs text-amber-700 font-bold">
            ⚡ بعد التحويل، الأدمن هيراجعه ويأكد حجزك — وهتبقى تشوف حجزك في الداشبورد الخاص بيك.
          </div>
        </motion.div>

        {/* Referral Share Card — only shown when referral code exists and passes sanitization */}
        {referralLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="font-black text-purple-800">شير ووفّر أكثر! 🎁</h2>
            </div>
            <p className="text-sm text-purple-700 font-bold mb-4">
              ادعُ أصحابك باللينك ده واحصل على خصم إضافي على طلبك كل ما حد يشتري من خلالك:
            </p>

            {/* Referral Code Badge — value from API, sanitized */}
            <div className="bg-white rounded-xl p-3 text-center mb-3 border border-purple-100 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">كودك الشخصي</p>
              <p className="text-2xl font-black text-purple-700 tracking-widest" dir="ltr">
                {referralCode}
              </p>
            </div>

            {/* Copy Link */}
            <div className="flex gap-2 mb-3">
              <input
                readOnly
                value={referralLink}
                className="flex-1 px-3 py-2.5 border border-purple-200 rounded-xl text-xs bg-white font-bold text-gray-600 outline-none"
                dir="ltr"
              />
              <button
                onClick={copyLink}
                aria-label={copied ? "تم النسخ" : "نسخ الرابط"}
                className={`px-3 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-1.5 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "تم!" : "نسخ"}
              </button>
            </div>

            <Button
              className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black"
              asChild
            >
              <a
                href={whatsappShareUrl(shareText)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                شير على واتساب دلوقتي!
              </a>
            </Button>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          {isLoggedIn ? (
            <Button
              variant="outline"
              className="gap-2 font-black rounded-2xl h-12"
              onClick={() => router.push("/dashboard")}
            >
              <User className="w-4 h-4" />
              لوحة التحكم
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-2 font-black rounded-2xl h-12"
              onClick={() => router.push("/register")}
            >
              <User className="w-4 h-4" />
              سجّل حساب
            </Button>
          )}
          <Button
            className="gap-2 font-black rounded-2xl h-12"
            onClick={() => router.push("/")}
          >
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </Button>
        </motion.div>

        {/* Login hint */}
        {!isLoggedIn && (
          <p className="text-center text-xs text-gray-400 font-bold px-4">
            💡 سجّل حساب عشان تقدر تتابع حالة طلبك وتشوف خصوماتك في الداشبورد
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
