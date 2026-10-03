import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, MessageCircle, CheckCircle, Users } from "lucide-react";
import { SUPPORT_PHONE } from "@/lib/constants";
import { whatsappChatUrl } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          {/* Brand & About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-slate-900 font-bold shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">SLASH | سلاش 🇪🇬</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              أول منصة شراء جماعي ذكية في مصر.. اشتري بالقطعة بسعر كرتونة الجملة، مع التوصيل لحد باب بيتك والمعاينة الكاملة قبل ما تدفع مليم.
            </p>
            <div className="pt-2">
              <a
                href={whatsappChatUrl(SUPPORT_PHONE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-xl hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>واتساب خدمة العملاء</span>
              </a>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">ليه تشتري مع سلاش؟</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>سعر كرتونة الجملة للقطعة الواحدة</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>عاين وافرز مع الكابتن قبل دفع الحساب</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>توصيل سريع ومباشر لحد باب شقتك</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>خصومات شلة الصحاب مع كل صاحب يشارك</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">طرق الدفع والأمان</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              الدفع بالكامل كاش عند الاستلام بعد ما تفتح شحنتك وتتأكد منها 100% مع الكابتن.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs px-3 py-1.5 rounded-xl font-black">
                💵 كاش عند الاستلام فقط
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-bold">
                🔍 معاينة وفحص كامل
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p className="font-bold" suppressHydrationWarning>
            جميع الحقوق محفوظة منصة SLASH | سلاش مصر © {currentYear}
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
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
