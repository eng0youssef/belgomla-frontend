"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, LogOut, CheckCircle, Clock, Gift, Users, Copy, Loader2, CreditCard, MessageCircle, Settings, ArrowLeft, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomerDashboard, useCustomerLogout, useCancelCustomerOrder } from "@/hooks/use-customer";
import { OrderStatus } from "@/types/api";
import { getCustomerToken } from "@/services/api-client";
import { CartonTrackingCard } from "@/components/CartonTrackingCard";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const logout = useCustomerLogout();
  const cancelMutation = useCancelCustomerOrder();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  // Check auth
  useEffect(() => {
    setIsMounted(true);
    if (!getCustomerToken()) {
      router.replace("/login");
    }
  }, [router]);

  const { data: dashboardData, isLoading, isError, error } = useCustomerDashboard();

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="text-red-500 font-bold mb-4">
          {error?.message || "حدث خطأ أثناء تحميل بياناتك"}
        </p>
        <Button onClick={() => router.push("/login")}>العودة لتسجيل الدخول</Button>
      </div>
    );
  }

  const {
    fullName,
    orderSummary,
    orders,
    referralProgress,
  } = dashboardData;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const personalReferralCode = dashboardData?.personalReferralCode || "";
  const genericReferralLink = `${baseUrl}?ref=${personalReferralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(genericReferralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingDeposit:
        return <Clock className="w-5 h-5 text-amber-500" />;
      case OrderStatus.DepositConfirmed:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case OrderStatus.Completed:
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white pt-10 pb-20 px-4 rounded-b-[40px] shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">أهلاً، {fullName.split(" ")[0]} 👋</h1>
            <p className="text-emerald-100 text-sm">لوحة التحكم الخاصة بك</p>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              className="text-emerald-100 hover:bg-emerald-700/50 hover:text-white px-2"
              onClick={() => router.push("/")}
              title="الرئيسية (تصفح المنتجات)"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-emerald-100 hover:bg-emerald-700/50 hover:text-white px-2"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-emerald-700/50 hover:text-white px-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-black text-gray-800">{orderSummary.totalOrders}</p>
              <p className="text-xs text-gray-500 font-bold">إجمالي الطلبات</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-black text-gray-800">{orderSummary.pendingOrders}</p>
              <p className="text-xs text-gray-500 font-bold">في انتظار العربون</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-black text-gray-800">{orderSummary.confirmedOrders}</p>
              <p className="text-xs text-gray-500 font-bold">تم تأكيد العربون</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="flex justify-between items-center mt-8 mb-4">
          <h3 className="font-black text-xl text-gray-800">أحدث الطلبات</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 rounded-full shadow-md flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <Package className="w-4 h-4" />
              تصفح المنتجات
            </Button>
            {orders.length > 2 && (
              <Button 
                variant="link" 
                className="text-emerald-600 font-bold p-0 flex items-center gap-1"
                onClick={() => router.push("/dashboard/orders")}
              >
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">لا توجد طلبات حتى الآن</p>
              <Button onClick={() => router.push("/")} className="mt-4" variant="outline">تصفح المنتجات</Button>
            </div>
          ) : (
            orders.slice(0, 2).map((order) => {
              const orderReferralLink = `${baseUrl}/product/${order.productId}?ref=${personalReferralCode}`;
              return (
              <Card key={order.orderId} className="border-0 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-gray-800 mb-1">{order.productName}</h4>
                    <p className="text-xs text-gray-500 font-bold">
                      التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    order.status === OrderStatus.PendingDeposit ? "bg-amber-100 text-amber-700" :
                    order.status === OrderStatus.DepositConfirmed ? "bg-blue-100 text-blue-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {getStatusIcon(order.status)}
                    {order.statusArabic}
                  </div>
                </div>

                <div className="p-4">
                  <CartonTrackingCard 
                    capacity={order.cartonCapacity} 
                    confirmedCount={order.cartonConfirmedCount} 
                    status={order.cartonStatus} 
                  />
                </div>

                <div className="bg-gray-50/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">كارتونة رقم:</span>
                    <span className="font-bold text-gray-700">#{order.cartonNumber}</span>
                  </div>
                  {order.appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm mt-2 text-emerald-600">
                      <span>خصم الإحالة:</span>
                      <span className="font-black">- {order.appliedDiscount}ج</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mt-2 border-t border-gray-200 pt-2">
                    <span className="font-bold text-gray-700">السعر النهائي:</span>
                    <span className="font-black text-gray-900">{order.finalPrice}ج</span>
                  </div>
                </div>

              {/* Payment Instructions Banner — only for PendingDeposit */}
                {order.status === OrderStatus.PendingDeposit && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 border-t-2 border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <h5 className="text-sm font-black text-amber-800">في انتظار تأكيد العربون</h5>
                    </div>
                    <p className="text-xs text-amber-700 font-bold mb-3">
                      عشان يتأكد حجزك، حوّل العربون على:
                    </p>
                    <div className="bg-white rounded-xl p-3 text-center mb-3 shadow-sm border border-amber-100">
                      <p className="text-[10px] text-gray-400 mb-0.5">فودافون كاش / إنستاباي</p>
                      <p className="text-xl font-black text-gray-800 tracking-wider" dir="ltr">0100 000 0000</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="https://wa.me/201000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] text-white font-black text-xs py-2.5 rounded-xl hover:bg-[#1ebe5d] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        أبلغ الأدمن بعد التحويل
                      </a>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold text-xs py-2.5 rounded-xl"
                        disabled={cancelMutation.isPending}
                        onClick={() => {
                          if (confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
                            cancelMutation.mutate(order.orderId);
                          }
                        }}
                      >
                        إلغاء الطلب
                      </Button>
                    </div>
                  </div>
                )}

                {/* Per-Order Referral Share */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 border-t border-purple-100">
                  <h5 className="text-sm font-black text-purple-800 mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    شارك هذا المنتج ووفر أكثر!
                  </h5>
                  <p className="text-xs text-purple-600 font-bold mb-3">
                    ادعُ أصدقاءك لشراء هذا المنتج باستخدام الكود الخاص بك واحصل على خصم على طلبك الحالي.
                  </p>
                  <div className="flex gap-2 items-center bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <input
                      readOnly
                      value={orderReferralLink}
                      className="flex-1 px-3 py-1.5 text-xs text-gray-600 outline-none bg-transparent"
                      dir="ltr"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(orderReferralLink);
                        setCopiedLink(order.orderId);
                        setTimeout(() => setCopiedLink(null), 2000);
                      }} 
                      className="bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                    >
                      {copiedLink === order.orderId ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {/* Show specific referral progress if any friends joined */}
                  {referralProgress.referrals.length > 0 && (
                     <div className="mt-3 text-xs text-purple-700 font-bold bg-white/60 p-2 rounded-lg">
                       أصدقاء اشتروا من خلالك: {referralProgress.referrals.length} صديق (+{referralProgress.totalDiscountEarned}ج خصم)
                     </div>
                  )}
                </div>
              </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
