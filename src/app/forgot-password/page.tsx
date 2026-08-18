"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/OtpInput";
import {
  useSendForgotPasswordOtp,
  useVerifyForgotPasswordOtp,
  useResetCustomerPassword,
  useResendOtp,
} from "@/hooks/use-customer";
import { OtpPurpose } from "@/types/api";

type Step = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const sendOtpMutation = useSendForgotPasswordOtp();
  const verifyOtpMutation = useVerifyForgotPasswordOtp();
  const resetPasswordMutation = useResetCustomerPassword();
  const resendOtpMutation = useResendOtp();

  const [step, setStep] = useState<Step>("EMAIL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  };

  // Step 1: Send OTP to customer's email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح (مثال: example@gmail.com)");
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({ email: cleanEmail });
      setStep("OTP");
    } catch (err: any) {
      setErrorMessage(
        err?.message || "لا يوجد حساب مسجل بهذا البريد الإلكتروني أو فشل إرسال الرمز."
      );
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length !== 6) {
      setErrorMessage("يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.");
      return;
    }

    try {
      const res = await verifyOtpMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        otpCode: otpCode.trim(),
      });
      setResetToken(res.resetToken);
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      setErrorMessage(err?.message || "كود التحقق غير صحيح أو انتهت صلاحيته.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setErrorMessage(null);
    try {
      await resendOtpMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        purpose: OtpPurpose.PasswordReset,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "فشل إعادة إرسال الكود. يرجى الانتظار والمحاولة ثانية.");
      throw err;
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("كلمة المرور يجب ألا تقل عن 6 أحرف.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
      });

      setStep("SUCCESS");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || "فشل تغيير كلمة المرور. يرجى إعادة المحاولة.");
    }
  };

  const loading =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    resetPasswordMutation.isPending;

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
          <p className="text-sm text-gray-500 font-bold">استعادة كلمة المرور</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
              {step === "EMAIL" && (
                <>
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  استعادة الحساب
                </>
              )}
              {step === "OTP" && (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  رمز التحقق (OTP)
                </>
              )}
              {step === "NEW_PASSWORD" && (
                <>
                  <Lock className="w-5 h-5 text-emerald-600" />
                  كلمة المرور الجديدة
                </>
              )}
              {step === "SUCCESS" && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  تم التحديث بنجاح
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
              {/* STEP 1: EMAIL */}
              {step === "EMAIL" && (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 font-bold text-center leading-relaxed">
                    أدخل بريدك الإلكتروني المسجل به حسابك وسنرسل لك رمز تحقق لاستعادة حسابك:
                  </p>

                  <div>
                    <label className="text-sm font-black text-gray-700 mb-1.5 block">
                      البريد الإلكتروني (Gmail)
                    </label>
                    <Input
                      icon={<Mail className="w-4 h-4" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      type="email"
                      dir="ltr"
                      required
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
                        جاري الإرسال...
                      </span>
                    ) : (
                      "إرسال كود التحقق 📩"
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500 font-bold">
                      تذكرت كلمة المرور؟{" "}
                      <Link href="/login" className="text-emerald-600 hover:underline">
                        تسجيل الدخول
                      </Link>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === "OTP" && (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  <p className="text-sm text-center text-gray-600 font-bold leading-relaxed">
                    أدخل كود التحقق المكون من 6 أرقام المستلم على بريدك الإلكتروني:
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
                    email={email}
                    disabled={loading}
                  />

                  <p className="text-[11px] text-gray-500 text-center font-bold">
                    💡 لم تجد الرسالة؟ تفقد مجلد الرسائل غير المرغوب فيها (Spam).
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
                        جاري التحقق...
                      </span>
                    ) : (
                      "تأكيد الرمز والمتابعة ✅"
                    )}
                  </Button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("EMAIL");
                        setOtpCode("");
                        setErrorMessage(null);
                      }}
                      className="text-xs text-gray-500 hover:text-emerald-700 font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      تعديل البريد الإلكتروني
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: NEW PASSWORD */}
              {step === "NEW_PASSWORD" && (
                <motion.form
                  key="password-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 font-bold text-center leading-relaxed">
                    اكتب كلمة المرور الجديدة الخاصة بحسابك:
                  </p>

                  <div>
                    <label className="text-sm font-black text-gray-700 mb-1.5 block">
                      كلمة المرور الجديدة
                    </label>
                    <Input
                      icon={<Lock className="w-4 h-4" />}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-black text-gray-700 mb-1.5 block">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <Input
                      icon={<Lock className="w-4 h-4" />}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
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
                        جاري الحفظ...
                      </span>
                    ) : (
                      "حفظ كلمة المرور والدخول 🚀"
                    )}
                  </Button>
                </motion.form>
              )}

              {/* STEP 4: SUCCESS */}
              {step === "SUCCESS" && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    تم تغيير كلمة المرور بنجاح!
                  </h3>
                  <p className="text-sm text-gray-500 font-bold">
                    جاري توجيهك إلى لوحة التحكم الآن...
                  </p>
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
