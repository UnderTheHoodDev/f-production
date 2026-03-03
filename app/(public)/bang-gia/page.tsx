import PriceList from '@/components/price/price-list';
import { notFound } from 'next/navigation';

const SHOW_PRICING_PAGE = false;

export default function PricingPage() {
  if (!SHOW_PRICING_PAGE) {
    notFound();
  }

  return (
    <main className="mt-16 min-h-screen">
      <PriceList />
    </main>
  );
}
