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
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ActivityTicker from "@/components/ActivityTicker";
import Footer from "@/components/Footer";
import { useActiveProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";

// Testimonials data (authentic Egyptian voice, trust-building)
const TESTIMONIALS = [
  {
    name: "مروة عبد الرحمن",
    location: "المنصورة - حي الجامعة",
    comment: "فكرة ممتازة وتوفير حقيقي، والمندوب فتحلي الشحنة عاينتها قطعة قطعة وتأكدت منها قبل ما أدفع قرش واحد.",
    rating: 5,
    tag: "وفرت 300 ج.م",
  },
  {
    name: "إبراهيم حسن",
    location: "بلقاس",
    comment: "اشتركت أنا و2 من صحابي وأخدنا خصم إضافي، والشحنة وصلت لحد باب البيت والكل مبسوط.",
    rating: 5,
    tag: "وفّر مع صحابه",
  },
  {
    name: "سارة محمود",
    location: "شربين",
    comment: "أكتر حاجة طمنتني إن مفيش أي دفع مسبق أو مقدم.. الدفع كله عند الاستلام بعد المعاينة الكاملة.",
    rating: 5,
    tag: "عميلة مميزة",
  },
];

// FAQs data (concise, clear, trust-focused)
const FAQS = [
  {
    q: "يعني إيه فكرة موقع 'سلاش' (SLASH)؟",
    a: "بدل ما تشتري كرتونة كاملة عشان تاخد سعر الجملة، إحنا بنجمعك مع مشترين في منطقتك.. كل واحد بياخد قطعه بسعر الجملة الأصلي، وبتتشحن لكل واحد لحد باب بيته.",
  },
  {
    q: "هل بدفع أي مبالغ أو مقدم عند الحجز؟",
    a: "لا نهائياً! الحجز مجاني تماماً وبدون أي مقدم. الدفع بيكون عند الاستلام بعد ما تفتح شحنتك وتفحصها بنفسك مع المندوب.",
  },
  {
    q: "هل ينفع أعاين المنتج قبل ما أدفع؟",
    a: "طبعاً وبنشترط ده! لما المندوب يوصلك، بتفتح الشحنة وتتأكد من سلامتها ومطابقتها للمواصفات 100% قبل ما تدفع أي فلوس.",
  },
  {
    q: "إزاي ميزة 'شلة سلاش' بتخفضلي السعر أكتر؟",
    a: "أول ما بتسجل طلبك بتاخد رابط دعوة خاص بيك. كل صاحب يدخل ويحجز من خلالك بينزلك خصم فوري على أوردرك!",
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
      <section className="relative pt-10 pb-14 px-4 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Creative Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-black mb-5 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>مع سلاش.. السعر ببلاش ⚡</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] mb-4 tracking-tight">
            سلاش بيكسرلك الأسعار ✂️
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              اشتري بسعر الجملة
            </span>{" "}
            من أول قطعة!
          </h1>

          {/* Subheading (Concise & Trust-driven) */}
          <p className="text-slate-600 text-sm sm:text-base font-bold max-w-lg mx-auto mb-8 leading-relaxed">
            وفر فرق المحلات في جيبك.. احجز بدون أي مقدّم، عاين وافحص مع المندوب، وادفع عند الاستلام.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a href="#products">
              <Button size="lg" className="w-full sm:w-auto text-base font-black px-8 h-12 rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700">
                تصفح العروض 🔥
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-bold px-6 h-12 rounded-xl border-slate-300 hover:bg-slate-50">
                إزاي بنوفرلك؟
              </Button>
            </a>
          </div>

          {/* Floating Trust Chips (Sleek, minimalist, fast to read) */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs text-xs font-black text-slate-800">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>سعر الجملة للقطعة</span>
            </div>
            <div className="bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs text-xs font-black text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>معاينة وفحص قبل الدفع</span>
            </div>
            <div className="bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs text-xs font-black text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>بدون أي مقدم</span>
            </div>
            <div className="bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs text-xs font-black text-slate-800">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>توصيل لحد باب البيت</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-14 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="bg-slate-100 text-slate-700 text-xs font-black px-3 py-1 rounded-full">
            في ٣ خطوات بسيطة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-2">
            إزاي بتشتري بسعر الجملة؟
          </h2>
          <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
            من غير ما تشتري كميات كبيرة.. رحلة طلبك بكل سهولة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="clean-card p-6 relative flex flex-col justify-between bg-white">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              ١
            </div>
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-3 mt-1">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                اختار قطعتك
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                نقي المنتج اللي محتاجه بسعر الجملة الحقيقي حتى لو قطعة واحدة وبدون اشتراط كميات.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              سعر الجملة من أول قطعة
            </div>
          </div>

          {/* Step 2 */}
          <div className="clean-card p-6 relative flex flex-col justify-between bg-white">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              ٢
            </div>
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-3 mt-1">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                سجّل حجزك فوراً
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                اكتب بياناتك لتثبيت مكانك في كرتونة منطقتك بضغطة واحدة وبدون أي مقدم.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              حجز مباشر بدون أي مقدم
            </div>
          </div>

          {/* Step 3 */}
          <div className="clean-card p-6 relative flex flex-col justify-between bg-white">
            <div className="absolute -top-3 right-6 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs">
              ٣
            </div>
            <div>
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-3 mt-1">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                عاين واستلم عند باب بيتك
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                المندوب يوصلك، افتح الشحنة وافحصها بنفسك وتأكد منها قبل ما تدفع أي مليم!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              معاينة وفحص مع المندوب
            </div>
          </div>
        </div>
      </section>

      {/* Active Products Section */}
      <section id="products" className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                كراتين مفتوحة حالياً
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              العروض المتاحة الآن 🔥
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
                لا توجد عروض مفتوحة للحجز حالياً
              </p>
              <p className="text-xs text-slate-500 font-medium">
                جاري إضافة كراتين جديدة قريباً جداً، تابعنا على الواتساب!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Referral / Viral Group Feature ("شلة سلاش") */}
      <section id="referrals" className="py-14 px-4 max-w-5xl mx-auto">
        <div className="clean-card bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl overflow-hidden relative shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-black mb-4">
                <Gift className="w-4 h-4 text-purple-400" />
                <span>ميزة حصرية: شلة سلاش 🔥</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-snug">
                عايز توفر أكتر؟
                <br />
                <span className="text-emerald-400">لم صحابك في نفس الكرتونة!</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                بعد ما تحجز، بتاخد كود دعوة خاص بيك. ابعته لصحابك على الواتساب.. كل صاحب يدخل ويحجز من خلالك هينزلك خصم فوري على أوردرك، والكرتونة تتقفل وتوصلكم أسرع!
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-200">
                <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  👥 كل صاحب = خصم مباشر
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  ⚡ الكرتونة بتكتمل وتوصل أسرع
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
        <div className="text-center mb-8">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
            تجارب حقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            ناس وفرت معانا في الدقهلية ⭐
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            آراء عملاء استلموا وعاينوا حاجتهم بنفسهم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      <section id="faqs" className="py-14 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>كل اللي محتاج تعرفه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
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
