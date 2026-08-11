"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Lock, Phone, User, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerRegister } from "@/hooks/use-customer";
import { VILLAGES } from "@/lib/constants"; // Reuse the village list

export default function CustomerRegisterPage() {
  const router = useRouter();
  const registerMutation = useCustomerRegister();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    villageName: "",
    password: "",
    referralCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({
        ...formData,
        referralCode: formData.referralCode || null,
      });
      router.push("/dashboard");
    } catch (error) {
      // Error handled by mutation state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200/50">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">بالجملة</h1>
          <p className="text-sm text-gray-500 font-bold">إنشاء حساب جديد</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">أهلاً بك في بالجملة 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  الاسم بالكامل
                </label>
                <Input
                  icon={<User className="w-4 h-4" />}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="محمد أحمد"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  رقم الهاتف (الواتساب)
                </label>
                <Input
                  icon={<Phone className="w-4 h-4" />}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="01012345678"
                  type="tel"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  المنطقة / القرية
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={formData.villageName}
                    onChange={(e) =>
                      setFormData({ ...formData, villageName: e.target.value })
                    }
                    className="w-full h-11 pl-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                    required
                  >
                    <option value="">اختار منطقتك...</option>
                    {VILLAGES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  كلمة المرور
                </label>
                <Input
                  icon={<Lock className="w-4 h-4" />}
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  كود دعوة صديق (لو معاك)
                </label>
                <Input
                  value={formData.referralCode}
                  onChange={(e) =>
                    setFormData({ ...formData, referralCode: e.target.value })
                  }
                  placeholder="مثال: ABC123XYZ"
                  dir="ltr"
                />
                <p className="text-[11px] text-gray-500 mt-1 font-bold">
                  *هذا الكود خاص بالصديق الذي دعاك. السيستم سيقوم بإنشاء كودك الخاص تلقائياً بعد التسجيل.
                </p>
              </div>

              {registerMutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {registerMutation.error?.message || "حدث خطأ! تأكد من البيانات."}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg font-black"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري التسجيل...
                  </span>
                ) : (
                  "حساب جديد 🚀"
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 font-bold">
                  عندك حساب بالفعل؟{" "}
                  <Link href="/login" className="text-emerald-600 hover:underline">
                    سجل دخول
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
