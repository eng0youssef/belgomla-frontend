"use client";

import { CartonStatus } from "@/types/api";

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

  let statusText = "جاري تجميع الكرتونة";
  let statusColor = "text-blue-600";
  let progressColor = "bg-blue-600";

  if (status === CartonStatus.Filled) {
    statusText = "اكتملت الكرتونة";
    statusColor = "text-green-600";
    progressColor = "bg-green-600";
  } else if (status === CartonStatus.Purchased) {
    statusText = "تم الشراء من المورد";
    statusColor = "text-purple-600";
    progressColor = "bg-purple-600";
  } else if (status === CartonStatus.Delivered) {
    statusText = "تم التوصيل";
    statusColor = "text-green-600";
    progressColor = "bg-green-600";
  } else if (status === CartonStatus.Cancelled) {
    statusText = "تم الإلغاء";
    statusColor = "text-red-600";
    progressColor = "bg-red-600";
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">
          حالة الكرتونة: <span className={statusColor}>{statusText}</span>
        </span>
        <span className="text-sm font-bold text-slate-900">
          {confirmedCount} / {capacity}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        {status === CartonStatus.Open
          ? `يتبقى ${capacity - confirmedCount} أشخاص لاكتمال الكرتونة وشحنها`
          : "هذه الكرتونة لم تعد تستقبل طلبات جديدة"}
      </p>
    </div>
  );
}
