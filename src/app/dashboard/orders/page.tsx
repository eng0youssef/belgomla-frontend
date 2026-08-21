"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageCircle,
  Users,
  Copy,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerDashboard, useCancelCustomerOrder } from "@/hooks/use-customer";
import { OrderStatus } from "@/types/api";
import { CartonTrackingCard } from "@/components/CartonTrackingCard";
import { PAYMENT_PHONE, PAYMENT_LABEL, SUPPORT_PHONE } from "@/lib/constants";
import { whatsappChatUrl, whatsappShareUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrdersHistoryPage() {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { data: dashboardData, isLoading, isError } = useCustomerDashboard();
  const cancelMutation = useCancelCustomerOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center" dir="rtl">
        <p className="text-red-600 font-bold mb-4">حدث خطأ أثناء تحميل سجل الطلبات</p>
        <Button onClick={() => router.push("/dashboard")} className="rounded-xl font-bold">
          العودة للوحة التحكم
        </Button>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const { orders, personalReferralCode, fullName } = dashboardData;

  const getStatusBadge = (status: OrderStatus, statusArabic: string) => {
    switch (status) {
      case OrderStatus.PendingDeposit:
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>في انتظار العربون</span>
          </span>
        );
      case OrderStatus.DepositConfirmed:
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>تم تأكيد العربون ✅</span>
          </span>
        );
      case OrderStatus.Completed:
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>مكتمل ومسلّم</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
            {statusArabic || "قيد المعالجة"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col justify-between" dir="rtl">
      <div>
        <Header />

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-10 w-10 p-0 rounded-xl"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">سجل طلباتك بالكامل</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تتبع كراتينك وتفاصيل الشحن والتوفير
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="clean-card p-10 text-center bg-white space-y-3">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-700 font-black text-base">لا توجد طلبات سابقة</p>
                <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">
                  تصفح المنتجات المتاحة
                </Button>
              </div>
            ) : (
              orders.map((order) => {
                const orderReferralLink = `${baseUrl}/product/${order.productId}?ref=${personalReferralCode}`;
                const shareText = `أنا لسه حاجز ${order.productName} بسعر الجملة في موقع سلاش! 🎉 خش احجز قطعتك معايا في نفس الكرتونة عشان نوفر مع بعض: ${orderReferralLink}`;
                const depositText = order.depositAmount > 0 ? `(${order.depositAmount} جنيه)` : "المطلوب";
                const depositReceiptMsg = `السلام عليكم، أنا ${fullName}، لسه عامل أوردر في موقع سلاش.\nرقم الطلب: ${order.orderId.slice(0, 8).toUpperCase()}\nالكرتونة: #${order.cartonNumber}\nوحولت العربون ${depositText}.`;

                return (
                  <div key={order.orderId} className="clean-card p-5 sm:p-6 bg-white space-y-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-base sm:text-lg">
                            {order.productName}
                          </h3>
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                            #{order.orderId.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          تاريخ الحجز: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>

                      <div>
                        {getStatusBadge(order.status, order.statusArabic)}
                      </div>
                    </div>

                    {/* Carton Live Visual Tracker */}
                    <div>
                      <CartonTrackingCard
                        capacity={order.cartonCapacity}
                        confirmedCount={order.cartonConfirmedCount}
                        status={order.cartonStatus}
                      />
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium block">رقم الكرتونة:</span>
                        <span className="font-black text-slate-800 text-sm">#{order.cartonNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">خصم الإحالة المطبق:</span>
                        <span className="font-black text-purple-700 text-sm">
                          {order.appliedDiscount > 0 ? `- ${order.appliedDiscount} ج.م` : "—"}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500 font-medium block">السعر المطلوب عند الاستلام:</span>
                        <span className="font-black text-emerald-700 text-base">
                          {order.finalPrice} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Pending Deposit Action Banner */}
                    {order.status === OrderStatus.PendingDeposit && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-amber-700" />
                          <h4 className="font-black text-amber-900 text-sm">
                            في انتظار تحويل العربون الرمزي {order.depositAmount > 0 ? `(${order.depositAmount} ج.م)` : ""} لتثبيت مكانك
                          </h4>
                        </div>
                        <p className="text-xs text-amber-800 font-medium">
                          حوّل العربون على ({PAYMENT_LABEL}): <strong className="font-mono text-sm" dir="ltr">{PAYMENT_PHONE}</strong>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <a
                            href={whatsappChatUrl(SUPPORT_PHONE, depositReceiptMsg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs h-10 rounded-xl gap-1.5"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>إرسال إشعار التحويل على الواتساب</span>
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={cancelMutation.isPending}
                            onClick={() => {
                              if (confirm("هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟")) {
                                cancelMutation.mutate(order.orderId);
                              }
                            }}
                            className="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 font-bold text-xs h-10 rounded-xl"
                          >
                            إلغاء الطلب
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Per-Order Referral Share Card */}
                    <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-purple-600" />
                          شير الكرتونة دي مع صحابك وخفض السعر!
                        </span>
                        <span className="text-[11px] font-bold text-purple-700">
                          كودك: <strong dir="ltr">{personalReferralCode}</strong>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={orderReferralLink}
                          className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-mono text-slate-700 outline-none"
                          dir="ltr"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(orderReferralLink);
                            setCopiedLink(order.orderId);
                            setTimeout(() => setCopiedLink(null), 2000);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-3 rounded-xl gap-1"
                        >
                          {copiedLink === order.orderId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink === order.orderId ? "تم النسخ" : "نسخ"}</span>
                        </Button>
                        <a
                          href={whatsappShareUrl(shareText)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs h-9 px-3 rounded-xl gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">شير</span>
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

