"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronDown, ChevronUp, MessageCircle, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCT } from "@/lib/constants";
import { whatsappShareUrl } from "@/lib/utils";

const DISCOUNT_TIERS = [
  { friends: 0, price: 125, saved: 0, label: "من غير إحالة" },
  { friends: 1, price: 120, saved: 5, label: "صاحب واحد" },
  { friends: 2, price: 115, saved: 10, label: "صاحبين" },
  { friends: 3, price: 110, saved: 15, label: "3 صحاب" },
];

export default function ReferralWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentTier = 0; // Will come from API when customer is logged in

  const shareText = `أنا حجزت ${MOCK_PRODUCT.name} بسعر الجملة بـ ${MOCK_PRODUCT.standardPrice}ج! خش احجز معايا من اللينك ده عشان ناخدها كلنا بـ ${MOCK_PRODUCT.minDiscountPrice}ج وتكمل الكارتونة 🔥`;

  return (
    <section className="mt-4 mb-4">
      <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50">
        <CardContent className="p-0">
          {/* Header */}
          <div
            className="flex items-center justify-between cursor-pointer p-5 pb-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">شير ووفر مع صحابك 🔥</h3>
                <p className="text-xs text-amber-700/80 font-bold">كل صاحب = خصم 5 جنيه!</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3">
                  {/* Discount Tiers */}
                  {DISCOUNT_TIERS.map((tier, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center justify-between p-3.5 rounded-xl text-sm transition-all ${
                        i === currentTier
                          ? "bg-white border-2 border-emerald-400 shadow-md shadow-emerald-100"
                          : i < currentTier
                          ? "bg-emerald-50/50 border border-emerald-200/50"
                          : "bg-white/60 border border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {i <= currentTier ? (
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-black text-gray-400">
                            {tier.friends}
                          </div>
                        )}
                        <span className="font-bold text-gray-700">
                          {tier.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-600">
                          {tier.price} ج.م
                        </span>
                        {tier.saved > 0 && (
                          <Badge
                            variant={tier.friends === 3 ? "wholesale" : "default"}
                            className="text-[10px]"
                          >
                            وفرت {tier.saved}ج{tier.friends === 3 ? " 🎯" : ""}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* WhatsApp Share Button */}
                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full gap-2 mt-2"
                    asChild
                  >
                    <a
                      href={whatsappShareUrl(shareText)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-5 h-5" />
                      ابعت لأصحابك على واتساب
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </section>
  );
}
