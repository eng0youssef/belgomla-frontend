import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, MessageCircle, CheckCircle } from "lucide-react";
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
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 font-bold">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">SLASH | سلاش</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              منصة التسوّق الذكية في مصر.. نوفر لك أفضل المنتجات بأسعار الجملة للقطعة الواحدة، مع التوصيل لباب بيتك والمعاينة الكاملة والدفع عند الاستلام.
            </p>
            <div className="pt-2">
              <a
                href={whatsappChatUrl(SUPPORT_PHONE, "مرحباً، أود الاستفسار عن منصة سلاش")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-xl hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                واتساب خدمة العملاء
              </a>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">لماذا منصة سلاش؟</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>سعر الجملة للقطعة الواحدة</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>معاينة وفحص كامل مع المندوب قبل السداد</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>شحن وتوصيل مباشر لباب المنزل</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>خصومات إضافية عند دعوة الأصدقاء</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">طرق الدفع والأمان</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              الدفع بالكامل عند الاستلام بعد المعاينة والفحص مع مندوب التوصيل.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md font-bold">
                📱 فودافون كاش
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md font-bold">
                ⚡ إنستاباي InstaPay
              </span>
              <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md font-bold">
                💵 كاش عند الاستلام
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p font-bold="true" suppressHydrationWarning>
            جميع الحقوق محفوظة منصة SLASH | سلاش © {currentYear}
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
