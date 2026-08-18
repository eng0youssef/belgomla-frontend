"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Gift,
  HelpCircle,
  Clock,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ActivityTicker from "@/components/ActivityTicker";
import Footer from "@/components/Footer";
import { useActiveProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";

// Testimonials data (authentic Egyptian voice)
const TESTIMONIALS = [
  {
    name: "مروة عبد الرحمن",
    location: "المنصورة - حي الجامعة",
    comment: "فكرة عبقرية بجد! اشتريت طقم الكاسات وفرت فيه تقريباً 300 جنيه عن سعر السوق في المشاية، والمندوب خلاني افتح الكرتونة واعاين كل قطعة قبل ما ادفع باقي الحساب.",
    rating: 5,
    tag: "وفرت 300 ج.م",
  },
  {
    name: "إبراهيم حسن",
    location: "بلقاس",
    comment: "كنت متردد في الأول عشان موضوع الكرتونة، بس أول ما الكرتونة اكتملت اتصلوا بيا والشحنة وصلت تاني يوم على طول. بعت اللينك لـ 2 من صحابي وخدنا خصم إضافي كمان.",
    rating: 5,
    tag: "وفر مع شلة صحابه",
  },
  {
    name: "سارة محمود",
    location: "شربين",
    comment: "أحسن حاجة إن العربون 50 جنيه بس لضمان الجدية، والباقي بتدفعه لما تمسك الحاجة في إيدك وتتأكد إنها سليمة 100%. شكراً لفريق بالجملة على الأمانة.",
    rating: 5,
    tag: "عميلة مميزة",
  },
];

// FAQs data
const FAQS = [
  {
    q: "يعني إيه فكرة موقع 'بالجملة'؟",
    a: "بدل ما تضطر تشتري كرتونة كاملة من التاجر عشان تاخد سعر الجملة، إحنا بنجمعك مع ناس تانية في نفس منطقتك محتاجين نفس المنتج. كل واحد بيحجز قطعتين أو قطعة واحدة بسعر الجملة، ولما الكرتونة تكتمل بنشحنها لكل واحد لحد باب بيته.",
  },
  {
    q: "ليه بنطلب عربون رمزي عند الحجز؟",
    a: "العربون الرمزي (بيختلف حسب سعر كل منتج) هدفه الوحيد هو إثبات جدية الحجز، عشان نضمن إن كل المقاعد في الكرتونة محجوزة بجد ومفيش شخص يحجز ويعطل باقي الناس اللي مستنيين الكرتونة تتقفل وتطلع للشحن.",
  },
  {
    q: "هل ينفع أعاين المنتج قبل ما أدفع باقي الحساب؟",
    a: "طبعاً وبنشترط ده! لما المندوب يوصلك، بتفتح الشحنة وتتأكد من سلامة المنتج ومطابقته للمواصفات تماماً قبل ما تدفع باقي المبلغ للمندوب.",
  },
  {
    q: "هل متاح استرجاع بعد الاستلام؟",
    a: "بما إن البيع بسعر الجملة المباشر من التاجر والتوفير حقيقي، فالاستلام بيتم بعد المعاينة الكاملة والفحص الدقيق مع المندوب لضمان استلامك منتج سليم 100% وخالي من أي عيوب قبل إنهاء الأوردر.",
  },
  {
    q: "إزاي ميزة 'شلة التوفير' بتخفضلي السعر أكتر؟",
    a: "أول ما بتعمل أوردر بتاخد كود ورابط دعوة خاص بيك. كل صاحب يشتري في نفس الكرتونة من خلال اللينك بتاعك بيخصملك من تمن قطعتك وبتنزل تلقائياً في حسابك!",
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
    <main className="min-h-screen bg-[#fbfcfd]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-4 sm:mb-6 tracking-tight">
            اشتري قطعتك <span className="text-emerald-700">بسعر الجملة</span> من التاجر مباشرة
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            بنجمع طلبك مع مشترين في نفس محافظتك لشراء كرتونة كاملة بسعر الجملة، مع التوصيل لباب بيتك والمعاينة الكاملة قبل دفع باقي الحساب.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a href="#products">
              <Button size="lg" className="w-full sm:w-auto text-base font-black px-8 h-12 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700">
                تصفح المنتجات المتاحة
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-bold px-6 h-12 rounded-xl border-slate-300">
                طريقة عمل الموقع
              </Button>
            </a>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-right sm:text-center">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">+1,200</p>
                <p className="text-[11px] text-slate-500 font-bold">كرتونة مكتملة</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">+250,000 ج</p>
                <p className="text-[11px] text-slate-500 font-bold">إجمالي التوفير</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">معاينة كاملة</p>
                <p className="text-[11px] text-slate-500 font-bold">عند الاستلام</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">توصيل مباشر</p>
                <p className="text-[11px] text-slate-500 font-bold">لمحافظة الدقهلية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-slate-100 text-slate-700 text-xs font-black px-3 py-1 rounded-full">
            خطوات بسيطة ومضمونة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-3">
            إزاي بتشتري بسعر الجملة في ٣ خطوات؟
          </h2>
          <p className="text-sm text-slate-500 font-bold max-w-xl mx-auto">
            من غير ما تشتري كميات كبيرة ومن غير وجع دماغ.. رحلة طلبك من الحجز لحد الاستلام
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="clean-card p-6 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm">
              ١
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                اختار قطعتك بسعر الجملة
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                تصفح المنتجات وشوف التوفير الحقيقي مقارنة بسعر المحلات القطاعي. بتختار العدد اللي محتاجه حتى لو قطعة واحدة!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              سعر تاجر الجملة من أول قطعة
            </div>
          </div>

          {/* Step 2 */}
          <div className="clean-card p-6 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm">
              ٢
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                احجز وحوّل عربون التأكيد
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                بتملأ بياناتك وبتحول العربون الرمزي المحدد للمنتج على فودافون كاش أو إنستاباي لتثبيت مكانك في الكرتونة مع باقي المشترين.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              عربون تأكيد الجدية بس
            </div>
          </div>

          {/* Step 3 */}
          <div className="clean-card p-6 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm">
              ٣
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                عاين واستلم عند باب بيتك
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                أول ما الكرتونة تكتمل بنشحنلك فوراً. المندوب بيوصلك وتفتح الشحنة تعاينها بنفسك وتتأكد منها قبل ما تدفع باقي الحساب!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              معاينة كاملة مع المندوب
            </div>
          </div>
        </div>
      </section>

      {/* Active Products Section */}
      <section id="products" className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                كراتين مفتوحة حالياً للحجز
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              المنتجات المتاحة للحجز الآن 📦
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-bold">
            الحق مكانك في الكرتونة قبل ما تكتمل وتتقفل!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-black text-slate-700 mb-1">
                لا توجد منتجات مفتوحة للحجز حالياً
              </p>
              <p className="text-xs text-slate-500 font-medium">
                جاري إضافة كراتين جديدة قريباً جداً، تابعنا على الواتساب!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Referral / Viral Group Feature ("شلة التوفير") */}
      <section id="referrals" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="clean-card bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl overflow-hidden relative shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-black mb-4">
                <Gift className="w-4 h-4 text-purple-400" />
                <span>ميزة حصرية: شلة التوفير 🔥</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-snug">
                عايز توفر أكتر؟
                <br />
                <span className="text-emerald-400">لم صحابك في نفس الكرتونة!</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                بعد ما تحجز، بتاخد كود دعوة خاص بيك. ابعته لصحابك على جروب الواتساب.. كل صاحب يدخل ويحجز من خلالك هينزلك خصم فوري على أوردرك، والكرتونة تتقفل وتوصلكم أسرع!
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-200">
                <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  👥 كل صاحب = خصم مباشر
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  ⚡ الكرتونة بتكتمل أسرع
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <h3 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                حسبة الخصم مع الصحاب:
              </h3>

              <div className="space-y-2.5 text-xs font-bold">
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                  <span>حجز لوحدك بسعر الجملة</span>
                  <span className="text-slate-200 font-black">سعر الجملة الأصلي</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-emerald-400/30">
                  <span>دعيت صاحب واحد</span>
                  <span className="text-emerald-300 font-black">خصم إضافي</span>
                </div>
                <div className="flex items-center justify-between bg-emerald-500/20 p-3 rounded-xl border border-emerald-400">
                  <span>دعيت ٣ من صحابك</span>
                  <span className="text-emerald-400 font-black text-sm">أقصى توفير ممكن 🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
            تجارب حقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-2">
            ناس وفرت معانا في الدقهلية ⭐
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            آراء عملاء اشتروا واستلموا وعاينوا حاجتهم بنفسهم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="clean-card p-5 flex flex-col justify-between space-y-4 bg-white">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{t.location}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {t.name.split(" ")[0][0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>كل اللي محتاج تعرفه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            أسئلة بتدور في بالك؟
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            إجابات واضحة ومباشرة عن كل خطوات الشراء
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="clean-card overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-black text-sm sm:text-base text-slate-800 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
      <ActivityTicker />
    </main>
  );
}


