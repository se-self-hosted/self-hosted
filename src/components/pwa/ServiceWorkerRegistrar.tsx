"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js in production builds. Skipped under `next dev`,
 * where a worker caching build chunks would serve stale code between edits.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) => console.warn("Service worker registration failed:", error));
  }, []);
  return null;
}
