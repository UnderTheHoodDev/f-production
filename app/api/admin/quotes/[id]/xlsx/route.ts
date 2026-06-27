import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/quotes/auth-guard";
import { quoteXlsxResponse } from "@/lib/quotes/download";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy báo giá." },
      { status: 404 }
    );
  }
  return quoteXlsxResponse(quote);
}
