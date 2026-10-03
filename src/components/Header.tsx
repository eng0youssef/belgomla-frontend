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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2.5 sm:py-3.5">
        {/* Brand Logo & Vibe */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  SLASH
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                  سلاش 🇪🇬
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-none">
                مع سلاش.. السعر ببلاش
              </p>
            </div>
          </Link>
        </div>

        {/* Center Navigation for Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
          <a
            href="/#products"
            className="hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <span>المنتجات المتاحة</span>
          </a>
          <a
            href="/#referrals"
            className="hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>شلة الصحاب والتوفير</span>
          </a>
          <a
            href="/#faqs"
            className="hover:text-emerald-700 transition-colors"
          >
            الأسئلة الشائعة
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href={whatsappChatUrl(SUPPORT_PHONE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-3 py-2 rounded-xl text-xs font-black transition-all border border-[#25D366]/20"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>خدمة العملاء</span>
          </a>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-black transition-all border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              <User className="w-3.5 h-3.5" />
              <span>حسابي</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              >
                <User className="w-3.5 h-3.5" />
                <span>دخول</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>حساب جديد</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
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
              href="/#referrals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                برنامج شلة الصحاب والتوفير
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
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 text-emerald-800 font-bold text-xs transition-colors border border-emerald-100"
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

          {!isLoggedIn && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border bg-slate-900 text-white"
              >
                <User className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border bg-emerald-600 text-white shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>حساب جديد</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
