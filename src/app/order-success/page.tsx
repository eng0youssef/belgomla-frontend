"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Package,
  ArrowRight,
  User,
  Loader2,
  AlertCircle,
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
  Banknote,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappShareUrl, whatsappChatUrl } from "@/lib/utils";
import { getCustomerToken, apiClient } from "@/services/api-client";
import type { OrderResponse } from "@/types/api";
import { SUPPORT_PHONE } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Referral code sanitizer
const SAFE_CODE_RE = /^[A-Z0-9]{4,16}$/i;
function sanitizeCode(raw: string | null | undefined): string {
  if (!raw || !SAFE_CODE_RE.test(raw.trim())) return "";
  return raw.trim().toUpperCase();
}

function useOrderById(orderId: string) {
  return useQuery<OrderResponse, Error>({
    queryKey: ["order", orderId],
    queryFn: () => apiClient<OrderResponse>(`/public/orders/${orderId}`),
    enabled: !!orderId,
    staleTime: Infinity,
    retry: 2,
  });
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  const orderId = params.get("orderId") ?? "";
  const { data: order, isLoading, isError } = useOrderById(orderId);

  // Safely unwrap order from API envelope if wrapped in data
  const rawOrder = order as any;
  const orderData: OrderResponse | null = rawOrder?.data || rawOrder || null;

  const orderShortCode = (orderData?.orderId || orderId || "").slice(0, 8).toUpperCase();
  const customerName = orderData?.customerName || "يا بطل";
  const cartonNum = orderData?.cartonNumber || 1;
  const referralCode = sanitizeCode(orderData?.personalReferralCode);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = referralCode ? `${origin}?ref=${referralCode}` : "";
  const shareText = referralLink
    ? `أنا لسه حاجز بسعر جملة الكرتونة من موقع سلاش! 🎉 خش احجز قطعتك معايا في نفس الكرتونة عشان نوفر مع بعض: ${referralLink}`
    : "";

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center" dir="rtl">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-black text-slate-800 mb-2">رابط غير صحيح</h1>
        <p className="text-slate-500 font-bold mb-6">لم يتم العثور على رقم الطلب المطلوب.</p>
        <Button onClick={() => router.push("/")} className="gap-2 font-black rounded-xl">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center" dir="rtl">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-slate-800 mb-2">تعذّر جلب بيانات الطلب</h1>
        <p className="text-slate-500 font-bold mb-6">
          حدث خطأ أثناء تحميل الطلب. تأكد من اتصال الإنترنت ثم حاول مرة أخرى.
        </p>
        <Button onClick={() => router.push("/")} className="gap-2 font-black rounded-xl">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </Button>
      </div>
    );
  }

  const finalPrice = orderData.finalPrice ?? 0;
  const whatsappConfirmMsg = `السلام عليكم، أنا ${customerName}، لسه حاجز بسعر جملة الكرتونة في موقع سلاش.\nرقم الطلب: ${orderShortCode}\nالكرتونة: #${cartonNum}\nجاهز للاستلام كاش بعد المعاينة الكاملة إن شاء الله.`;

  return (
    <div className="min-h-screen bg-[#fbfcfd]" dir="rtl">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Success Top Banner */}
        <div className="clean-card bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8 rounded-3xl text-center shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            تم تسجيل حجزك بنجاح يا {customerName}! 🎉
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-bold max-w-lg mx-auto leading-relaxed">
            مكانك اتحجز رسمي في كرتونة شحن رقم <strong className="text-white font-black">#{cartonNum}</strong>.. والدفع بالكامل كاش عند الاستلام بعد المعاينة والفحص 100%!
          </p>
        </div>

        {/* Action Steps Container */}
        <div className="space-y-4">
          {/* Step 1: Cash on Delivery Reassurance */}
          <div className="clean-card p-5 sm:p-6 bg-white space-y-3 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                ١
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>الدفع كاش فقط عند الاستلام بعد المعاينة 100%</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  المطلوب الآن: 0 ج.م (مفيش أي دفع مسبق نهائياً)
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block mb-0.5">
                  المبلغ المطلوب عند استلام الشحنة:
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  {finalPrice} ج.م
                </span>
              </div>
              <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-200">
                💵 كاش مع المندوب
              </span>
            </div>

            <p className="text-[11px] text-emerald-800 bg-emerald-50/50 p-2.5 rounded-xl font-bold border border-emerald-200/60">
              💡 افتح العلبة وافحص المنتج وتأكد منه بنفسك مع الكابتن.. عجبك ادفع كاش، ما عجبكش ولا مليم.
            </p>
          </div>

          {/* Step 2: Confirm on WhatsApp */}
          <div className="clean-card p-5 sm:p-6 bg-white space-y-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                ٢
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>متابعة الشحن والتوصيل عبر الواتساب</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  الكابتن هيتواصل معاك لتأكيد ميعاد التوصيل.. وتقدر تراسلنا في أي وقت
                </p>
              </div>
            </div>

            <a
              href={whatsappChatUrl(SUPPORT_PHONE, whatsappConfirmMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm sm:text-base h-12 rounded-xl shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>متابعة طلبي مع خدمة العملاء على الواتساب 💬</span>
              </Button>
            </a>
          </div>

          {/* Step 3: Viral Referral Share */}
          {referralLink && (
            <div className="clean-card p-5 sm:p-6 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 border-purple-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                  ٣
                </div>
                <div>
                  <h3 className="font-black text-purple-950 text-base flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    شير مع الشلة ووفّر أكتر على أوردرك! 🎁
                  </h3>
                  <p className="text-xs text-purple-800 font-medium">
                    كل صاحب يحجز في نفس الكرتونة بينزلك خصم فوري على قطعتك
                  </p>
                </div>
              </div>

              {/* Referral Code & Copy Bar */}
              <div className="bg-white rounded-2xl p-4 border border-purple-200/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">كود الدعوة الخاص بيك:</span>
                  <span className="font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-lg text-sm tracking-wider" dir="ltr">
                    {referralCode}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none"
                    dir="ltr"
                  />
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    className="gap-1.5 font-bold text-xs h-10 px-4 rounded-xl border-purple-200 hover:bg-purple-50 text-purple-800"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "تم النسخ!" : "نسخ الرابط"}</span>
                  </Button>
                </div>

                <a
                  href={whatsappShareUrl(shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border-[#25D366]/30 font-black text-xs h-10 rounded-xl gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#25D366]" />
                    <span>مشاركة الرابط على جروبات الواتساب</span>
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Order Details Accordion/Summary */}
          <div className="clean-card p-5 bg-white space-y-3 border-slate-200">
            <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              تفاصيل طلبك المسجل:
            </h4>
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>رقم الطلب:</span>
                <span className="font-mono font-bold" dir="ltr">{orderShortCode}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>رقم الكرتونة:</span>
                <span className="font-bold text-slate-900">#{cartonNum}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-emerald-700">كاش عند الاستلام بعد المعاينة 💵</span>
              </div>
              {(orderData.appliedDiscount || 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الشلة المطبق:</span>
                  <span>- {orderData.appliedDiscount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-100">
                <span>المبلغ المطلوب عند الاستلام كاش:</span>
                <span className="text-emerald-700 font-black">{finalPrice} ج.م</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/register")}
              variant="outline"
              size="lg"
              className="w-full gap-2 font-black h-12 rounded-xl"
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? "لوحة تحكم الطلبات" : "إنشاء حساب لمتابعة الشحن"}</span>
            </Button>
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="w-full gap-2 font-black h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              <ArrowRight className="w-4 h-4" />
              <span>تصفح باقي المنتجات</span>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
