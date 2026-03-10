import { Metadata } from 'next';

import AboutPage from '@/components/about/about-page';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description:
    'Tìm hiểu về F.Production - đơn vị chuyên cung cấp dịch vụ quay phim, chụp ảnh và truyền thông chuyên nghiệp. Đội ngũ sáng tạo, tận tâm và giàu kinh nghiệm.',
  alternates: {
    canonical: '/gioi-thieu',
  },
  openGraph: {
    title: 'Giới thiệu | F Production',
    description:
      'Tìm hiểu về F.Production - đơn vị chuyên cung cấp dịch vụ quay phim, chụp ảnh và truyền thông chuyên nghiệp.',
    url: '/gioi-thieu',
  },
};

export default function AboutUsPage() {
  return (
    <main className="mt-16 min-h-screen">
      {/* <HeroSection /> */}
      <AboutPage />
    </main>
  );
}
