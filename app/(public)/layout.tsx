import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import Footer from "@/components/layout/footer";
import NavBar from "@/components/layout/nav-bar";

import "./globals.css";

export const metadata: Metadata = {
  title: "F Production",
  description: "F.Production - Dịch vụ quay phim chụp ảnh chuyên nghiệp",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader showSpinner={false} color="#d9b588" />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
