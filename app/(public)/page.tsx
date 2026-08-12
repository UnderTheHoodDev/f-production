import { Metadata } from 'next';

import HeroSection from '@/components/layout/hero-section';
import OurPartners from '@/components/our-partners';
import ProductList from '@/components/products/product-list';
import ServiceList from '@/components/services/service-list';

export const metadata: Metadata = {
  title: 'F Production',
  // Bản đầy đủ (khi bật lại các dịch vụ đang ẩn trong lib/services-data.ts):
  // 'F.Production cung cấp dịch vụ quay phim, chụp ảnh sự kiện, livestream, TVC,
  //  phim doanh nghiệp và truyền thông chuyên nghiệp. Đối tác tin cậy cho mọi dự án hình ảnh.'
  description:
    'F.Production cung cấp dịch vụ quay phim sự kiện, chụp ảnh sự kiện, livestream, chụp ảnh profile và podcast chuyên nghiệp. Đối tác tin cậy cho mọi dự án hình ảnh.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'F Production',
    description:
      'F.Production cung cấp dịch vụ quay phim sự kiện, chụp ảnh sự kiện, livestream, chụp ảnh profile và podcast chuyên nghiệp.',
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
