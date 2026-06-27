import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { serializeQuote } from "@/lib/quotes/serialize";
import { buildQuoteDoc } from "@/lib/quotes/view-model";
import { QuoteDocument } from "@/components/quotes/public/quote-document";
import { QuoteDownloadButtons } from "@/components/quotes/public/quote-download-buttons";
import { QuoteFeedback } from "@/components/quotes/public/quote-feedback";
import { QuoteViewBeacon } from "@/components/quotes/public/quote-view-beacon";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const quote = await prisma.quote.findUnique({
    where: { token },
    select: { quoteNumber: true, status: true },
  });
  if (!quote || quote.status === "DRAFT") return { title: "Báo giá" };
  return {
    title: `Báo giá ${quote.quoteNumber}`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const quote = await prisma.quote.findUnique({ where: { token } });
  if (!quote || quote.status === "DRAFT") notFound();

  const dto = serializeQuote(quote);
  const doc = buildQuoteDoc(dto);
  const expired = dto.validUntil
    ? dto.validUntil < new Date().toISOString().slice(0, 10)
    : false;

  return (
    <main className="min-h-screen px-4 py-8">
      <QuoteViewBeacon token={token} />
      <div className="mx-auto max-w-5xl space-y-6">
        <QuoteDocument doc={doc} expired={expired} />
        <QuoteFeedback
          token={token}
          prompt={dto.content.feedback.prompt}
          options={dto.content.feedback.options}
          initial={dto.customerFeedback}
          disabled={expired}
        />
        <QuoteDownloadButtons token={token} />
      </div>
    </main>
  );
}
