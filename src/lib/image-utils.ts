/**
 * ─── Image URL Validation Utility ─────────────────────────────────────────────
 * Validates that an image URL is safe to pass to Next.js <Image />.
 * Accepts:
 *   - Relative URLs starting with '/' (local public assets)
 *   - Absolute HTTPS URLs (e.g. Cloudinary, CDNs)
 * Rejects:
 *   - HTTP (non-secure) URLs
 *   - JavaScript/Data URI injection attempts (e.g. javascript:, data:text/html)
 *   - Private / loopback IP addresses (SSRF mitigation)
 */

const BLOCKED_HOST_PREFIXES = [
  "localhost",
  "127.",
  "0.",
  "10.",
  "169.254.",
  "192.168.",
];

export function isTrustedImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Local static paths (e.g. /product.jpg)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    for (const prefix of BLOCKED_HOST_PREFIXES) {
      if (host.startsWith(prefix)) {
        return false;
      }
    }

    // Block 172.16.0.0 - 172.31.255.255
    if (host.startsWith("172.")) {
      const parts = host.split(".");
      if (parts.length >= 2) {
        const secondOctet = parseInt(parts[1], 10);
        if (!isNaN(secondOctet) && secondOctet >= 16 && secondOctet <= 31) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return false;
  }
}
