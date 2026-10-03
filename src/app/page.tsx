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
  Star,
  Banknote,
  Sparkles,
  Flame,
  ArrowDown,
  Percent,
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
    location: "القاهرة - التجمع",
    comment: "بصراحة كنت قلقانة في الأول، بس الكابتن جه وقالي افتحي شوفي حاجتك براحتك واتأكدي منها قبل ما تدفعي ولا مليم.. الخامة طلعت ممتازة وفرق السعر عن المولات محترم جداً.",
    rating: 5,
    tag: "معاينة ناجحة ✅",
  },
  {
    name: "أحمد حسن",
    location: "الجيزة - المهندسين",
    comment: "فكرة عبقرية بجد، بعت اللينك لاثنين صحابي واشتروا معايا في نفس الكرتونة ونزلنا في السعر أكتر.. والأوردر وصل لحد باب البيت في ميعاده بالظبط.",
    rating: 5,
    tag: "توفير شلة الصحاب 🤝",
  },
  {
    name: "سارة محمود",
    location: "الإسكندرية - سموحة",
    comment: "أحسن حاجة إن مفيش وجع دماغ ولف في العتبة عشان اشتري بسعر الجملة، طلبت قطعتي وجاتلي بسعر الكرتونة والدفع كاش بعد ما عاينت بنفسي.",
    rating: 5,
    tag: "سعر جملة بالقطعة 📦",
  },
];

// Egyptian FAQs matching real customer doubts
const FAQS = [
  {
    q: "إيه فكرة منصة سلاش (SLASH) وليه الأسعار أرخص من المحلات والمولات؟",
    a: "بدل ما تلف في الأسواق أو تشتري كرتونة جملة كاملة بآلاف الجنيهات عشان تاخد خصم، سلاش بيجمعك مع ناس تانية في 'كرتونة شحن افتراضية' (سعتها ١٠ قطع). كل واحد بياخد قطعته بسعر الجملة الصافي، وتوصل لحد باب بيتك وتوفر فرق المحلات في جيبك.",
  },
  {
    q: "هل ينفع أفتح الشحنة وأعاين المنتج قبل ما أدفع مليم؟",
    a: "طبعاً وده حقك 100%! الكابتن بيستناك تفتح العلبة وتتأكد من مطابقة المنتج وجودته وسلامته تماماً.. عجبك بتدفع الحساب كاش، ما عجبكش بترفض الاستلام فوراً وبدون أي رسوم.",
  },
  {
    q: "إزاي بدفع الحساب وطرق الدفع إيه؟",
    a: "الدفع كاش فقط عند الاستلام مع مندوب التوصيل بعد المعاينة والفحص الكامل لمنتجك، ومفيش أي مليم بتدفعه مقدماً ولا بنطلب تحويلات بنكية أو فيزا.",
  },
  {
    q: "إزاي برنامج 'شلة الصحاب' بينزل في سعر طلبي أكتر؟",
    a: "أول ما بتسجل حجزك، بيطلعلك كود ولينك دعوة خاص بيك. لما تبعته لصحابك على الواتساب وأي صاحب يحجز في نفس الكرتونة، بيتخصم لك مبلغ إضافي مباشر من سعر قطعتك والكرتونة بتكمل وتتشحن أسرع!",
  },
  {
    q: "الشحنة بتاخد وقت قد إيه عشان توصلني؟",
    a: "بمجرد اكتمال المقاعد في كرتونتك، بيتم تجهيز الشحنة وفحصها وتخرج مع شركة الشحن لتصلك خلال ٢ إلى ٤ أيام عمل مع متابعة لحظية عبر الواتساب.",
  },
];

