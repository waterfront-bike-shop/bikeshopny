// src/app/components/ClientGTM.tsx
"use client";

import GTM from "./GTM";
import ClientAnalytics from "./ClientAnalytics";

export default function ClientGTM() {
  return (
    <>
      <GTM />
      <ClientAnalytics />
    </>
  );
}