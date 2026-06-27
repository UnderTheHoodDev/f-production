import type { Metadata } from "next";

import { montserrat } from "@/app/fonts";

import "../(public)/globals.css";

export const metadata: Metadata = {
  title: "Báo giá",
  robots: { index: false, follow: false },
};

// Standalone root layout for the public quote portal: light theme, no site
// navbar/footer. Quote pages must never be indexed (unguessable token URLs).
export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`light ${montserrat.variable} font-sans`}>
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
