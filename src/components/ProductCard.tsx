"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Users, ShoppingCart, ArrowLeft, Sparkles, Check, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/types/api";
import { isTrustedImageUrl } from "@/lib/image-utils";
import { useActiveCarton } from "@/hooks/use-carton";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: carton } = useActiveCarton(product.id);

  const savingsAmount = product.standardPrice - product.wholesalePrice;
  const savingsPercent = Math.round((savingsAmount / product.standardPrice) * 100);

  const capacity = carton?.capacity || product.cartonCapacity || 10;
  const confirmedCount = carton?.confirmedCount || 0;
  const remaining = Math.max(0, capacity - confirmedCount);
  const progressPercent = Math.min(100, Math.round((confirmedCount / capacity) * 100));

  return (
    <div className="clean-card clean-card-hover flex flex-col justify-between overflow-hidden group bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
          {/* Savings Badge */}
          {savingsAmount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                <span>وفرت {savingsAmount} ج.م في جيبك ({savingsPercent}%)</span>
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 z-10">
            <span className="bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-3 py-1 rounded-xl shadow-sm">
              سعر كرتونة الجملة 📦
            </span>
          </div>

          {isTrustedImageUrl(product.imageUrl) ? (
            <Image
              src={product.imageUrl!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <Package className="w-16 h-16 stroke-[1.5]" />
              <span className="text-xs text-slate-400 font-medium mt-1">صورة المنتج</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Title */}
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Pricing Box (High Energy Contrast) */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-4 border border-slate-200/90 space-y-2.5">
            {/* Standard Price */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">سعر المحلات والمولات:</span>
              <span className="text-rose-500 line-through font-bold text-sm">
                {product.standardPrice} ج.م ❌
              </span>
            </div>

            {/* Wholesale Price */}
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5">
              <div>
                <span className="text-xs font-black text-emerald-900 block">
                  سعر سلاش الصافي للقطعة
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  شراء فوري بالقطعة بسعر الجملة
                </span>
              </div>
              <div className="text-left">
                <span className="text-3xl font-black text-emerald-700 leading-none">
                  {product.wholesalePrice}
                </span>
                <span className="text-xs font-bold text-emerald-800 mr-1">ج.م ✅</span>
              </div>
            </div>

            {/* Friends Discount Teaser */}
            {product.minDiscountPrice < product.wholesalePrice && (
              <div className="flex items-center justify-between bg-purple-100/70 border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-purple-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>مع شلة الصحاب يوصل لـ:</span>
                </span>
                <span className="font-black text-purple-800 text-sm">
                  {product.minDiscountPrice} ج.م 🔥
                </span>
              </div>
            )}
          </div>

          {/* Mini Crate Slots Preview */}
          <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-200/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-slate-800 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-700" />
                كرتونة الشحن #{carton?.cartonNumber || 1}
              </span>
              <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
                {confirmedCount} من {capacity} مقاعد
              </span>
            </div>

            {/* 10 Mini Slot Dots */}
            <div className="grid grid-cols-10 gap-1 pt-0.5">
              {Array.from({ length: capacity }).map((_, i) => {
                const isFilled = i < confirmedCount;
                const isNext = i === confirmedCount;
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-md transition-all ${
                      isFilled
                        ? "bg-emerald-600 shadow-sm"
                        : isNext
                        ? "bg-amber-400 ring-2 ring-amber-300 ring-offset-1 animate-pulse"
                        : "bg-slate-200/90"
                    }`}
                    title={isFilled ? `محجوز #${i + 1}` : isNext ? "مكانك هنا!" : `متاح #${i + 1}`}
                  />
                );
              })}
            </div>

            <p className="text-[11px] font-bold text-center text-slate-700 pt-0.5">
              {remaining > 0 ? (
                <>
                  🚀 باقي <span className="text-emerald-700 font-black">{remaining} مقاعد</span> وتتقفل وتطير لباب بيتك!
                </>
              ) : (
                "🎉 اكتملت الكرتونة بالكامل وجاري التجهيز للشحن"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 sm:p-5 pt-0">
        <Link href={`/product/${product.id}`} className="block w-full">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm h-12 rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn transition-all active:scale-[0.98]"
          >
            <span>احجز مقعدك في الكرتونة الآن ⚡</span>
            <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
