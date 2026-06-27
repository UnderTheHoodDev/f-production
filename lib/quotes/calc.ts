// Server-authoritative money math for quotes. All amounts are integer VND.
// NEVER trust client-sent subtotal/total — recompute from content on every write.

import type { QuoteContent, QuoteSection } from "./types";

export type QuoteTotals = {
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
};

const toInt = (n: unknown): number => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? v : 0;
};

/** Sum of THÀNH TIỀN for one section (display-only, e.g. the gold pill). */
export function sectionSubtotal(section: QuoteSection): number {
  return section.items.reduce((sum, item) => sum + toInt(item.amount), 0);
}

/** Sum of every line's THÀNH TIỀN across all sections. */
export function computeSubtotal(content: QuoteContent): number {
  return content.sections.reduce((sum, s) => sum + sectionSubtotal(s), 0);
}

/**
 * Authoritative totals. Tax is rounded exactly once over the taxable base
 * (subtotal − discount), never per item, to match the BG-0059 sample.
 */
export function computeTotals(params: {
  content: QuoteContent;
  discount: number;
  taxRate: number;
}): QuoteTotals {
  const subtotal = computeSubtotal(params.content);

  // clamp discount to [0, subtotal] and taxRate to [0, 100]
  const discount = Math.min(Math.max(toInt(params.discount), 0), subtotal);
  const taxRate = Math.min(Math.max(Number(params.taxRate) || 0, 0), 100);

  const taxableBase = subtotal - discount;
  const taxAmount = Math.round((taxableBase * taxRate) / 100);
  const total = taxableBase + taxAmount;

  return { subtotal, discount, taxRate, taxAmount, total };
}

/** Suggested line total when qty/sessions/unitPrice change (override-capable). */
export function suggestedAmount(item: {
  qty: number;
  sessions: number | null;
  unitPrice: number;
}): number {
  const sessions = item.sessions == null ? 1 : Number(item.sessions);
  return toInt(Number(item.qty) * sessions * Number(item.unitPrice));
}
