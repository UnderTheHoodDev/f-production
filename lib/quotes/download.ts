import type { Quote } from "@/lib/generated/prisma/client";

import { renderQuotePdf } from "./pdf";
import { serializeQuote } from "./serialize";
import { buildQuoteDoc } from "./view-model";
import { renderQuoteXlsx } from "./xlsx";

const XLSX_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function quotePdfResponse(quote: Quote): Promise<Response> {
  const doc = buildQuoteDoc(serializeQuote(quote));
  const buffer = await renderQuotePdf(doc);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function quoteXlsxResponse(quote: Quote): Promise<Response> {
  const doc = buildQuoteDoc(serializeQuote(quote));
  const buffer = await renderQuoteXlsx(doc);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": XLSX_TYPE,
      "Content-Disposition": `attachment; filename="${quote.quoteNumber}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
