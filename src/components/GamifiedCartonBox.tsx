"use client";

import { Package, CheckCircle2, Clock, Sparkles, Flame, ShieldCheck } from "lucide-react";

interface GamifiedCartonBoxProps {
  cartonNumber?: number;
  capacity?: number;
  confirmedCount?: number;
  onSlotClick?: (slotIndex: number) => void;
}

export default function GamifiedCartonBox({
  cartonNumber = 1,
  capacity = 10,
  confirmedCount = 0,
  onSlotClick,
}: GamifiedCartonBoxProps) {
  const remainingCount = Math.max(0, capacity - confirmedCount);
  const progressPercent = capacity > 0 ? Math.min(100, Math.round((confirmedCount / capacity) * 100)) : 0;

  return (
    <div className="carton-crate space-y-5 border-amber-300/80 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/20">
      {/* Top Carton Header & Tape */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="carton-tape">
              <Package className="w-3.5 h-3.5 text-amber-700" />
              <span>كرتونة شحن جماعي رسمية #{cartonNumber}</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              سعة {capacity} قطع
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>صندوق الشحن المفتوح الآن 📦</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            كل مقعد بيمثل قطعة لمشتري.. أول ما تكتمل الكرتونة بتتقفل وتتشحن فوراً لباب بيتك
          </p>
        </div>

        {/* Live Slot Counter Badge */}
        <div className="text-right sm:text-left flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{confirmedCount} من {capacity} مقاعد محجوزة</span>
          </div>
        </div>
      </div>

      {/* Visual Slots Grid (Gamified & Tactile) */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
          <span>مقاعد الكرتونة التشاركية:</span>
          {remainingCount > 0 ? (
            <span className="text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-lg text-[11px] font-black animate-pulse">
              ⚡ متبقي {remainingCount} مقاعد فقط
            </span>
          ) : (
            <span className="text-emerald-700 font-black">اكتملت الكرتونة بالكامل 🎉</span>
          )}
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: capacity }).map((_, index) => {
            const isFilled = index < confirmedCount;
            const isNextSlot = index === confirmedCount;

            return (
              <div
                key={index}
                onClick={() => onSlotClick?.(index)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 border text-center transition-all duration-300 select-none ${
                  isFilled
                    ? "bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : isNextSlot
                    ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-400/80 ring-offset-2 animate-bounce cursor-pointer shadow-md"
                    : "bg-white/80 border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
                title={
                  isFilled
                    ? `مقعد محجوز #${index + 1}`
                    : isNextSlot
                    ? "مكانك المتاح للحجز الآن!"
                    : `مقعد متاح #${index + 1}`
                }
              >
                {isFilled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
                    <span className="text-[10px] font-black text-emerald-100 mt-0.5">#{index + 1}</span>
                  </>
                ) : isNextSlot ? (
                  <>
                    <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span className="text-[9px] font-black leading-none text-amber-900 mt-0.5">
                      مكانك!
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-300">#{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carton Progress Bar */}
      <div className="space-y-2 bg-white/90 p-3.5 rounded-2xl border border-amber-200/60 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-600">نسبة اكتمال الصندوق:</span>
          <span className="font-black text-emerald-700">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        <p className="text-xs font-bold text-center pt-1 text-slate-700">
          {remainingCount > 0 ? (
            <>
              🚀 يتبقى <span className="text-emerald-700 font-black">{remainingCount} مقاعد</span> وتتقفل الكرتونة وتطير لباب بيتك فوراً!
            </>
          ) : (
            <span className="text-emerald-700 font-black">
              🎉 الكرتونة اكتملت رسمي وجاري تجهيز الشحن السريع للمشترين!
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
