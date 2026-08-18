import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Formats Egyptian mobile phone number to international E.164 format (+201xxxxxxxxx).
 */
export function formatToInternationalPhone(phone: string): string {
  const cleaned = phone.trim().replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+20")) return cleaned;
  if (cleaned.startsWith("0020")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("20") && cleaned.length === 12) return "+" + cleaned;
  if (cleaned.startsWith("0")) return "+2" + cleaned;
  return "+20" + cleaned;
}

/**
 * Initializes or resets the Firebase RecaptchaVerifier on a container element.
 */
export function getRecaptchaVerifier(containerId: string = "recaptcha-container"): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      // Ignore clear errors
    }
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      // Response expired. Ask user to solve reCAPTCHA again.
    },
  });

  return window.recaptchaVerifier;
}

/**
 * Sends real SMS OTP using Firebase Phone Auth.
 */
export async function sendFirebasePhoneOtp(
  phone: string,
  containerId: string = "recaptcha-container"
): Promise<ConfirmationResult> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured in .env.local yet.");
  }

  const auth = getFirebaseAuth();
  const formattedPhone = formatToInternationalPhone(phone);
  const appVerifier = getRecaptchaVerifier(containerId);

  const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
  window.confirmationResult = confirmationResult;
  return confirmationResult;
}

/**
 * Confirms the SMS code entered by the user and retrieves the Firebase ID Token.
 */
export async function confirmFirebasePhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<{ idToken: string; phoneNumber: string }> {
  const userCredential = await confirmationResult.confirm(otpCode);
  const idToken = await userCredential.user.getIdToken();
  const phoneNumber = userCredential.user.phoneNumber || "";

  return {
    idToken,
    phoneNumber,
  };
}
