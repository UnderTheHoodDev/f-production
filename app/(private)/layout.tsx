import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'F.Production Studio | Dịch vụ chụp ảnh & studio',
  description:
    'Giải pháp chụp ảnh chuyên nghiệp cho doanh nghiệp, cá nhân và thương hiệu tại F.Production Studio.',
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
                  const path = window.location.pathname;
                  // Trang admin (không phải login) dùng light theme
                  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
                    const theme = localStorage.getItem('admin-theme') || 'light';
                    document.documentElement.classList.remove('dark', 'light');
                    document.documentElement.classList.add(theme);
                  } else {
                    // Trang login giữ dark theme
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
