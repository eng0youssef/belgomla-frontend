"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Package,
  ShieldCheck,
  Truck,
  Users,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Gift,
  HelpCircle,
  Clock,
  Star,
  Banknote,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { useActiveProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";

// Testimonials data
const TESTIMONIALS = [
  {
    name: "مروة عبد الرحمن",
    location: "المنصورة - حي الجامعة",
    comment: "تجربة ممتازة وتوفير حقيقي مقارنة بأسعار السوق، والمندوب أتاح لي فحص ومعاينة المنتج بالكامل قبل السداد.",
    rating: 5,
    tag: "توفير ٣٠٠ ج.م",
  },
  {
    name: "إبراهيم حسن",
    location: "بلقاس",
    comment: "اشتركت مع اثنين من أصدقائي وحصلنا على خصم إضافي، ووصلت الشحنة لباب المنزل في الموعد المحدد.",
    rating: 5,
    tag: "شراء جماعي",
  },
  {
    name: "سارة محمود",
    location: "شربين",
    comment: "الدفع بالكامل عند الاستلام بعد معاينة المنتج والتأكد من جودته ومطابقته للمواصفات.",
    rating: 5,
    tag: "عميلة موثقة",
  },
];

// FAQs data
const FAQS = [
  {
    q: "ما هي فكرة منصة سلاش (SLASH)؟",
    a: "منصة تسوّق تتيح لك شراء المنتجات بأسعار الجملة للقطعة الواحدة مباشرة وتوصيلها حتى باب منزلك.",
  },
  {
    q: "كيف يتم سداد قيمة الطلب؟",
    a: "يتم سداد المبلغ بالكامل عند الاستلام بعد معاينة وفحص الشحنة مع مندوب التوصيل.",
  },
  {
    q: "هل يمكنني معاينة المنتج قبل السداد؟",
    a: "نعم بالتأكيد، يحق لك فتح الشحنة والتأكد من سلامة المنتج ومطابقته للمواصفات بنسبة 100% قبل إتمام عملية الدفع.",
  },
  {
    q: "كيف يعمل برنامج مشاركة الأصدقاء لتخفيض السعر؟",
    a: "عند تسجيل طلبك تحصل على رابط مخصص؛ مع كل صديق ينضم للشراء من خلال الرابط، يُحتسب لك خصم إضافي ينعكس مباشرة على إجمالي طلبك.",
  },
];

export default function Home() {
  const { data: products, isLoading: isProductsLoading } = useActiveProducts();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfd]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Single Simple Professional Hero Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-snug max-w-3xl mx-auto mb-8 tracking-tight">
            مع سلاش.. السعر ببلاش! تسوّق بالقطعة <span className="text-emerald-700">بأسعار الجملة</span> مع المعاينة الكاملة والدفع عند الاستلام.
          </h1>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <a href="#products">
              <Button size="lg" className="w-full sm:w-auto text-base font-bold px-8 h-12 rounded-xl shadow-sm bg-emerald-700 hover:bg-emerald-800 text-white">
                تصفح المنتجات المتاحة
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-bold px-6 h-12 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-700">
                كيف يعمل الموقع؟
              </Button>
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-right">
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">سعر الجملة</h4>
                <p className="text-[11px] text-slate-500 font-medium">للشراء بالقطعة</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">معاينة كاملة</h4>
                <p className="text-[11px] text-slate-500 font-medium">قبل دفع الحساب</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">دفع عند الاستلام</h4>
                <p className="text-[11px] text-slate-500 font-medium">بعد المعاينة والفحص</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">توصيل سريع</h4>
                <p className="text-[11px] text-slate-500 font-medium">لباب المنزل</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Products Section */}
      <section id="products" className="py-14 px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            المنتجات المتاحة
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700 mb-1">
                لا توجد منتجات مفتوحة للحجز حالياً
              </p>
              <p className="text-xs text-slate-500 font-medium">
                سيتم إضافة منتجات جديدة قريباً، تواصل معنا عبر الواتساب للاستفسار.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center mb-12">
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-md">
            آلية الشراء
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-2">
            كيف يعمل موقع سلاش؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
            خطوات بسيطة ومباشرة للحصول على أسعار الجملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3.5 right-6 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
              ١
            </div>
            <div>
              <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                اختر المنتج
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                تصفح المنتجات المتاحة واطلب ما تحتاجه بسعر الجملة مباشرة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              سعر الجملة من أول قطعة
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3.5 right-6 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
              ٢
            </div>
            <div>
              <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                سجّل بيانات الطلب
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                أدخل بيانات التوصيل الخاصة بك لتأكيد طلبك وتجهيز الشحن لمنطقتك بسهولة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              تأكيد فوري للطلب
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-xs">
            <div className="absolute -top-3.5 right-6 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
              ٣
            </div>
            <div>
              <div className="w-11 h-11 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                المعاينة والاستلام
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                يصلك مندوب الشحن حتى باب منزلك، تفتح الشحنة وتعاين المنتج بنفسك قبل سداد قيمة الطلب.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              دفع عند الاستلام بعد الفحص
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referrals" className="py-14 px-4 max-w-5xl mx-auto">
        <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-2xl overflow-hidden relative shadow-lg">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-md text-xs font-bold mb-4">
                <Gift className="w-4 h-4" />
                <span>برنامج مشاركة التوفير</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-snug">
                ضاعف التوفير مع الأصدقاء
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                بعد تأكيد طلبك، شارك رابط الحجز مع أصدقائك ومعارفك. مع كل طلب إضافي يكتمل من خلالك، تحصل على خصم مباشر إضافي على طلبك.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-200">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  خصم مباشر لكل صديق
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  اكتمال أسرع للشحن
                </span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                مستويات التوفير الإضافي:
              </h3>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span>طلب فردي</span>
                  <span className="text-slate-300 font-bold">سعر الجملة المباشر</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-emerald-400/20">
                  <span>صديق واحد مشارك</span>
                  <span className="text-emerald-300 font-bold">خصم إضافي</span>
                </div>
                <div className="flex items-center justify-between bg-emerald-500/20 p-3 rounded-lg border border-emerald-400/40">
                  <span>٣ أصدقاء مشاركين</span>
                  <span className="text-emerald-300 font-bold">الحد الأقصى للتوفير</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-14 px-4 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center mb-10">
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-md">
            تجارب العملاء
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            آراء المشترين
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تجارب حقيقية لعملاء استلموا طلباتهم بعد المعاينة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{t.location}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {t.name.split(" ")[0][0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-14 px-4 max-w-3xl mx-auto border-t border-slate-200/60">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>مركز المساعدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            الأسئلة الشائعة
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            إجابات عن أكثر الاستفسارات المتعلقة بالطلب والتوصيل
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
