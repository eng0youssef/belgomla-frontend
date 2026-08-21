"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Phone,
  Lock,
  Save,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  useCustomerDashboard,
  useUpdateCustomerProfile,
} from "@/hooks/use-customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeCustomerToken } from "@/services/api-client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          setFeedback({ type: "success", message: "تم تحديث بياناتك بنجاح ✅" });
        }
      },
      onError: (err) => {
        setFeedback({ type: "error", message: err.message || "حدث خطأ أثناء التحديث" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col justify-between" dir="rtl">
      <div>
        <Header />

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-10 w-10 p-0 rounded-xl"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">إعدادات الحساب</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تعديل البيانات الشخصية ومكان التوصيل وكلمة المرور
              </p>
            </div>
          </div>

          {feedback && (
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-xs sm:text-sm border shadow-xs ${
                feedback.type === "error"
                  ? "text-red-700 bg-red-50 border-red-200"
                  : feedback.type === "success"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-blue-700 bg-blue-50 border-blue-200"
              }`}
            >
              {feedback.type === "error" ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details Card */}
            <div className="clean-card p-6 bg-white space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  البيانات الشخصية والتوصيل
                </h3>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 mb-1.5 block">
                  الاسم بالكامل
                </label>
                <Input
                  icon={<User className="w-4 h-4 text-slate-400" />}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 mb-1.5 block">
                  العنوان
                </label>
                <Input
                  icon={<MapPin className="w-4 h-4 text-slate-400" />}
                  required
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="اكتب عنوانك بالتفصيل (المدينة، الحي، الشارع)..."
                  className="h-12 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>رقم الواتساب للتوصيل والمتابعة</span>
                  <span className="text-amber-700 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    تغييره سيتطلب تسجيل الدخول مجدداً
                  </span>
                </label>
                <Input
                  icon={<Phone className="w-4 h-4 text-slate-400" />}
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 bg-slate-50/50 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Card */}
            <div className="clean-card p-6 bg-white space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  تغيير كلمة المرور
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  اترك الحقول فارغة إذا كنت لا ترغب في تغيير كلمة المرور الحالية.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    كلمة المرور الجديدة
                  </label>
                  <Input
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-slate-50/50"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <Input
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-slate-50/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-13 text-base font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري حفظ التغييرات...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ التعديلات ✅
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

