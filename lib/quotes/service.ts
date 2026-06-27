import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { computeTotals } from "./calc";
import { formatQuoteNumber } from "./number";
import { generateToken } from "./token";
import type { NormalizedQuote } from "./validate";

function asJson(content: unknown): Prisma.InputJsonValue {
  return content as Prisma.InputJsonValue;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "P2002"
  );
}

function scalarsFrom(input: NormalizedQuote) {
  const totals = computeTotals({
    content: input.content,
    discount: input.discount,
    taxRate: input.taxRate,
  });
  return {
    recipientName: input.recipientName,
    subtotal: new Prisma.Decimal(totals.subtotal),
    discount: new Prisma.Decimal(totals.discount),
    taxRate: new Prisma.Decimal(totals.taxRate),
    taxAmount: new Prisma.Decimal(totals.taxAmount),
    total: new Prisma.Decimal(totals.total),
    issueDate: new Date(input.issueDate),
    validUntil: input.validUntil ? new Date(input.validUntil) : null,
    content: asJson(input.content),
    representativeKey: input.representativeKey,
  };
}

/**
 * Create a quote: generate scalars (server-authoritative totals), allocate the
 * atomic `seq`, then derive `quoteNumber`. Retries on token collision.
 */
export async function createQuote(input: NormalizedQuote) {
  const scalars = scalarsFrom(input);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const token = generateToken(8);
    try {
      return await prisma.$transaction(async (tx) => {
        const created = await tx.quote.create({
          data: {
            ...scalars,
            quoteNumber: "",
            token,
            status: input.status ?? "DRAFT",
          },
        });
        return tx.quote.update({
          where: { id: created.id },
          data: { quoteNumber: formatQuoteNumber(created.seq) },
        });
      });
    } catch (error) {
      if (isUniqueViolation(error) && attempt < 3) continue; // token clash, retry
      throw error;
    }
  }
  throw new Error("Không thể tạo mã token duy nhất cho báo giá.");
}

/** Overwrite a quote's content + scalars; totals are recomputed server-side. */
export async function updateQuote(id: string, input: NormalizedQuote) {
  const scalars = scalarsFrom(input);
  return prisma.quote.update({
    where: { id },
    data: {
      ...scalars,
      ...(input.status ? { status: input.status } : {}),
    },
  });
}
