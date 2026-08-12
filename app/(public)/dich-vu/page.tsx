import { Metadata } from 'next';

import ServiceShow from '@/components/services/service-show';

export const metadata: Metadata = {
  title: 'Dịch vụ',
  // Bản đầy đủ (khi bật lại các dịch vụ đang ẩn trong lib/services-data.ts):
  // 'Khám phá các dịch vụ chuyên nghiệp của F.Production: quay phim sự kiện, chụp ảnh,
  //  livestream, TVC, phim doanh nghiệp, podcast, chụp ảnh kiến trúc và truyền thông báo chí.'
  description:
    'Khám phá các dịch vụ chuyên nghiệp của F.Production: livestream, chụp ảnh sự kiện, quay phim sự kiện, chụp ảnh profile và quay phim podcast.',
  alternates: {
    canonical: '/dich-vu',
  },
  openGraph: {
    title: 'Dịch vụ | F Production',
    description:
      'Khám phá các dịch vụ chuyên nghiệp của F.Production: quay phim sự kiện, chụp ảnh, livestream và podcast.',
    url: '/dich-vu',
  },
};

export default function ServicePage() {
  return (
    <main className="mt-16 min-h-screen">
      <ServiceShow />
    </main>
  );
}
