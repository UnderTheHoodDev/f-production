import HeroSection from "@/components/layout/hero-section";
import OurPartners from "@/components/our-partners";
import ProductList from "@/components/products/product-list";
import ServiceList from "@/components/services/service-list";

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
