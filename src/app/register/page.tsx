"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Lock,
  Phone,
  User,
  MapPin,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/OtpInput";
import {
  useSendRegistrationOtp,
  useRegisterWithOtp,
  useResendOtp,
} from "@/hooks/use-customer";
import { OtpPurpose } from "@/types/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const sendOtpMutation = useSendRegistrationOtp();
  const registerWithOtpMutation = useRegisterWithOtp();
  const resendOtpMutation = useResendOtp();

  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    villageName: "",
    password: "",
    referralCode: "",
  });

  const [otpCode, setOtpCode] = useState("");

  const isValidEgyptianPhone = (phone: string) => {
    const cleaned = phone.trim().replace(/[\s\-()]/g, "");
    return /^01[0125][0-9]{8}$/.test(cleaned);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phoneNumber.trim();

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح (مثال: name@gmail.com)");
      return;
    }

    if (!isValidEgyptianPhone(cleanPhone)) {
      setErrorMessage("يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("كلمة المرور يجب ألا تقل عن 6 أحرف");
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({
        email: cleanEmail,
        phoneNumber: cleanPhone,
      });
      setStep("OTP");
    } catch (err: any) {
      setErrorMessage(
        err?.message || "فشل إرسال كود التحقق. يرجى التأكد من البيانات والمحاولة ثانية."
      );
    }
  };

  const handleVerifyAndRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length !== 6) {
      setErrorMessage("يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.");
      return;
    }

    try {
      await registerWithOtpMutation.mutateAsync({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        villageName: formData.villageName,
        password: formData.password,
        otpCode: otpCode.trim(),
        referralCode: formData.referralCode.trim() || null,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err?.message || "كود التحقق غير صحيح أو انتهت صلاحيته.");
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    try {
      await resendOtpMutation.mutateAsync({
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        purpose: OtpPurpose.Registration,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "فشل إعادة إرسال الكود. يرجى الانتظار والمحاولة ثانية.");
      throw err;
    }
  };

  const loading = sendOtpMutation.isPending || registerWithOtpMutation.isPending;

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col justify-between" dir="rtl">
      <div>
        <Header />

        <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
          <div className="clean-card p-6 sm:p-8 bg-white shadow-lg space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {step === "FORM" ? "إنشاء حساب جديد" : "تأكيد بريدك الإلكتروني"}
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                {step === "FORM"
                  ? "سجّل في دقيقة واستمتع بأسعار الجملة لبيتك"
                  : `أدخل كود التحقق السداسي المرسل إلى ${formData.email}`}
              </p>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === "FORM" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    الاسم بالكامل
                  </label>
                  <Input
                    icon={<User className="w-4 h-4 text-slate-400" />}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="مثال: أحمد محمود"
                    className="h-12 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    البريد الإلكتروني (Gmail)
                  </label>
                  <Input
                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@gmail.com"
                    dir="ltr"
                    className="h-12 bg-slate-50/50"
                    required
                  />
                  <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                    *هنبعتلك كود التفعيل المكون من 6 أرقام على إيميلك
                  </span>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    رقم الهاتف (الواتساب للتوصيل)
                  </label>
                  <Input
                    icon={<Phone className="w-4 h-4 text-slate-400" />}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="01012345678"
                    type="tel"
                    dir="ltr"
                    className="h-12 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    العنوان
                  </label>
                  <Input
                    icon={<MapPin className="w-4 h-4 text-slate-400" />}
                    value={formData.villageName}
                    onChange={(e) =>
                      setFormData({ ...formData, villageName: e.target.value })
                    }
                    placeholder="اكتب عنوانك بالتفصيل..."
                    className="h-12 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    كلمة المرور
                  </label>
                  <Input
                    icon={<Lock className="w-4 h-4 text-slate-400" />}
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="•••••••• (6 أحرف أو أكثر)"
                    className="h-12 bg-slate-50/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base font-bold h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري إرسال الرمز...
                    </span>
                  ) : (
                    "متابعة وإرسال كود التحقق"
                  )}
                </Button>

                <div className="text-center pt-2 border-t border-slate-100 mt-4">
                  <p className="text-xs text-slate-500 font-bold">
                    عندك حساب بالفعل؟{" "}
                    <Link href="/login" className="text-emerald-700 hover:underline font-black">
                      سجل دخول من هنا
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                <p className="text-xs text-center text-slate-600 font-bold leading-relaxed">
                  أدخل كود التحقق المكون من 6 أرقام لتأكيد حسابك:
                </p>

                <OtpInput
                  length={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  onComplete={(code) => {
                    setOtpCode(code);
                  }}
                  onResend={handleResend}
                  isResending={resendOtpMutation.isPending}
                  email={formData.email}
                  disabled={loading}
                />

                <p className="text-[11px] text-slate-500 text-center font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  إذا لم تجد الرسالة في صندوق الوارد، تفقد مجلد الرسائل غير المرغوب فيها (Spam).
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base font-bold h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التأكيد والتسجيل...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      تأكيد وإنشاء الحساب
                    </span>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("FORM");
                      setOtpCode("");
                      setErrorMessage(null);
                    }}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    تعديل البيانات أو الإيميل
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

