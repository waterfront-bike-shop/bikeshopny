"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function ClientAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pageview",
      page_path: url,
    });
    console.log("📦 GTM pageview:", url);
  }, [pathname, searchParams]);

  return null;
}

export default function ClientAnalytics() {
  return (
    <Suspense fallback={null}>
      <ClientAnalyticsContent />
    </Suspense>
  );
}