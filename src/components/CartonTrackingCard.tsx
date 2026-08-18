"use client";

import { CartonStatus } from "@/types/api";
import { Package, Truck, CheckCircle2, Clock, ShoppingCart, AlertCircle } from "lucide-react";

interface CartonTrackingCardProps {
  capacity: number;
  confirmedCount: number;
  status: CartonStatus;
}

export function CartonTrackingCard({
  capacity,
  confirmedCount,
  status,
}: CartonTrackingCardProps) {
  const progressPercent = Math.min(
    Math.round((confirmedCount / capacity) * 100),
    100
  );

  let statusText = "جاري تجميع حجز الكرتونة";
  let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let statusIcon = <Clock className="w-3.5 h-3.5 text-emerald-600" />;
  let progressColor = "bg-emerald-500";

  if (status === CartonStatus.Filled) {
    statusText = "اكتملت الكرتونة وجاري التجهيز";
    statusColor = "text-blue-700 bg-blue-50 border-blue-200";
    statusIcon = <Package className="w-3.5 h-3.5 text-blue-600" />;
    progressColor = "bg-blue-600";
  } else if (status === CartonStatus.Purchased) {
    statusText = "تم الشراء من المورد وجاري الشحن";
    statusColor = "text-purple-700 bg-purple-50 border-purple-200";
    statusIcon = <ShoppingCart className="w-3.5 h-3.5 text-purple-600" />;
    progressColor = "bg-purple-600";
  } else if (status === CartonStatus.Delivered) {
    statusText = "تم التوصيل بنجاح";
    statusColor = "text-emerald-800 bg-emerald-100 border-emerald-300";
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
    progressColor = "bg-emerald-600";
  } else if (status === CartonStatus.Cancelled) {
    statusText = "تم إلغاء الكرتونة";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusIcon = <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
    progressColor = "bg-red-500";
  }

  const remaining = Math.max(0, capacity - confirmedCount);

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex justify-between items-center gap-2">
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${statusColor}`}>
          {statusIcon}
          <span>{statusText}</span>
        </span>
        <span className="text-xs font-black text-slate-800">
          {confirmedCount} / {capacity} قطعة
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-700 rounded-full`}
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-500 font-bold">
        {status === CartonStatus.Open
          ? (remaining > 0 ? `يتبقى ${remaining} حجز وتكتمل الكرتونة ونشحنها لباب بيتك` : "اكتملت الكرتونة!")
          : status === CartonStatus.Delivered
          ? "✅ تم تسليم جميع قطع هذه الكرتونة للمشترين"
          : "هذه الكرتونة قيد المعالجة والتسليم"}
      </p>
    </div>
  );
}