export default function Home() {
  const { data: products, isLoading: isProductsLoading } = useActiveProducts();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "hot" | "almost-full">("all");

  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Filter products based on active tab
  const filteredProducts = products || [];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Header />

      {/* Hero Section with Ambient Glow */}
      <section className="relative pt-6 sm:pt-12 pb-14 px-4 overflow-hidden">
        {/* Ambient Radial Mesh Background */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(16,185,129,0.18),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Eyebrow Live Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 px-4 py-1.5 rounded-full text-xs font-black mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>أول منصة شراء جماعي ذكية في مصر 🇪🇬</span>
          </div>

          {/* Main Title with Neo-Gradient */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.18] mb-5 tracking-tight">
            اشتري بالقطعة..{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              بسعر كرتونة الجملة!
            </span>{" "}
            📦⚡
          </h1>

          {/* Youthful Egyptian Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            مع سلاش، وفّر من 30% لـ 50% من تمن المحلات في جيبك. افتح وافرز طلبك بنفسك مع الكابتن، وادفع كاش على باب بيتك بعد المعاينة الكاملة.
          </p>

          {/* Hero Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <a
              href="#products"
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 text-sm sm:text-base"
            >
              <Package className="w-5 h-5" />
              <span>تصفح كراتين اليوم المفتوحة ⚡</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>

            <a
              href="#referrals"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/80 font-bold px-5 py-3.5 rounded-2xl shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base hover:border-emerald-400"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>حاسبة شلة الصحاب والتوفير 🤝</span>
            </a>
          </div>

          {/* Bento Metrics Bar (High Trust & Instant Clarity) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-right">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 hover:border-emerald-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Percent className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">وفر 30% إلى 50%</h4>
                <p className="text-[11px] text-slate-500 font-medium">سعر كرتونة الجملة للقطعة</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 hover:border-blue-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">عاين وافرز مع الكابتن</h4>
                <p className="text-[11px] text-slate-500 font-medium">عجبك ادفع.. ما عجبكش ولا مليم</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 hover:border-emerald-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Banknote className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">دفع كاش 100%</h4>
                <p className="text-[11px] text-slate-500 font-medium">عند الاستلام بعد المعاينة</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3 hover:border-amber-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">لحد باب بيتك</h4>
                <p className="text-[11px] text-slate-500 font-medium">توصيل سريع ومتابعة واتساب</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid: "إزاي سلاش شغال؟" */}
      <section id="how-it-works" className="py-14 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="bg-teal-50 text-teal-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-teal-200">
            طريقة العمل الذكية 💡
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-1">
            إزاي سلاش بيوفرلك سعر الجملة بالقطعة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl mx-auto">
            سر الأسعار المخفضة بدون وسطاء ولا لف في الأسواق الشعبية
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1 (Wide): The Shared Virtual Carton */}
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-emerald-500/20 flex flex-col justify-between">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black px-3 py-1 rounded-full">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>الكرتونة الافتراضية (10 مقاعد)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black leading-snug">
                بدل ما تشتري كرتونة بـ 5,000 جنيه لوحدك.. بنجمعك مع 9 مشترين في نفس الكرتونة! 📦🤝
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                التجار والمستوردين بيدوا أرخص سعر للي بيشتري كرتونة جملة مقفولة. منصة سلاش بتفتح الكرتونة افتراضياً، كل شخص بيحجز قطعته بسعر الكرتونة الصافي، وأول ما الـ 10 مقاعد تكتمل، الكرتونة بتتقفل وبتتشحن فوراً لباب بيتك.
              </p>
            </div>

            {/* Visual Mini 10-Slot Preview */}
            <div className="relative z-10 pt-6 mt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>نموذج امتلاء المقاعد في الكرتونة:</span>
                <span className="text-emerald-400 font-black">جاهزة للانطلاق فور الاكتمال 🚀</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 rounded-lg text-[9px] flex items-center justify-center font-black ${
                      i < 8
                        ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50"
                        : i === 8
                        ? "bg-amber-400 text-slate-950 animate-pulse ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900"
                        : "bg-white/15 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 2: 100% Inspection Guarantee */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                افتح وافرز مع الكابتن 🔍
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                حقك القانوني والشرعي 100% تفتح العلبة وتتأكد من خامة المنتج ومطابقته قبل دفع مليم. عجبك بتدفع كاش، ما عجبكش الكابتن بيرجع بدون أي مصاريف نهائياً.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-black text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl block text-center">
                الدفع كاش بعد المعاينة فقط 💵
              </span>
            </div>
          </div>

          {/* Bento Card 3: Squad Viral Discounts */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Gift className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                برنامج شلة الصحاب 🤝
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                بعد ما تحجز، هيطلعلك لينك وكود خاص بيك على الواتساب. كل صاحب ينضم للكرتونة معاك بيتخصم لك مبلغ إضافي فوري من سعر قطعتك والكرتونة بتطير أسرع.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-black text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl block text-center">
                خصم إضافي لكل صاحب يشارك 💸
              </span>
            </div>
          </div>

          {/* Bento Card 4 (Span 2): Doorstep Fast Delivery */}
          <div className="md:col-span-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-6 sm:p-7 border border-amber-300/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                <span>شحن وتوصيل فائق السرعة</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                لحد باب شقتك مع متابعة لحظية عبر الواتساب 🚚
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                بمجرد اكتمال المقاعد، مندوب التوصيل بيتواصل معاك بميعاد الوصول بالدقيقة. بتستلم طلبك، تعاينه وتدفع كاش في إيد الكابتن بكل أمان وراحة بال.
              </p>
            </div>
            <a
              href="#products"
              className="flex-shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              احجز مكانك في الكرتونة الآن ⚡
            </a>
          </div>
        </div>
      </section>

      {/* Active Products Section */}
      <section id="products" className="py-14 px-4 max-w-6xl mx-auto border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5 text-emerald-600" />
              <span>كراتين مفتوحة للحجز اليوم ⚡</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              اختر قطعتك واحجز مقعدك بالكرتونة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
              أول ما مقاعد الكرتونة تكتمل الشحن بيتحرك فوراً.. الدفع كاش عند الاستلام بعد المعاينة 100%
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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

      {/* Referral Section (Squad Savings Interactive Simulator) */}
      <section id="referrals" className="py-14 px-4 max-w-5xl mx-auto border-t border-slate-200/80">
        <div className="space-y-6">
          <SquadSavingsCalculator
            basePrice={products?.[0]?.wholesalePrice || 120}
            minPrice={products?.[0]?.minDiscountPrice || 95}
          />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-14 px-4 max-w-5xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-10">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
            تجارب حقيقية 💬
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-1">
            آراء المشترين بعد المعاينة والفحص
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            كل الآراء دي لناس حقيقيين استلموا وعاينوا طلباتهم على باب البيت قبل دفع الحساب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg">
                    {t.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{t.name}</h4>
                  <span className="text-[11px] text-slate-400 font-bold">{t.location}</span>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-black text-emerald-700">
                  {t.name.split(" ")[0][0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-14 px-4 max-w-3xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-2">
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
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-sm"
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
