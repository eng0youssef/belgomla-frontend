"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  onResend?: () => Promise<void> | void;
  isResending?: boolean;
  disabled?: boolean;
  initialCooldownSeconds?: number;
  phoneNumber?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  onResend,
  isResending = false,
  disabled = false,
  initialCooldownSeconds = 60,
  phoneNumber,
}: OtpInputProps) {
  const [cooldown, setCooldown] = useState(initialCooldownSeconds);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array of chars
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleDigitChange = (index: number, val: string) => {
    if (disabled) return;

    // Only allow numbers
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      // Clear current digit
      const nextDigits = [...digits];
      nextDigits[index] = "";
      const newVal = nextDigits.join("");
      onChange(newVal);
      return;
    }

    if (cleanVal.length > 1) {
      // Handle paste of multiple characters
      const pastedDigits = cleanVal.slice(0, length).split("");
      const nextDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (index + i < length) {
          nextDigits[index + i] = d;
        }
      });
      const newVal = nextDigits.join("");
      onChange(newVal);
      const focusIndex = Math.min(index + pastedDigits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      if (newVal.length === length && onComplete) {
        onComplete(newVal);
      }
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = singleDigit;
    const newVal = nextDigits.join("");
    onChange(newVal);

    // Auto-focus next input
    if (index < length - 1 && singleDigit) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger complete if full
    if (newVal.length === length && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowRight" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      if (pasted.length === length && onComplete) {
        onComplete(pasted);
      }
    }
  };

  const handleResendClick = async () => {
    if (cooldown > 0 || isResending || !onResend) return;
    try {
      await onResend();
      setCooldown(60);
    } catch {
      // Handled by parent
    }
  };

  return (
    <div className="space-y-4">
      {phoneNumber && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-bold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
          <Smartphone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>تم إرسال كود التحقق إلى: </span>
          <strong className="text-emerald-800 font-mono text-sm" dir="ltr">
            {phoneNumber}
          </strong>
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <div className="flex items-center justify-center gap-2" dir="ltr">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-11 h-13 text-center text-2xl font-black rounded-xl border-2 border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none disabled:opacity-50 disabled:bg-gray-100 shadow-sm"
          />
        ))}
      </div>

      {/* Resend Cooldown Section */}
      {onResend && (
        <div className="text-center pt-2">
          {cooldown > 0 ? (
            <p className="text-xs text-gray-500 font-bold">
              إعادة إرسال الرمز خلال{" "}
              <span className="text-emerald-700 font-mono font-black text-sm">
                00:{cooldown < 10 ? `0${cooldown}` : cooldown}
              </span>
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendClick}
              disabled={isResending}
              className="text-xs text-emerald-700 font-black hover:text-emerald-800 hover:bg-emerald-50"
            >
              {isResending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جاري الإرسال...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  إعادة إرسال كود التحقق
                </span>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
