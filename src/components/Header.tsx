"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappChatUrl } from "@/lib/utils";
import { getCustomerToken } from "@/services/api-client";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getCustomerToken());
  }, []);

  return (
    <>
      {/* Urgency Banner */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white text-center py-2.5 px-4 text-sm font-black shadow-md"
      >
        <span className="urgency-pulse flex items-center justify-center gap-2">
          <span className="text-lg">🔥</span> 
          الحق مكانك! كراتين النهاردة بتخلص والتوفير بجد مش هزار!
          <span className="text-lg">🔥</span>
        </span>
      </motion.div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-800 leading-none mb-0.5 tracking-tight">
                بالجملة
              </h1>
              <p className="text-[11px] text-emerald-600/80 font-black tracking-wider">
                وفر فلوسك
              </p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappChatUrl("201000000000")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-full text-xs font-black hover:bg-emerald-100 transition-all hover:scale-105 border border-emerald-200/50"
            >
              <MessageCircle className="w-4 h-4" />
              تواصل معانا
            </a>

            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-all"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
