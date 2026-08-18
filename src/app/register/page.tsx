"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/OtpInput";
import {
  useSendRegistrationOtp,
  useRegisterWithOtp,
  useResendOtp,
} from "@/hooks/use-customer";
import { VILLAGES } from "@/lib/constants";
import { OtpPurpose } from "@/types/api";

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

  // Validate Egyptian phone number
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
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح (مثال: example@gmail.com)");
      return;
    }

    if (!isValidEgyptianPhone(cleanPhone)) {
      setErrorMessage("يرجى إدخال رقم هاتف مصري صحيح للتوصيل (مثال: 01012345678)");
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
          <p className="text-sm text-gray-500 font-bold">
            {step === "FORM" ? "إنشاء حساب جديد وتأكيد البريد الإلكتروني" : "تأكيد ملكية الحساب"}
          </p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
              {step === "FORM" ? (
                <>أهلاً بك في بالجملة 🎉</>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  رمز التحقق (OTP)
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Error Message Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl font-bold mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "FORM" ? (
                <motion.form
                  key="form-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
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
                      البريد الإلكتروني (Gmail)
                    </label>
                    <Input
                      icon={<Mail className="w-4 h-4" />}
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@gmail.com"
                      dir="ltr"
                      required
                    />
                    <p className="text-[11px] text-gray-500 mt-1 font-bold">
                      *سنرسل كود التحقق السداسي (OTP) إلى بريدك الإلكتروني
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-black text-gray-700 mb-1.5 block">
                      رقم الهاتف (للتوصيل ومتابعة الطلبات)
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
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg font-black"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري إرسال الرمز...
                      </span>
                    ) : (
                      "متابعة وإرسال كود التحقق 📩"
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
                </motion.form>
              ) : (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyAndRegister}
                  className="space-y-5"
                >
                  <p className="text-sm text-center text-gray-600 font-bold leading-relaxed">
                    أدخل كود التحقق المكون من 6 أرقام المرسل إلى بريدك الإلكتروني لتأكيد الحساب:
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

                  <p className="text-[11px] text-gray-500 text-center font-bold">
                    💡 لم تجد الرسالة في صندوق الوارد؟ تفقد مجلد الرسائل غير المرغوب فيها (Spam).
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg font-black"
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التأكيد والتسجيل...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        تأكيد وإنشاء الحساب 🚀
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
                      className="text-xs text-gray-500 hover:text-emerald-700 font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      تعديل البريد الإلكتروني أو البيانات
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
