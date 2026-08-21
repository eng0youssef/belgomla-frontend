"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// Real-feeling social proof ticker (authentic Egyptian phrasing)
const ACTIVITIES = [
  { message: "حجز جديد اتسجل في كرتونة المنصورة 📦", time: "منذ لحظات" },
  { message: "حجز جديد اكتمل في كرتونة بلقاس ✅", time: "منذ دقيقتين" },
  { message: "كرتونة جديدة فتحت للحجز بسعر الجملة 🎉", time: "منذ ٥ دقائق" },
  { message: "عميل في شربين وفّر ٤٥٠ جنيه مع شلة سلاش 🚀", time: "منذ ١٠ دقائق" },
];

export default function ActivityTicker() {
  const [currentActivity, setCurrentActivity] = useState<typeof ACTIVITIES[0] | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let index = 0;
    let isMounted = true;

    const showActivity = () => {
      if (!isMounted) return;
      setCurrentActivity(ACTIVITIES[index]);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = setTimeout(() => {
        if (isMounted) {
          setCurrentActivity(null);
        }
      }, 4000);

      index = (index + 1) % ACTIVITIES.length;
    };

    const initialTimeout = setTimeout(showActivity, 4000);
    const interval = setInterval(showActivity, 10000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-4 z-40 pointer-events-none max-w-xs"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      dir="rtl"
    >
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="clean-card bg-white/95 backdrop-blur-md p-3.5 flex items-center gap-3 shadow-lg border-emerald-100"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 leading-snug">
                {currentActivity.message}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                {currentActivity.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


