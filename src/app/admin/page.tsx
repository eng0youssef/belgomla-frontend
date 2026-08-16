"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/services/api-client";

/**
 * /admin — simple redirect dispatcher.
 *
 * The Edge middleware (src/middleware.ts) is the PRIMARY security guard for
 * /admin/dashboard. This page just routes /admin to the right destination:
 *   - In-memory token present  -> /admin/dashboard (already logged in)
 *   - No in-memory token       -> /admin/login
 *
 * Note: after a page refresh the in-memory token is gone regardless of the
 * session cookie, so this will always redirect to /admin/login on refresh.
 * That is correct and expected behavior for our in-memory token strategy.
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (getAdminToken()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
