"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  User,
  UserPlus,
  Menu,
  X,
  Sparkles,
  Package,
  Users,
  HelpCircle,
  ArrowLeft,
  Flame,
} from "lucide-react";
import { whatsappChatUrl } from "@/lib/utils";
import { getCustomerToken } from "@/services/api-client";
import { SUPPORT_PHONE } from "@/lib/constants";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-4 max-w-6xl mx-auto transition-all">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-black/[0.03] rounded-2xl sm:rounded-3xl px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  SLASH
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                  سلاش 🇪🇬
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-none hidden xs:block">
                مع سلاش.. السعر ببلاش
              </p>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links for Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-bold text-slate-600 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/50">
          <a
            href="/#products"
            className="px-3.5 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>كراتين اليوم</span>
          </a>
          <a
            href="/#how-it-works"
            className="px-3.5 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-white transition-all flex items-center gap-1.5"
          >
            <span>إزاي سلاش شغال؟</span>
          </a>
          <a
            href="/#referrals"
            className="px-3.5 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>حاسبة الشلة 🤝</span>
          </a>
          <a
            href="/#faqs"
            className="px-3.5 py-1.5 rounded-xl hover:text-emerald-700 hover:bg-white transition-all"
          >
            الأسئلة الشائعة
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* WhatsApp Support Button */}
          <a
            href={whatsappChatUrl(SUPPORT_PHONE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-xl text-xs font-black transition-all border border-[#25D366]/30"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>واتساب الدعم</span>
          </a>

          {/* User Account Capsule */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>حسابي</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <span>دخول</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-3.5 py-1.5 sm:py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>حساب جديد</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <a
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                المنتجات والكراتين المفتوحة
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                إزاي سلاش شغال؟ (فكرة الكرتونة)
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="/#referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                حاسبة شلة الصحاب والتوفير
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="/#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                الأسئلة الشائعة والمعاينة
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={whatsappChatUrl(SUPPORT_PHONE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 text-emerald-800 font-bold text-xs transition-colors border border-emerald-100"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                محادثة واتساب خدمة العملاء
              </span>
              <span className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-md font-black">
                متاح الآن
              </span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-xs"
            >
              {isLoggedIn ? "لوحة التحكم وحسابي" : "إنشاء حساب مجاناً"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
