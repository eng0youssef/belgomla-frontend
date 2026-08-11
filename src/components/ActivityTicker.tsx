"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const ACTIVITIES = [
  { message: "محمد من المنصورة حجز قطعته! 🎧", time: "منذ دقيقتين" },
  { message: "أحمد من طنطا انضم للكارتونة 📦", time: "منذ 5 دقائق" },
  { message: "سارة من الزقازيق وفرت 15 جنيه! 💰", time: "منذ 8 دقائق" },
  { message: "يوسف من بنها شير لـ 3 صحاب 🔥", time: "منذ 12 دقيقة" },
  { message: "فاطمة من دمياط حجزت دلوقتي! ⚡", time: "منذ 15 دقيقة" },
  { message: "عمر من كفر الشيخ أكد العربون ✅", time: "منذ 20 دقيقة" },
];

export default function ActivityTicker() {
  const [currentActivity, setCurrentActivity] = useState<typeof ACTIVITIES[0] | null>(null);

  useEffect(() => {
    let index = 0;

    const showActivity = () => {
      setCurrentActivity(ACTIVITIES[index]);
      setTimeout(() => setCurrentActivity(null), 4000);
      index = (index + 1) % ACTIVITIES.length;
    };

    // Show first after 3 seconds
    const initialTimeout = setTimeout(showActivity, 3000);
    // Then every 8 seconds
    const interval = setInterval(showActivity, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-4 z-40 pointer-events-none max-w-xs sm:mr-0 mr-auto ml-auto">
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-2xl p-3.5 flex items-center gap-3 pointer-events-auto"
          >
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <Bell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-800 leading-snug truncate">
                {currentActivity.message}
              </p>
              <p className="text-[11px] text-emerald-600/70 font-bold mt-0.5">
                {currentActivity.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
