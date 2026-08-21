import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ─── Edge Auth Guard ─────────────────────────────────────────────────────────
 *
 * Runs on the Edge Runtime BEFORE any page is server-rendered or streamed.
 * This is the PRIMARY security layer — it prevents the admin dashboard HTML
 * from ever reaching an unauthenticated client.
 *
 * HOW IT WORKS WITH THE IN-MEMORY TOKEN STRATEGY:
 *   - On login: token-store.ts writes a session-presence cookie ("1", not JWT)
 *   - Middleware: reads that cookie to decide whether to allow or redirect
 *   - On page load: hooks read _adminToken from JS memory (the actual JWT)
 *   - On refresh: in-memory token is gone → useEffect redirects to login
 *
 * SECONDARY GUARD:
 *   The useEffect checks in admin/page.tsx and admin/dashboard/page.tsx remain
 *   as a fallback for the in-memory token (which is lost on refresh).
 *
 * FAKE COOKIE ATTACK:
 *   An attacker who manually sets the session cookie bypasses this middleware
 *   but arrives at a page where getAdminToken() returns null → all API calls
 *   fail with 401 → they see an empty dashboard and get redirected to login.
 */

const ADMIN_SESSION_COOKIE = "slash_admin_session";
const CUSTOMER_SESSION_COOKIE = "slash_customer_session";

// Routes that require an authenticated admin session
const ADMIN_PROTECTED = ["/admin/dashboard"];

// Routes that require an authenticated customer session
const CUSTOMER_PROTECTED = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin routes ─────────────────────────────────────────────────────────
  if (ADMIN_PROTECTED.some((prefix) => pathname.startsWith(prefix))) {
    const hasSession = request.cookies.has(ADMIN_SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      // Preserve the originally requested URL so we can redirect back after login
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Customer routes ──────────────────────────────────────────────────────
  if (CUSTOMER_PROTECTED.some((prefix) => pathname.startsWith(prefix))) {
    const hasSession = request.cookies.has(CUSTOMER_SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths under /admin/dashboard and /dashboard.
     * Explicitly exclude:
     *   - _next/static  (static assets)
     *   - _next/image   (image optimization)
     *   - favicon.ico
     *   - public folder files
     */
    "/admin/dashboard/:path*",
    "/dashboard/:path*",
  ],
};
