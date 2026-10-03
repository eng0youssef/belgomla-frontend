"use client";

import { useState } from "react";
import { Users, Sparkles, Check, Share2, ArrowLeft, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappShareUrl } from "@/lib/utils";

interface SquadSavingsCalculatorProps {
  basePrice: number;
  minPrice: number;
  referralCode?: string;
}

export default function SquadSavingsCalculator({
  basePrice = 110,
  minPrice = 95,
  referralCode,
}: SquadSavingsCalculatorProps) {
  const [squadCount, setSquadCount] = useState<number>(0);

  const discountStep = squadCount === 0 ? 0 : Math.round(((basePrice - minPrice) / 3) * squadCount);
  const currentPrice = basePrice - discountStep;
  const totalSaved = discountStep;

  const shareText = referralCode
    ? `يا شلة! أنا لسه حاجز بسعر كرتونة الجملة من موقع سلاش! 🎉 كل ما ننضم في نفس الكرتونة السعر بينزل أكتر.. خش احجز قطعتك معايا: https://slash-egypt.vercel.app/?ref=${referralCode}`
    : `يا شلة! موقع سلاش بيبيع بالقطعة بسعر كرتونة الجملة! كل ما نشتري سوا السعر بينزل أكتر.. ادخلوا شوفوا العروض: https://slash-egypt.vercel.app/`;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-5 sm:p-7 rounded-3xl border border-emerald-500/30 shadow-xl space-y-5 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full mb-2">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            حاسبة توفير شلة الصحاب
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            جرب بنفسك: السعر هينزل كام مع أصحابك؟ 🤝⚡
          </h3>
        </div>

        {/* Dynamic Live Price Tag */}
        <div className="bg-emerald-500/20 border border-emerald-400/40 p-3 rounded-2xl text-center min-w-[140px]">
          <span className="text-[11px] font-bold text-emerald-200 block">سعر قطعتك الآن:</span>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-black text-emerald-400 leading-none">
              {currentPrice}
            </span>
            <span className="text-xs font-bold text-emerald-300">ج.م</span>
          </div>
          {totalSaved > 0 && (
            <span className="text-[10px] font-black text-amber-300 block mt-0.5">
              وفرت {totalSaved} ج إضافي! 🔥
            </span>
          )}
        </div>
      </div>

      {/* Interactive Step Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        {[
          { count: 0, label: "حجز فردي", sub: "سعر الجملة الصافي" },
          { count: 1, label: "+ صاحب واحد", sub: "خصم إضافي 💸" },
          { count: 2, label: "+ صاحبين", sub: "توفير مضاعف ⚡" },
          { count: 3, label: "+ ٣ صحاب (شلة)", sub: "أعلى توفير ممكن! 🔥" },
        ].map((item) => {
          const isSelected = squadCount === item.count;
          return (
            <button
              key={item.count}
              type="button"
              onClick={() => setSquadCount(item.count)}
              className={`p-3 rounded-2xl border text-right transition-all duration-200 active:scale-95 ${
                isSelected
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 font-bold"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-black text-sm">{item.label}</span>
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <span
                className={`text-[11px] block ${
                  isSelected ? "text-slate-900 font-bold" : "text-slate-400"
                }`}
              >
                {item.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Bar Showing Level */}
      <div className="space-y-1.5 relative z-10">
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, (squadCount / 3) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-300 font-medium text-center">
          {squadCount === 0 && "👈 اضغط على الخيارات فوق عشان تشوف السعر بيكسر إزاي!"}
          {squadCount === 1 && "💡 خصم أولي لطيف.. ومتبقي خطوتين لأعلى توفير!"}
          {squadCount === 2 && "🚀 ممتاز! فاضل صاحب واحد وتوصل لأقصى سعر جملة ممكن!"}
          {squadCount === 3 && "🎉 دي أعلى نسبة توفير ممكنة.. السعر بقى حرفياً ببلاش!"}
        </p>
      </div>

      {/* WhatsApp Share CTA */}
      <div className="pt-1 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
        <span className="text-xs text-slate-400 font-medium">
          عايز تنفذ التوفير ده في الحقيقة؟ شارك اللينك مع صحابك على الواتساب:
        </span>
        <a
          href={whatsappShareUrl(shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            size="sm"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs h-10 px-5 rounded-xl shadow-md gap-2 flex items-center justify-center transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>شارك اللينك على الواتساب 💬</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
