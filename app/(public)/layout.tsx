import { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';

import { montserrat } from '@/app/fonts';
import Footer from '@/components/layout/footer';
import NavBar from '@/components/layout/nav-bar';

import './globals.css';

const siteUrl = 'https://fproduction.vn';

export const metadata: Metadata = {
  title: {
    default: 'F Production',
    template: '%s | F Production',
  },
  description:
    'F.Production - Đơn vị cung cấp dịch vụ quay phim, chụp ảnh sự kiện, TVC, phim doanh nghiệp, livestream và truyền thông chuyên nghiệp tại Việt Nam.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'F Production',
    title: 'F Production',
    description:
      'Đơn vị cung cấp dịch vụ quay phim, chụp ảnh sự kiện, TVC, phim doanh nghiệp, livestream và truyền thông chuyên nghiệp tại Việt Nam.',
    images: [{ url: '/f-production.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'F Production',
    description:
      'Đơn vị cung cấp dịch vụ quay phim, chụp ảnh sự kiện, TVC, phim doanh nghiệp, livestream và truyền thông chuyên nghiệp tại Việt Nam.',
    images: ['/f-production.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${montserrat.variable} font-sans`}>
      <body>
        <NextTopLoader showSpinner={false} color="#d9b588" />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
