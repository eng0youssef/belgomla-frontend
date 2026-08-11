import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Egyptian pound currency.
 */
export function formatPrice(price: number): string {
  return `${price} ج.م`;
}

/**
 * Generate a WhatsApp share URL with pre-filled text.
 */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a WhatsApp direct chat URL.
 */
export function whatsappChatUrl(phone: string): string {
  return `https://wa.me/${phone}`;
}
