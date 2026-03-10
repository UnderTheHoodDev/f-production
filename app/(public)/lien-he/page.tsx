import { Metadata } from 'next';

import ContactForm from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Liên hệ F.Production để được tư vấn về dịch vụ quay phim, chụp ảnh, livestream và truyền thông. Đội ngũ hỗ trợ sẵn sàng phục vụ bạn.',
  alternates: {
    canonical: '/lien-he',
  },
  openGraph: {
    title: 'Liên hệ | F Production',
    description:
      'Liên hệ F.Production để được tư vấn về dịch vụ quay phim, chụp ảnh, livestream và truyền thông.',
    url: '/lien-he',
  },
};

export default function ContactPage() {
  return (
    <main className="mt-16 min-h-screen">
      <ContactForm />
    </main>
  );
}
