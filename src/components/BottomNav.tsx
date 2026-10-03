"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, User, MessageCircle } from "lucide-react";
import { getCustomerToken } from "@/services/api-client";
import { SUPPORT_PHONE } from "@/lib/constants";
import { whatsappChatUrl } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  // Hide bottom nav on admin routes and product detail pages (where sticky booking bar is active)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/product/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 items-center text-center max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            pathname === "/" ? "text-emerald-600 font-black" : "text-slate-500 hover:text-slate-800 font-bold"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-0.5">الرئيسية</span>
        </Link>

        {/* Products / Cartons */}
        <a
          href="/#products"
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-emerald-700 font-bold transition-all"
        >
          <Package className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">الكراتين</span>
        </a>

        {/* Center Viral Highlight: Squad Calculator */}
        <a
          href="/#referrals"
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white active:scale-95 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-emerald-700 mt-1">الشلة</span>
        </a>

        {/* WhatsApp Support */}
        <a
          href={whatsappChatUrl(SUPPORT_PHONE)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-emerald-700 font-bold transition-all"
        >
          <MessageCircle className="w-5 h-5 stroke-[1.8] text-[#25D366]" />
          <span className="text-[10px] mt-0.5">الدعم</span>
        </a>

        {/* Account / Dashboard */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            pathname?.startsWith("/dashboard") || pathname === "/login"
              ? "text-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800 font-bold"
          }`}
        >
          <User
            className={`w-5 h-5 ${
              pathname?.startsWith("/dashboard") || pathname === "/login" ? "stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
          <span className="text-[10px] mt-0.5">{isLoggedIn ? "حسابي" : "دخول"}</span>
        </Link>
      </div>
    </nav>
  );
}
