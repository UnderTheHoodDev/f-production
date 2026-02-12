import HeroSection from "@/components/layout/hero-section";
import OurPartners from "@/components/our-partners";
import ProductList from "@/components/products/product-list";
import ServiceList from "@/components/services/service-list";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

export default async function HomePage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  const partnersWithUrls = partners.map((p) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoKey ? getPublicUrl(p.logoKey) : undefined,
  }));

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServiceList />
      <OurPartners partners={partnersWithUrls} />
      <ProductList />
    </main>
  );
}
