import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { QuoteAdminShell } from "@/components/quotes/quote-admin-shell";
import { QuoteBuilder } from "@/components/quotes/quote-builder";
import { serializeQuote } from "@/lib/quotes/serialize";

export const revalidate = 0;

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) notFound();

  return (
    <QuoteAdminShell
      breadcrumb={`Sửa ${quote.quoteNumber}`}
      parentHref="/admin/quotes"
      parentLabel="Báo giá"
    >
      <QuoteBuilder quote={serializeQuote(quote)} />
    </QuoteAdminShell>
  );
}
