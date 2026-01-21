import { notFound } from 'next/navigation';

import HeroSection from '@/components/layout/hero-section';
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

  const Icon = service.icon;

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Service Detail Section */}
      <section className="layout-padding py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="bg-primary/10 text-primary mb-6 flex size-20 items-center justify-center rounded-2xl">
              <Icon className="size-10" />
            </div>
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              {service.label}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
              {service.description}
            </p>
          </div>

          {/* Placeholder Content - Data will be added later */}
          <div className="bg-card rounded-2xl border p-8 md:p-12">
            <div className="text-muted-foreground space-y-6 text-center">
              <p className="text-lg">
                Nội dung chi tiết về dịch vụ{' '}
                <span className="text-primary font-semibold">
                  {service.label}
                </span>{' '}
                sẽ được cập nhật.
              </p>
              <div className="bg-surface-alt mx-auto h-px w-24" />
              <p className="text-sm">
                Liên hệ với chúng tôi để biết thêm chi tiết về dịch vụ này.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
