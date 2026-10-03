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
  Sparkles,
  Flame,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import SquadSavingsCalculator from "@/components/SquadSavingsCalculator";
import { useActiveProducts } from "@/hooks/use-products";

// Real Egyptian feedback testimonials
const TESTIMONIALS = [
  {
    name: "مروة عبد الرحمن",
    location: "القاهرة",
    comment: "بصراحة كنت قلقانة في الأول، بس الكابتن جه وقالي افتحي شوفي حاجتك واتأكدي منها قبل ما تدفعي ولا مليم.. الخامة طلعت ممتازة وفرق السعر عن المولات محترم جداً.",
    rating: 5,
  },
  {
    name: "أحمد حسن",
    location: "الجيزة",
    comment: "فكرة عبقرية بجد، بعت اللينك لاثنين صحابي واشتروا معايا في نفس الكرتونة ونزلنا في السعر أكتر.. والأوردر وصل لحد باب البيت في ميعاده بالظبط.",
    rating: 5,
  },
  {
    name: "سارة محمود",
    location: "الإسكندرية",
    comment: "أحسن حاجة إن مفيش وجع دماغ ولف في العتبة عشان اشتري بسعر الجملة، طلبت قطعتي وجاتلي بسعر الكرتونة والدفع كاش بعد ما عاينت بنفسي.",
    rating: 5,
  },
];

// Egyptian FAQs matching real customer doubts
const FAQS = [
  {
    q: "إيه فكرة منصة سلاش (SLASH) وليه الأسعار أرخص من المحلات؟",
    a: "بدل ما تلف في الأسواق أو تشتري كرتونة جملة كاملة بآلاف الجنيهات عشان تاخد خصم، سلاش بيجمعك مع ناس تانية في 'كرتونة شحن افتراضية' (سعتها ١٠ قطع). كل واحد بياخد قطعته بسعر الجملة الصافي، وتوصل لحد باب بيتك وتوفر فرق المحلات في جيبك.",
  },
  {
    q: "هل ينفع أفتح الشحنة وأعاين المنتج قبل ما أدفع مليم؟",
    a: "طبعاً وده حقك 100%! الكابتن بيستناك تفتح العلبة وتتأكد من مطابقة المنتج وسلامته تماماً.. عجبك بتدفع الحساب، ما عجبكش بترفض الاستلام بدون أي رسوم.",
  },
  {
    q: "إزاي بدفع الحساب وطرق الدفع إيه؟",
    a: "الدفع كاش فقط عند الاستلام مع مندوب التوصيل بعد المعاينة والفحص الكامل لمنتجك، ومفيش أي مليم بتدفعه مقدماً.",
  },
  {
    q: "إزاي برنامج 'شلة الصحاب' بينزل في سعر طلبي أكتر؟",
    a: "أول ما بتسجل حجزك، بيطلعلك كود ولينك دعوة خاص بيك. لما تبعته لصحابك على الواتساب وأي صاحب يحجز في نفس الكرتونة، بيتخصم لك مبلغ إضافي مباشر من سعر قطعتك والكرتونة بتكمل وتتشحن أسرع!",
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
      <section className="relative pt-10 sm:pt-14 pb-14 px-4 overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 border border-emerald-300/80 px-3.5 py-1.5 rounded-full text-xs font-black mb-5 shadow-sm">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>أول منصة شراء جماعي ذكية في مصر 🇪🇬</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.15] mb-4 tracking-tight">
            اشتري بالقطعة.. <span className="text-emerald-700">بسعر كرتونة الجملة! 📦🔥</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto mb-7 leading-relaxed">
            مع سلاش.. وفّر فرق المحلات في جيبك. عاين طلبك وافرز حاجتك بنفسك مع الكابتن وادفع كاش على باب بيتك.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <a
              href="#products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 text-sm sm:text-base"
            >
              <Package className="w-5 h-5" />
              <span>تصفح كراتين اليوم المفتوحة ⚡</span>
            </a>
            <a
              href="#referrals"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-5 py-3.5 rounded-2xl shadow-sm transition-all flex items-center gap-2 text-sm sm:text-base hover:border-emerald-300"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>حاسبة شلة الصحاب والتوفير 🤝</span>
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-right">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">سعر الجملة للقطعة</h4>
                <p className="text-[11px] text-slate-500 font-medium">من غير ما تشتري كرتونة كاملة</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">عاين وافرز بنفسك</h4>
                <p className="text-[11px] text-slate-500 font-medium">عجبك ادفع.. ما عجبكش ولا مليم</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">دفع كاش عند الاستلام</h4>
                <p className="text-[11px] text-slate-500 font-medium">فقط بعد المعاينة والفحص</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-amber-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">لحد باب بيتك</h4>
                <p className="text-[11px] text-slate-500 font-medium">توصيل سريع ومتابعة واتساب</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Products Section */}
      <section id="products" className="py-14 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              كراتين وصفقات مفتوحة للحجز ⚡
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
              اختر قطعتك واحجز مقعدك بالكرتونة.. أول ما المقاعد تكتمل الشحن بيتحرك فوراً!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-700 mb-1">
                لا توجد كراتين مفتوحة للحجز حالياً
              </p>
              <p className="text-xs text-slate-500 font-medium">
                سيتم إضافة صفقات جديدة قريباً، تواصل معنا عبر الواتساب للاستفسار.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Referral Section (Youthful & Viral) */}
      <section id="referrals" className="py-14 px-4 max-w-5xl mx-auto">
        <SquadSavingsCalculator
          basePrice={products?.[0]?.wholesalePrice || 120}
          minPrice={products?.[0]?.minDiscountPrice || 95}
        />
      </section>

      {/* Customer Reviews Section */}
      <section className="py-14 px-4 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center mb-10">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
            تجارب حقيقية 💬
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-1">
            آراء المشترين بعد المعاينة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            كل الآراء دي لناس استلمت وعاينت طلباتها على باب البيت قبل ما تدفع
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <span className="text-[10px] text-slate-400">{t.location}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-black text-emerald-700">
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
            <span>مركز المساعدة والمعاينة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            الأسئلة الشائعة
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            كل اللي محتاج تعرفه عن الاستلام والمعاينة وبرنامج شلة الصحاب
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-black text-sm sm:text-base text-slate-800 hover:text-emerald-700 transition-colors"
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
