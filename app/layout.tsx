import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "F.Production Studio | Dịch vụ chụp ảnh & studio",
  description:
    "Giải pháp chụp ảnh chuyên nghiệp cho doanh nghiệp, cá nhân và thương hiệu tại F.Production Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Chỉ set theme cho trang admin
                  const path = window.location.pathname;
                  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
                    const theme = localStorage.getItem('fproduction-theme') || 'dark';
                    document.documentElement.classList.add(theme);
                  } else {
                    // Trang login và root luôn dùng dark theme
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
