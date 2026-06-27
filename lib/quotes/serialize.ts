import type { Quote } from "@/lib/generated/prisma/client";
import { getPublicUrl } from "@/lib/s3";
import type { QuoteContent, QuoteDTO, QuoteStatus } from "./types";

// Prisma Decimal -> JS number. VND amounts are far below Number.MAX_SAFE_INTEGER.
const num = (v: unknown): number => Number(v ?? 0);

// A @db.Date / timestamp value (Date or string, depending on driver) -> "YYYY-MM-DD".
const dateOnly = (v: Date | string | null | undefined): string | null => {
  if (!v) return null;
  if (typeof v === "string") return v.slice(0, 10);
  return v.toISOString().slice(0, 10);
};

const iso = (v: Date | string | null | undefined): string | null => {
  if (!v) return null;
  return (v instanceof Date ? v : new Date(v)).toISOString();
};

/** Map a Prisma Quote row to the client-/JSON-safe DTO. */
export function serializeQuote(q: Quote): QuoteDTO {
  return {
    id: q.id,
    quoteNumber: q.quoteNumber,
    token: q.token,
    recipientName: q.recipientName,
    status: q.status as QuoteStatus,
    subtotal: num(q.subtotal),
    discount: num(q.discount),
    taxRate: num(q.taxRate),
    taxAmount: num(q.taxAmount),
    total: num(q.total),
    issueDate: dateOnly(q.issueDate) ?? "",
    validUntil: dateOnly(q.validUntil),
    content: q.content as unknown as QuoteContent,
    customerFeedback: q.customerFeedback ?? null,
    feedbackComment: q.feedbackComment ?? null,
    respondedAt: iso(q.respondedAt),
    viewedAt: iso(q.viewedAt),
    representativeKey: q.representativeKey ?? null,
    representativeUrl: q.representativeKey ? getPublicUrl(q.representativeKey) : null,
    createdAt: iso(q.createdAt) ?? "",
    updatedAt: iso(q.updatedAt) ?? "",
  };
}
