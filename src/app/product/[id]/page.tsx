"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Package, User, Phone, MapPin, AlertCircle, Tag, ShoppingCart, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProduct } from "@/hooks/use-products";
import { useActiveCarton } from "@/hooks/use-carton";
import { useCreateOrder } from "@/hooks/use-create-order";
import { useCustomerDashboard } from "@/hooks/use-customer";
import { VILLAGES } from "@/lib/constants";

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

      const successParams = new URLSearchParams({
        product: product.name,
        productId: product.id,
        carton: String(result.cartonNumber),
        price: String(result.finalPrice),
        ref: result.personalReferralCode,
        name: formData.customerFullName,
      });
      router.push(`/order-success?${successParams.toString()}`);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const isFormValid = formData.customerFullName && formData.customerPhone && formData.villageName;

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">المنتج غير موجود</h1>
        <p className="text-gray-500 mb-6">عذراً، لم نتمكن من العثور على هذا المنتج أو أنه غير متاح حالياً.</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Button>
        </Link>
      </div>
    );
  }

  const cartonProgress = carton && carton.capacity > 0 ? (carton.confirmedCount / carton.capacity) * 100 : 0;
  const remainingCount = carton ? carton.capacity - carton.confirmedCount : product.cartonCapacity;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-background" dir="rtl">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors font-bold">
          <ArrowRight className="w-4 h-4" /> رجوع للمنتجات
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Details Column */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-900/5 relative overflow-hidden border border-emerald-50 mb-6">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl font-bold text-sm">
                سعر الجملة 🚀
              </div>
              
              <div className="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center mt-4 overflow-hidden relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-32 h-32 text-gray-300" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-500 font-bold flex items-center gap-2">
                    <Tag className="w-5 h-5" /> السعر العادي
                  </span>
                  <span className="font-bold line-through text-gray-400 text-lg">
                    {product.standardPrice}ج
                  </span>
                </div>

                <div className="flex justify-between items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <span className="text-emerald-700 font-black flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> سعر الكارتونة
                  </span>
                  <div className="text-left">
                    <span className="font-black text-3xl text-emerald-600 block leading-none mb-1">
                      {product.wholesalePrice}ج
                    </span>
                    <span className="text-xs font-bold text-emerald-600/70">
                      للقطعة الواحدة
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                  <span className="text-purple-700 font-bold flex items-center gap-2 text-sm">
                    <Users className="w-5 h-5" /> السعر بعد خصم الإحالة
                  </span>
                  <span className="font-black text-2xl text-purple-600">
                    {product.minDiscountPrice}ج
                  </span>
                </div>
              </div>
            </div>

            {/* Carton Status */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-500" /> حالة الكارتونة الحالية
                </h3>
                {carton && (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                    رقم #{carton.cartonNumber}
                  </span>
                )}
              </div>
              
              {isCartonLoading ? (
                <div className="animate-pulse flex gap-2 items-center">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative"
                      style={{ width: `${Math.min(cartonProgress, 100)}%` }}
                    >
                      {cartonProgress > 0 && cartonProgress < 100 && (
                        <div className="absolute top-0 bottom-0 right-0 left-0 w-full bg-white/20 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-emerald-600">تم حجز {carton?.confirmedCount || 0} قطعة</span>
                    <span className="font-bold text-gray-500">باقي {remainingCount} لتكتمل</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Booking Form Column */}
          <div>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-8">
              <h3 className="text-2xl font-black text-gray-800 mb-2">احجز قطعتك الآن 🎯</h3>
              <p className="text-sm text-gray-500 mb-8">
                أدخل بياناتك لحجز قطعتك في كارتونة <span className="font-black text-emerald-600">{product.name}</span>
              </p>

              <div className="space-y-5">
                {customerData ? (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-bold">أنت تسجل كـ</p>
                        <p className="font-black text-gray-800">{customerData.fullName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm font-bold text-gray-600">
                      <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-lg border border-emerald-50">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span dir="ltr">{customerData.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-lg border border-emerald-50">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{customerData.villageName}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-black text-gray-700 mb-2 block">
                        الاسم بالكامل
                      </label>
                      <Input
                        icon={<User className="w-5 h-5 text-gray-400" />}
                        value={formData.customerFullName}
                        onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                        placeholder="محمد أحمد"
                        className="h-14 text-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black text-gray-700 mb-2 block">
                        رقم الواتساب
                      </label>
                      <Input
                        icon={<Phone className="w-5 h-5 text-gray-400" />}
                        type="tel"
                        dir="ltr"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        placeholder="01xxxxxxxxx"
                        className="h-14 text-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black text-gray-700 mb-2 block flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> القرية / المنطقة
                      </label>
                      <select
                        value={formData.villageName}
                        onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                        className="flex h-14 w-full rounded-xl border border-input bg-white px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all"
                      >
                        <option value="">اختار منطقتك...</option>
                        {VILLAGES.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {formData.referralCode && (
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-black border border-emerald-200 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    كود الإحالة: {formData.referralCode} ✅
                  </div>
                )}

                {createOrderMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl font-bold">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    حصل مشكلة في الحجز، تأكد من البيانات وحاول تاني
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full text-xl font-black h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 mt-4"
                  onClick={handleSubmit}
                  disabled={!isFormValid || createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" /> جاري الحجز...
                    </span>
                  ) : (
                    "تأكيد الحجز 🎯"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
