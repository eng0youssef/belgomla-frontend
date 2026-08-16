"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Users, BadgePercent, Flame } from "lucide-react";
import { useActiveCarton } from "@/hooks/use-carton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_PRODUCT } from "@/lib/constants";

// ─── 1. Hoist static data outside the component ──────────────────────────────
const TRUST_BADGES = [
  { icon: ShieldCheck, label: "دفع آمن", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Truck, label: "توصيل لباب البيت", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Users, label: "شراء جماعي", color: "text-amber-600", bg: "bg-amber-50" },
] as const;

// ─── 2. Memoized Carton Progress Bar ─────────────────────────────────────────
interface CartonProgressBarProps {
  progressPercent: number;
  confirmedCount: number;
  capacity: number;
  remaining: number;
  isLoading: boolean;
}

const CartonProgressBar = memo(function CartonProgressBar({
  progressPercent,
  confirmedCount,
  capacity,
  remaining,
  isLoading,
}: CartonProgressBarProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 rounded-2xl p-4 border border-emerald-200/50">
      <div className="flex justify-between text-sm mb-2.5">
        <span className="font-black text-gray-700 flex items-center gap-1.5">
          🔥 شريط الكارتونة
        </span>
        {isLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <span className="font-black text-emerald-600">
            {confirmedCount} من {capacity} حجزوا
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-emerald-100 rounded-full h-5 overflow-hidden relative shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </motion.div>
      </div>

      <p className="text-sm font-black text-center mt-2.5 text-emerald-700">
        {remaining > 0 ? (
          <>
            باقي <span className="text-amber-600">{remaining}</span> قطع وتطلع الكارتونة! 📦
          </>
        ) : (
          "الكارتونة اكتملت! 🎉"
        )}
      </p>
      <p className="text-[11px] text-emerald-600/70 mt-1 text-center font-bold">
        العدّاد بيزيد فور تأكيد استلام العربون رسمياً 🔒
      </p>
    </div>
  );
});

// ─── 3. Memoized Trust Badges ────────────────────────────────────────────────
const TrustBadges = memo(function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {TRUST_BADGES.map((badge, i) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className={`${badge.bg} rounded-xl p-3 text-center border border-border/50`}
        >
          <badge.icon className={`w-6 h-6 mx-auto mb-1 ${badge.color}`} />
          <p className="text-xs font-black text-gray-600">{badge.label}</p>
        </motion.div>
      ))}
    </div>
  );
});

// ─── 4. Main Component ───────────────────────────────────────────────────────
export default function ProductHero() {
  const { data: carton, isLoading } = useActiveCarton();

  const progressPercent = carton
    ? (carton.confirmedCount / carton.capacity) * 100
    : 0;
  const remaining = carton ? carton.capacity - carton.confirmedCount : 0;
  const confirmedCount = carton?.confirmedCount || 0;
  const capacity = carton?.capacity || 10;

  const openBooking = () => {
    window.dispatchEvent(new CustomEvent("openBooking"));
  };

  return (
    <section className="mt-4 space-y-4">
      {/* Product Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
        <div className="aspect-square relative">
          <Image
            src="/product.jpg"
            alt={carton?.productName || MOCK_PRODUCT.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 448px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge variant="wholesale" className="gap-1">
            سعر الجملة 🚀
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <Flame className="w-3 h-3" />
            الأكثر مبيعاً
          </Badge>
        </div>
      </div>

      {/* Product Info Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="p-5 space-y-5">
          {/* Product Name */}
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            {carton?.productName || MOCK_PRODUCT.name}
          </h2>

          {/* Price Display */}
          <div className="flex items-baseline gap-3 flex-wrap">
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <>
                <span className="text-3xl font-black text-emerald-600">
                  {MOCK_PRODUCT.standardPrice} ج.م
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {MOCK_PRODUCT.retailPrice} ج.م
                </span>
                <Badge variant="destructive">
                  وفر {MOCK_PRODUCT.retailPrice - MOCK_PRODUCT.standardPrice} جنيه
                </Badge>
              </>
            )}
          </div>

          {/* Viral discount teaser */}
          <div className="flex items-center gap-2 text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 rounded-xl text-sm font-black border border-amber-200/50">
            <BadgePercent className="w-5 h-5 flex-shrink-0" />
            <span>
              شير لـ 3 صحاب واحصل عليها بـ {MOCK_PRODUCT.minDiscountPrice} ج.م بس!
            </span>
          </div>

          {/* Live Carton Progress (Memoized) */}
          <CartonProgressBar
            progressPercent={progressPercent}
            confirmedCount={confirmedCount}
            capacity={capacity}
            remaining={remaining}
            isLoading={isLoading}
          />

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full text-lg font-black py-7"
            onClick={openBooking}
          >
            احجز قطعتك دلوقتي! 🎯
          </Button>
        </CardContent>
      </Card>

      {/* Trust Badges (Memoized) */}
      <TrustBadges />
    </section>
  );
}

