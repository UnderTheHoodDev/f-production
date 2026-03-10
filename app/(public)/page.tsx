import { Metadata } from 'next';

import HeroSection from '@/components/layout/hero-section';
import OurPartners from '@/components/our-partners';
import ProductList from '@/components/products/product-list';
import ServiceList from '@/components/services/service-list';

export const metadata: Metadata = {
  title: 'F Production',
  description:
    'F.Production cung cấp dịch vụ quay phim, chụp ảnh sự kiện, livestream, TVC, phim doanh nghiệp và truyền thông chuyên nghiệp. Đối tác tin cậy cho mọi dự án hình ảnh.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'F Production',
    description:
      'F.Production cung cấp dịch vụ quay phim, chụp ảnh sự kiện, livestream, TVC, phim doanh nghiệp và truyền thông chuyên nghiệp.',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServiceList />
      <OurPartners />
      <ProductList />
    </main>
  );
}
