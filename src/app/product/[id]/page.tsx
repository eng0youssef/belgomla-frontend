"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Package,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Tag,
  ShoppingCart,
  Users,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProduct } from "@/hooks/use-products";
import { useActiveCarton } from "@/hooks/use-carton";
import { useCreateOrder } from "@/hooks/use-create-order";
import { useCustomerDashboard } from "@/hooks/use-customer";
import { VILLAGES } from "@/lib/constants";
import { isTrustedImageUrl } from "@/lib/image-utils";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading: isProductLoading, isError: isProductError } = useProduct(productId);
  const { data: carton, isLoading: isCartonLoading } = useActiveCarton(productId);
  const { data: customerData } = useCustomerDashboard();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    customerFullName: "",
    customerPhone: "",
    villageName: "",
    referralCode: "",
  });

  // Pre-fill form from customer data if available
  useEffect(() => {
    if (customerData) {
      setFormData((prev) => ({
        ...prev,
        customerFullName: customerData.fullName,
        customerPhone: customerData.phoneNumber,
        villageName: customerData.villageName,
      }));
    }
  }, [customerData]);

  // Pre-fill referral code from URL query param (?ref=CODE)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get("ref");
    if (ref) {
      setFormData((prev) => ({ ...prev, referralCode: ref }));
    }
  }, []);

  const handleSubmit = async () => {
    if (!formData.customerFullName || !formData.customerPhone || !formData.villageName || !product) return;

    try {
      const result = await createOrderMutation.mutateAsync({
        productId,
        customerFullName: formData.customerFullName,
        customerPhone: formData.customerPhone,
        villageName: formData.villageName,
        referralCode: formData.referralCode || null,
      });

      router.push(`/order-success?orderId=${result.orderId}`);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const isFormValid = formData.customerFullName && formData.customerPhone && formData.villageName;

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center" dir="rtl">
        <Package className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-black text-slate-800 mb-2">المنتج مش موجود أو غير متاح حالياً</h1>
        <p className="text-slate-500 font-bold mb-6">عذراً، يبدو إن الرابط غير صحيح أو الكرتونة اتقفلت.</p>
        <Link href="/">
          <Button className="gap-2 font-black rounded-xl">
            <ArrowRight className="w-4 h-4" /> العودة للمنتجات المتاحة
          </Button>
        </Link>
      </div>
    );
  }

  const capacity = carton?.capacity || product.cartonCapacity || 10;
  const confirmedCount = carton?.confirmedCount || 0;
  const remainingCount = Math.max(0, capacity - confirmedCount);
  const cartonProgress = capacity > 0 ? (confirmedCount / capacity) * 100 : 0;
  const savingsAmount = product.standardPrice - product.wholesalePrice;
  // Product-specific deposit amount (defaults dynamically if not explicitly specified)
  const depositAmount = (product as any).depositAmount || (product.wholesalePrice > 500 ? Math.round(product.wholesalePrice * 0.15) : 50);
  const remainingOnDelivery = Math.max(0, product.wholesalePrice - depositAmount);

  return (
    <main className="min-h-screen bg-[#fbfcfd]" dir="rtl">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-emerald-700 mb-6 transition-colors font-bold group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>الرجوع لكل المنتجات المتاحة</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left/Main Column: Product Info & Live Carton Visuals (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Card */}
            <div className="clean-card p-5 sm:p-7 bg-white">
              {/* Product Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  حجز مباشر بسعر الجملة
                </span>
                {savingsAmount > 0 && (
                  <span className="bg-amber-50 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200/80">
                    وفرت {savingsAmount} ج.م في القطعة!
                  </span>
                )}
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 mb-6">
                {isTrustedImageUrl(product.imageUrl) ? (
                  <Image
                    src={product.imageUrl!}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <Package className="w-24 h-24 stroke-[1.5]" />
                    <span className="text-sm text-slate-400 font-medium mt-2">صورة المنتج</span>
                  </div>
                )}
              </div>

              {/* Title & Specs */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Pricing Breakdown Box */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">سعر المحلات القطاعي العادي:</span>
                  <span className="font-bold line-through text-slate-400 text-base">
                    {product.standardPrice} ج.م
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div>
                    <span className="text-sm font-black text-emerald-800 block">
                      سعر الجملة للقطعة الواحدة
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      من غير ما تشتري كرتونة كاملة
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-700 leading-none">
                      {product.wholesalePrice}
                    </span>
                    <span className="text-sm font-bold text-emerald-800 mr-1">ج.م</span>
                  </div>
                </div>

                {product.minDiscountPrice < product.wholesalePrice && (
                  <div className="flex items-center justify-between bg-purple-50/80 border border-purple-100 rounded-xl p-3 text-xs text-purple-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-600" />
                      سعر شلة الصحاب (لما تدعو صحابك):
                    </span>
                    <span className="font-black text-purple-700 text-base">
                      {product.minDiscountPrice} ج.م
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Carton Status Card */}
            <div className="clean-card p-5 sm:p-6 bg-white space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    حالة الكرتونة #{carton?.cartonNumber || 1}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    الكرتونة سعتها {capacity} قطع تتوزع على المشترين
                  </p>
                </div>
                <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {confirmedCount} من {capacity} محجوز
                </span>
              </div>

              {/* Visual Slots Grid */}
              <div>
                <p className="text-xs font-bold text-slate-600 mb-2.5">
                  مقاعد الكرتونة:
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: capacity }).map((_, index) => {
                    const isFilled = index < confirmedCount;
                    const isNextSlot = index === confirmedCount;

                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border text-center transition-all ${
                          isFilled
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
                            : isNextSlot
                            ? "bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-300 ring-offset-1 animate-pulse"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                        title={isFilled ? `قطعة محجوزة #${index + 1}` : `قطعة متبقية #${index + 1}`}
                      >
                        {isFilled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isNextSlot ? (
                          <span className="text-[10px] font-black leading-none">مكانك هنا</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Summary Message */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="text-xs leading-relaxed">
                  {remainingCount > 0 ? (
                    <span className="text-slate-700 font-bold">
                      يتبقى <strong className="text-emerald-700 font-black">{remainingCount} حجز</strong> فقط وتكتمل الكرتونة ونبدأ شحنها فوراً لباب بيتك!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-black">
                      الكرتونة اكتملت بالكامل وجاري تجهيز الشحن للمشترين! 🎉
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Shopping Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="clean-card p-4 bg-white text-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-black text-slate-800">معاينة قبل الدفع</h4>
                <p className="text-[11px] text-slate-500 font-medium">عاين وتأكد مع المندوب قبل دفع الباقي</p>
              </div>
              <div className="clean-card p-4 bg-white text-center space-y-1">
                <Truck className="w-6 h-6 text-blue-600 mx-auto" />
                <h4 className="text-xs font-black text-slate-800">توصيل لباب البيت</h4>
                <p className="text-[11px] text-slate-500 font-medium">في المنصورة وكل مراكز الدقهلية</p>
              </div>
              <div className="clean-card p-4 bg-white text-center space-y-1">
                <Tag className="w-6 h-6 text-amber-600 mx-auto" />
                <h4 className="text-xs font-black text-slate-800">سعر جملة حقيقي</h4>
                <p className="text-[11px] text-slate-500 font-medium">وفر فرق المحلات في جيبك</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Form (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="clean-card p-5 sm:p-7 bg-white shadow-lg border-slate-200">
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-xl font-black text-slate-900">
                  احجز قطعتك دلوقتي 🎯
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  سجل بياناتك ومكانك في الكرتونة هيتحجز فوراً
                </p>
              </div>

              <div className="space-y-4">
                {customerData ? (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 font-bold">تسجيل سريع بحسابك</p>
                        <p className="font-black text-slate-900 text-sm">{customerData.fullName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 pt-1 border-t border-emerald-100">
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-emerald-100">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span dir="ltr">{customerData.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-emerald-100">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{customerData.villageName}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block">
                        الاسم ثلاثي
                      </label>
                      <Input
                        icon={<User className="w-4 h-4 text-slate-400" />}
                        value={formData.customerFullName}
                        onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                        placeholder="محمد أحمد علي"
                        className="h-12 text-sm bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block">
                        رقم الواتساب (للتأكيد ومتابعة الشحن)
                      </label>
                      <Input
                        icon={<Phone className="w-4 h-4 text-slate-400" />}
                        type="tel"
                        dir="ltr"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        placeholder="01012345678"
                        className="h-12 text-sm bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block">
                        المنطقة / المركز (في الدقهلية)
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                          value={formData.villageName}
                          onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                          className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        >
                          <option value="">اختار منطقتك أو قريتك...</option>
                          {VILLAGES.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Referral Code (if present) */}
                {formData.referralCode && (
                  <div className="bg-purple-50 text-purple-800 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-purple-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-purple-600" />
                      كود دعوة صديق: <span dir="ltr" className="font-black">{formData.referralCode}</span>
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                )}

                {/* Payment Calculation Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-bold">
                    <span>سعر الجملة للقطعة:</span>
                    <span>{product.wholesalePrice} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-700 font-bold border-t border-slate-200/60 pt-2">
                    <span>العربون المطلوب لتأكيد حجزك:</span>
                    <span className="font-black text-sm">{depositAmount} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>باقي المبلغ عند الاستلام (بعد المعاينة):</span>
                    <span className="font-bold">{remainingOnDelivery} ج.م</span>
                  </div>
                </div>

                {createOrderMutation.isError && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    حدث خطأ أثناء الحجز، يرجى التأكد من صحة البيانات والمحاولة مرة أخرى.
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  size="lg"
                  className="w-full text-base font-black h-13 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md mt-2"
                  onClick={handleSubmit}
                  disabled={!isFormValid || createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> جاري تسجيل حجزك...
                    </span>
                  ) : (
                    "تأكيد الحجز ومتابعة العربون 🎯"
                  )}
                </Button>

                <p className="text-[11px] text-slate-400 text-center font-bold">
                  🔒 بياناتك آمنة تماماً، ولن يتم خصم أي مبالغ إضافية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

