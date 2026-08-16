"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Users, Tag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/types/api";
import { isTrustedImageUrl } from "@/lib/image-utils";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Generate a consistent, attractive badge based on product ID
  const getBadge = (id: string) => {
    const badges = [
      { text: "الأكثر مبيعاً", color: "bg-rose-500" },
      { text: "وصل حديثاً", color: "bg-blue-500" },
      { text: "الأعلى توفيراً", color: "bg-amber-500" },
      { text: "الأكثر طلباً", color: "bg-purple-500" }
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    return badges[hash % badges.length];
  };

  const badge = getBadge(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-[32px] p-4 sm:p-6 shadow-xl shadow-emerald-900/5 relative overflow-hidden border border-emerald-50"
    >
      <div className={`absolute top-0 right-0 ${badge.color} text-white px-4 py-1.5 rounded-bl-2xl font-bold text-sm shadow-md`}>
        {badge.text}
      </div>

      <div className="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center mt-4 overflow-hidden relative">
        {isTrustedImageUrl(product.imageUrl) ? (
          <Image
            src={product.imageUrl!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 768px) 45vw, 30vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <Package className="w-24 h-24 text-gray-300" />
        )}
      </div>

      <h2 className="text-xl font-black text-gray-800 mb-2 leading-tight">
        {product.name}
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
          <span className="text-gray-500 font-bold flex items-center gap-1.5">
            <Tag className="w-4 h-4" /> السعر العادي
          </span>
          <span className="font-bold line-through text-gray-400">
            {product.standardPrice}ج
          </span>
        </div>

        <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
          <span className="text-emerald-700 font-black flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4" /> سعر الكارتونة
          </span>
          <div className="text-left">
            <span className="font-black text-2xl text-emerald-600 block">
              {product.wholesalePrice}ج
            </span>
            <span className="text-[10px] font-bold text-emerald-600/70">
              للقطعة الواحدة
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-purple-50/50 p-3 rounded-xl border border-purple-100">
          <span className="text-purple-700 font-bold flex items-center gap-1.5 text-sm">
            <Users className="w-4 h-4" /> بعد خصم الإحالة
          </span>
          <span className="font-black text-lg text-purple-600">
            {product.minDiscountPrice}ج
          </span>
        </div>
      </div>

      <Link href={`/product/${product.id}`} className="block w-full mt-2">
        <Button
          size="lg"
          className="w-full text-lg font-black bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl shadow-lg shadow-emerald-600/20"
        >
          احجز قطعتك في الكارتونة
        </Button>
      </Link>
    </motion.div>
  );
}
