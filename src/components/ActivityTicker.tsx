"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

// Generic activity notifications (non-deceptive, no fabricated personal identities)
const ACTIVITIES = [
  { message: "انضم عميل جديد للكارتونة 📦", time: "منذ لحظات" },
  { message: "تم تأكيد عربون وحجز قطعة جديدة ✅", time: "منذ دقيقتين" },
  { message: "كارتونة جديدة بدأت ومتاحة للحجز 🎉", time: "منذ 5 دقائق" },
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

      // Clear any pending hide timer before scheduling a new one
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

    // Show first after 3 seconds
    const initialTimeout = setTimeout(showActivity, 3000);
    // Then cycle every 8 seconds
    const interval = setInterval(showActivity, 8000);

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
      className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-4 z-40 pointer-events-none max-w-xs sm:mr-0 mr-auto ml-auto"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-2xl p-3.5 flex items-center gap-3 pointer-events-auto"
          >
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <Bell className="w-4 h-4 text-emerald-600" aria-hidden="true" />
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

