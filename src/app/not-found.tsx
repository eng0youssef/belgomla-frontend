"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 text-center"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-8xl font-black text-gray-800 mb-4"
        >
          404
        </motion.h1>

        <h2 className="text-2xl font-black text-gray-700 mb-3">
          الصفحة دي مش موجودة 😅
        </h2>
        <p className="text-gray-500 font-bold mb-8 max-w-sm mx-auto">
          يبدو إن اللينك اللي دخلته غلط أو الصفحة اتحذفت. ارجع للصفحة الرئيسية وابدأ من أول.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="gap-2 font-black"
          >
            <Home className="w-5 h-5" />
            الصفحة الرئيسية
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 font-black"
          >
            <ArrowRight className="w-5 h-5" />
            ارجع للخلف
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
