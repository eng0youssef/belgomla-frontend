"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Lock, Phone, Loader2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerLogin } from "@/hooks/use-customer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col justify-between" dir="rtl">
      <div>
        <Header />

        <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
          <div className="clean-card p-6 sm:p-8 bg-white shadow-lg space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                تسجيل الدخول لحسابك
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                ادخل رقم موبايلك وكلمة المرور لمتابعة طلباتك
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 mb-1.5 block">
                  رقم الهاتف (الواتساب)
                </label>
                <Input
                  icon={<Phone className="w-4 h-4 text-slate-400" />}
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({ ...credentials, phoneNumber: e.target.value })
                  }
                  placeholder="01012345678"
                  type="tel"
                  dir="ltr"
                  className="h-12 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700 block">
                    كلمة المرور
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <Input
                  icon={<Lock className="w-4 h-4 text-slate-400" />}
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="h-12 bg-slate-50/50"
                  required
                />
              </div>

              {loginMutation.isError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginMutation.error?.message || "بيانات الدخول غير صحيحة، يرجى التأكد والمحاولة ثانية"}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-black h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  "دخول للحساب 🚀"
                )}
              </Button>

              <div className="text-center pt-2 border-t border-slate-100 mt-4">
                <p className="text-xs text-slate-500 font-bold">
                  معندكش حساب لحد دلوقتي؟{" "}
                  <Link href="/register" className="text-emerald-700 hover:underline font-black">
                    سجّل حساب جديد في دقيقة
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

