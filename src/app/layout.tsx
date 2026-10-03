import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SLASH | سلاش - مع سلاش.. السعر ببلاش",
  description:
    "مع سلاش.. السعر ببلاش! وفر فرق المحلات في جيبك. اشتري بالقطعة بسعر كرتونة الجملة، كاش عند الاستلام بعد المعاينة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="min-h-screen bg-background font-cairo antialiased selection:bg-emerald-200 selection:text-emerald-900 pb-16 md:pb-0">
        <QueryProvider>{children}</QueryProvider>
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
