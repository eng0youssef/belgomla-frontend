"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Lock, Phone, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerLogin } from "@/hooks/use-customer";

export default function CustomerLoginPage() {
  const router = useRouter();
  const loginMutation = useCustomerLogin();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(credentials);
      router.push("/dashboard");
    } catch (error) {
      // Error handled by mutation state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
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
          <p className="text-sm text-gray-500 font-bold">تسجيل الدخول</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">أهلاً بك مرة أخرى 👋</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  رقم الهاتف (الواتساب)
                </label>
                <Input
                  icon={<Phone className="w-4 h-4" />}
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({ ...credentials, phoneNumber: e.target.value })
                  }
                  placeholder="01012345678"
                  type="tel"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-black text-gray-700 block">
                    كلمة المرور
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <Input
                  icon={<Lock className="w-4 h-4" />}
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginMutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginMutation.error?.message || "بيانات الدخول غلط، أو الحساب مش موجود"}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg font-black"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الدخول...
                  </span>
                ) : (
                  "دخول 🚀"
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 font-bold">
                  معندكش حساب؟{" "}
                  <Link href="/register" className="text-emerald-600 hover:underline">
                    سجل من هنا
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
