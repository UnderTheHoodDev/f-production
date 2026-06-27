import { prisma } from "@/lib/prisma";
import { QuoteAdminShell } from "@/components/quotes/quote-admin-shell";
import { QuotesPageClient } from "@/components/quotes/quotes-page-client";
import type { QuoteListItem } from "@/components/quotes/quotes-table";
import type { QuoteStatus } from "@/lib/quotes/types";

export const revalidate = 0;

const dateOnly = (v: Date | string | null): string | null => {
  if (!v) return null;
  return typeof v === "string" ? v.slice(0, 10) : v.toISOString().slice(0, 10);
};

export default async function QuotesPage() {
  const rows = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      quoteNumber: true,
      token: true,
      recipientName: true,
      status: true,
      total: true,
      issueDate: true,
      customerFeedback: true,
      respondedAt: true,
      createdAt: true,
    },
  });

  const quotes: QuoteListItem[] = rows.map((q) => ({
    id: q.id,
    quoteNumber: q.quoteNumber,
    token: q.token,
    recipientName: q.recipientName,
    status: q.status as QuoteStatus,
    total: Number(q.total),
    issueDate: dateOnly(q.issueDate),
    customerFeedback: q.customerFeedback ?? null,
    respondedAt: q.respondedAt ? q.respondedAt.toISOString() : null,
    createdAt: q.createdAt.toISOString(),
  }));

  return (
    <QuoteAdminShell breadcrumb="Báo giá">
      <QuotesPageClient initialQuotes={quotes} />
    </QuoteAdminShell>
  );
}
