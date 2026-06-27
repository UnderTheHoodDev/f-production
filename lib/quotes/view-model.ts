// Normalized, render-ready view of a quote shared by the PDF and Excel
// generators (and usable by the web document) so all outputs stay in sync.
// Totals are recomputed here — never read straight from client-sent numbers.

import { computeTotals, sectionSubtotal } from "./calc";
import type {
  QuoteBlock,
  QuoteCompany,
  QuoteDTO,
  QuoteItem,
  QuoteRecipient,
  QuoteRepresentative,
} from "./types";

export type QuoteDocSection = {
  title: string;
  subtotal: number;
  items: QuoteItem[];
};

export type QuoteDoc = {
  quoteNumber: string;
  company: QuoteCompany;
  recipient: QuoteRecipient;
  sections: QuoteDocSection[];
  blocks: QuoteBlock[];
  representative: QuoteRepresentative;
  representativeUrl: string | null;
  issueDate: string; // YYYY-MM-DD
  totals: {
    subtotal: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  };
};

export function buildQuoteDoc(quote: QuoteDTO): QuoteDoc {
  const totals = computeTotals({
    content: quote.content,
    discount: quote.discount,
    taxRate: quote.taxRate,
  });

  return {
    quoteNumber: quote.quoteNumber,
    company: quote.content.company,
    recipient: quote.content.recipient,
    sections: quote.content.sections.map((s) => ({
      title: s.title,
      subtotal: sectionSubtotal(s),
      items: s.items,
    })),
    blocks: quote.content.blocks,
    representative: quote.content.representative,
    representativeUrl: quote.representativeUrl,
    issueDate: quote.issueDate,
    totals,
  };
}
