/**
 * ─── In-Memory Token Store + Session-Presence Cookies ───────────────────────
 *
 * TWO-LAYER ARCHITECTURE:
 *
 * Layer 1 — In-Memory JWT (XSS-safe)
 *   The actual JWT lives in a JS module-level variable. It is NOT accessible
 *   via any DOM API (localStorage, sessionStorage, document.cookie), so an
 *   XSS payload cannot steal it through the browser's standard attack surface.
 *   Tradeoff: token is lost on page reload → user must re-login after refresh.
 *
 * Layer 2 — Session-Presence Cookie (for Edge Middleware)
 *   Next.js middleware runs on the Edge before any page is served and can only
 *   inspect cookies — it has no access to JS memory. So we set a lightweight
 *   "I have a session" cookie (value = "1", NOT the JWT) that the middleware
 *   uses to decide whether to redirect to login.
 *
 *   Security model: if an attacker manually sets a fake session cookie they
 *   bypass the middleware redirect BUT land on a page where every API call
 *   fails with 401 (because getAdminToken() returns null from memory). They
 *   see nothing sensitive.
 *
 * PRODUCTION UPGRADE PATH (httpOnly cookies):
 *   1. Add /api/auth/admin/login and /api/auth/customer/login Route Handlers
 *   2. Route Handlers proxy to the .NET backend and set the JWT as:
 *        httpOnly; Secure; SameSite=Strict; Path=/
 *   3. All API calls go through /api/* proxies that forward the cookie header
 *   4. Middleware reads the httpOnly cookie directly — no session cookie needed
 *   5. Delete this file — no JS-accessible token management required at all
 */

// ─── Cookie names ─────────────────────────────────────────────────────────────
// These cookies hold the value "1" ONLY — never the actual JWT.
const ADMIN_SESSION_COOKIE = "belgomla_admin_session";
const CUSTOMER_SESSION_COOKIE = "belgomla_customer_session";

// ─── In-memory JWT storage ───────────────────────────────────────────────────
let _adminToken: string | null = null;
let _customerToken: string | null = null;

// ─── Cookie helpers (client-side only) ───────────────────────────────────────

function writeSessionCookie(name: string): void {
  if (typeof document === "undefined") return;
  // SameSite=Strict prevents CSRF. No httpOnly so JS can clear it on logout.
  // No explicit Max-Age → session cookie (cleared when browser closes).
  document.cookie = `${name}=1; path=/; SameSite=Strict`;
}

function clearSessionCookie(name: string): void {
  if (typeof document === "undefined") return;
  // Setting Max-Age=0 immediately expires the cookie in all browsers.
  document.cookie = `${name}=; path=/; SameSite=Strict; Max-Age=0`;
}

// ─── Admin Token ─────────────────────────────────────────────────────────────

export function getAdminToken(): string | null {
  return _adminToken;
}

export function setAdminToken(token: string): void {
  _adminToken = token;
  writeSessionCookie(ADMIN_SESSION_COOKIE);
}

export function removeAdminToken(): void {
  _adminToken = null;
  clearSessionCookie(ADMIN_SESSION_COOKIE);
}

// ─── Customer Token ──────────────────────────────────────────────────────────

export function getCustomerToken(): string | null {
  return _customerToken;
}

export function setCustomerToken(token: string): void {
  _customerToken = token;
  writeSessionCookie(CUSTOMER_SESSION_COOKIE);
}

export function removeCustomerToken(): void {
  _customerToken = null;
  clearSessionCookie(CUSTOMER_SESSION_COOKIE);
}

