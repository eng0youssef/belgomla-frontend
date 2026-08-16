"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Lock,
  Save,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Shield
} from "lucide-react";
import {
  useCustomerDashboard,
  useUpdateCustomerProfile,
} from "@/hooks/use-customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { removeCustomerToken } from "@/services/api-client";
import { VILLAGES } from "@/lib/constants";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: dashboard, isLoading } = useCustomerDashboard();
  const updateMutation = useUpdateCustomerProfile();

  const [fullName, setFullName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  useEffect(() => {
    if (dashboard) {
      setFullName(dashboard.fullName);
      setVillageName(dashboard.villageName);
      setPhoneNumber(dashboard.phoneNumber);
    }
  }, [dashboard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (password && password !== confirmPassword) {
      setFeedback({ type: "error", message: "كلمات المرور غير متطابقة" });
      return;
    }

    const payload: any = {
      fullName,
      villageName,
    };

    if (password) {
      payload.password = password;
    }

    const phoneChanged = phoneNumber !== dashboard?.phoneNumber;
    if (phoneChanged) {
      payload.phoneNumber = phoneNumber;
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setPassword("");
        setConfirmPassword("");

        if (phoneChanged) {
          setFeedback({ type: "info", message: "تم تغيير رقم الهاتف، يرجى تسجيل الدخول من جديد" });
          removeCustomerToken();
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        } else {
          setFeedback({ type: "success", message: "تم تحديث بياناتك بنجاح" });
        }
      },
      onError: (err) => {
        setFeedback({ type: "error", message: err.message || "حدث خطأ أثناء التحديث" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white pt-8 pb-16 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-emerald-700 min-w-[44px] min-h-[44px] p-2 rounded-full"
            onClick={() => router.push("/dashboard")}
            aria-label="الرجوع للوحة التحكم"
            title="الرجوع للوحة التحكم"
          >
            <ArrowRight className="w-6 h-6" aria-hidden="true" />
          </Button>
          <div>
            <h1 className="text-2xl font-black mb-1">إعدادات الحساب</h1>
            <p className="text-emerald-100 text-sm">تعديل البيانات الشخصية وكلمة المرور</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-6">
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold shadow-sm border ${
            feedback.type === "error" ? "text-red-700 bg-red-50 border-red-200" : 
            feedback.type === "success" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-blue-700 bg-blue-50 border-blue-200"
          }`}>
            {feedback.type === "error" ? <AlertCircle className="w-6 h-6 flex-shrink-0" /> : <CheckCircle className="w-6 h-6 flex-shrink-0" />}
            {feedback.message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b border-gray-50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5 text-emerald-500" />
                البيانات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white">
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  الاسم بالكامل
                </label>
                <Input
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  القرية / المنطقة
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    required
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                  >
                    <option value="">اختر منطقتك...</option>
                    {VILLAGES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 flex items-center justify-between">
                  رقم الواتساب
                  <span className="text-red-500 font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded-full">
                    تغييره سيطلب تسجيل الدخول
                  </span>
                </label>
                <Input
                  icon={<Phone className="w-4 h-4 text-gray-400" />}
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 text-left"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b border-gray-50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Shield className="w-5 h-5 text-emerald-500" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription className="text-xs font-bold text-gray-500 pt-1">
                اترك هذه الحقول فارغة إذا لم تكن ترغب في تغيير كلمة المرور الحالية.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white">
              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  كلمة المرور الجديدة
                </label>
                <Input
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-black text-gray-700 mb-1.5 block">
                  تأكيد كلمة المرور الجديدة
                </label>
                <Input
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
