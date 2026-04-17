"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // ✅ OPTIMIZATION: Register SW after hydration to allow back/forward cache
    // Only register on client side and only on HTTPS in production
    if (typeof window !== "undefined" && "serviceWorker" in navigator && location.protocol === "https:") {
      // Use a setTimeout to ensure registration doesn't block cache restoration
      const registrationTimeout = setTimeout(() => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // Silently fail - SW not critical for functionality
        });
      }, 0);
      
      return () => clearTimeout(registrationTimeout);
    }
  }, []);

  // Component doesn't render anything - doesn't affect bfcache
  return null;
}
