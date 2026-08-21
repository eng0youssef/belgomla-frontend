"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, User, ShieldCheck } from "lucide-react";
import { whatsappChatUrl } from "@/lib/utils";
import { getCustomerToken } from "@/services/api-client";
import { SUPPORT_PHONE } from "@/lib/constants";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:py-3.5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 group-hover:bg-emerald-700 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  SLASH
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                  سلاش
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-none">
                مع سلاش.. السعر ببلاش
              </p>
            </div>
          </Link>

          {/* Center Navigation for Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              المنتجات المتاحة
            </Link>
            <a href="/#referrals" className="hover:text-emerald-700 transition-colors">
              برنامج مشاركة التوفير
            </a>
            <a href="/#faqs" className="hover:text-emerald-700 transition-colors">
              الأسئلة الشائعة
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href={whatsappChatUrl(SUPPORT_PHONE, "السلام عليكم، كنت محتاج استفسر عن الطلبات في موقع سلاش")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-3.5 py-2 rounded-xl text-xs font-black transition-all border border-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="hidden sm:inline">خدمة العملاء</span>
              <span className="sm:hidden">واتساب</span>
            </a>

            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all border ${
                isLoggedIn
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isLoggedIn ? "حسابي والطلبات" : "تسجيل الدخول"}</span>
            </Link>
          </div>
        </div>
    </header>
  );
}
