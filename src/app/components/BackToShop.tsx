"use client";

import { ArrowLeft } from "phosphor-react";
import Link from "next/link";

export default function BackToShop() {
  return (
    <Link
      href="/shop"
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
    >
      <ArrowLeft size={20} weight="bold" className="mr-1" />
      Back to Shop
    </Link>
  );
}
