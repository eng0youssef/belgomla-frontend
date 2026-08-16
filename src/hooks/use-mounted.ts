"use client";

import { useEffect, useState } from "react";

/**
 * Hook that returns true only after the component has mounted on the client.
 * Used to avoid SSR/hydration mismatch warnings when checking client-only state
 * (such as in-memory auth tokens or browser APIs).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
