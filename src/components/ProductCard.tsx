"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Users, ShoppingCart, ArrowLeft, Sparkles, Check } from "lucide-react";
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
    <div className="clean-card clean-card-hover flex flex-col justify-between overflow-hidden group bg-white">
      <div>
        {/* Image Container */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
          {/* Top Badges */}
          {savingsAmount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                وفرت {savingsAmount} ج ({savingsPercent}%)
              </span>
            </div>
          )}

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
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              كرتونة سعة {capacity} قطع
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-2.5">
            {/* Standard Price */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">سعر التجزئة المعتاد:</span>
              <span className="text-slate-400 line-through font-bold text-sm">
                {product.standardPrice} ج.م
              </span>
            </div>

            {/* Wholesale Price */}
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  سعر الجملة للقطعة
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  شراء مباشر بالقطعة
                </span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-black text-emerald-700 leading-none">
                  {product.wholesalePrice}
                </span>
                <span className="text-xs font-bold text-emerald-800 mr-1">ج.م</span>
              </div>
            </div>

            {/* Friends Discount Teaser */}
            {product.minDiscountPrice < product.wholesalePrice && (
              <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-xs text-emerald-900 font-medium">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  خصم الشراء مع الأصدقاء:
                </span>
                <span className="font-bold text-emerald-700 text-sm">
                  {product.minDiscountPrice} ج.م
                </span>
              </div>
            )}
          </div>

          {/* Carton Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                كرتونة الشحن #{carton?.cartonNumber || 1}
              </span>
              <span className="font-bold text-emerald-700">
                {confirmedCount} من {capacity} محجوز
              </span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium text-center">
              {remaining > 0 ? (
                <>
                  المتبقي لاكتمال الكرتونة: <span className="text-emerald-700 font-bold">{remaining} قطع</span>
                </>
              ) : (
                "اكتملت الكرتونة وجاري التجهيز للشحن"
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
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm h-11 rounded-xl shadow-xs flex items-center justify-center gap-2 group/btn"
          >
            <span>طلب المنتج والتفاصيل</span>
            <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

