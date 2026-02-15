import { notFound } from 'next/navigation';

import ServiceShowBySlug from '@/components/services/service-show-by-slug';
import { getServiceBySlug, services } from '@/lib/services-data';

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Không tìm thấy dịch vụ',
    };
  }

  return {
    title: `${service.label} | F Production`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="mt-16">
      <ServiceShowBySlug slug={slug} />
    </main>
  );
}
