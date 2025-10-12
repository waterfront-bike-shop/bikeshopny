"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// ✅ Tell TypeScript about GTM's global dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}


export default function ClientAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      console.log("📦 GTM tracking page:", url);

      // Push pageview to GTM dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pageview",
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
