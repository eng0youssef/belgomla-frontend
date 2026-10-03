import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, MessageCircle, CheckCircle, Users, ArrowUpRight } from "lucide-react";
import { SUPPORT_PHONE } from "@/lib/constants";
import { whatsappChatUrl } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & About (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">SLASH | سلاش 🇪🇬</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              أول منصة شراء جماعي ذكية في مصر.. بنفتح كراتين شحن الجملة افتراضياً عشان تشتري بالقطعة بسعر الجملة الصافي، مع التوصيل لباب بيتك والمعاينة الكاملة قبل دفع مليم.
            </p>
            <div className="pt-2">
              <a
                href={whatsappChatUrl(SUPPORT_PHONE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-4 py-2.5 rounded-xl hover:bg-emerald-900/60 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>محادثة واتساب خدمة العملاء</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Value Propositions (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-black text-white">ليه تشتري مع سلاش؟</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>سعر كرتونة الجملة للقطعة الواحدة</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>عاين وافرز مع الكابتن قبل دفع الحساب</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>توصيل سريع ومباشر لحد باب بيتك</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>خصومات شلة الصحاب مع كل صاحب يشارك</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white">ضمان الدفع والمعاينة</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              الدفع بالكامل كاش عند الاستلام بعد ما تفتح شحنتك وتتأكد منها 100% مع الكابتن.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <span className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs px-3 py-2 rounded-xl font-black flex items-center gap-2">
                <span>💵</span> كاش عند الاستلام 100%
              </span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-2">
                <span>🔍</span> افتح وافحص قبل الدفع
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p className="font-bold" suppressHydrationWarning>
            جميع الحقوق محفوظة منصة SLASH | سلاش مصر © {currentYear}
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-bold">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">
              تسجيل الدخول
            </Link>
            <span>•</span>
            <Link href="/register" className="hover:text-white transition-colors">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
