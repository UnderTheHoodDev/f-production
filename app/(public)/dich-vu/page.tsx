import { Metadata } from 'next';

import ServiceShow from '@/components/services/service-show';

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description:
    'Khám phá các dịch vụ chuyên nghiệp của F.Production: quay phim sự kiện, chụp ảnh, livestream, TVC, phim doanh nghiệp, podcast, chụp ảnh kiến trúc và truyền thông báo chí.',
  alternates: {
    canonical: '/dich-vu',
  },
  openGraph: {
    title: 'Dịch vụ | F Production',
    description:
      'Khám phá các dịch vụ chuyên nghiệp của F.Production: quay phim, chụp ảnh, livestream, TVC và truyền thông.',
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
