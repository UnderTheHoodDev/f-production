import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/quotes/auth-guard";
import { serializeQuote } from "@/lib/quotes/serialize";
import { createQuote } from "@/lib/quotes/service";
import { parseQuoteInput } from "@/lib/quotes/validate";

const dateOnly = (v: Date | string | null): string | null => {
  if (!v) return null;
  return typeof v === "string" ? v.slice(0, 10) : v.toISOString().slice(0, 10);
};

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const quotes = await prisma.quote.findMany({
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

    const data = quotes.map((q) => ({
      id: q.id,
      quoteNumber: q.quoteNumber,
      token: q.token,
      recipientName: q.recipientName,
      status: q.status,
      total: Number(q.total),
      issueDate: dateOnly(q.issueDate),
      customerFeedback: q.customerFeedback ?? null,
      respondedAt: q.respondedAt ? q.respondedAt.toISOString() : null,
      createdAt: q.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, quotes: data });
  } catch (error) {
    console.error("[api/admin/quotes] GET FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách báo giá." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const parsed = parseQuoteInput(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, message: parsed.error },
        { status: 400 }
      );
    }

    const quote = await createQuote(parsed.value);
    revalidatePath("/admin/quotes");

    return NextResponse.json(
      { success: true, quote: serializeQuote(quote) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/admin/quotes] POST FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể tạo báo giá." },
      { status: 500 }
    );
  }
}
