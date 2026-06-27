import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { quoteXlsxResponse } from "@/lib/quotes/download";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const quote = await prisma.quote.findUnique({ where: { token } });
  if (!quote || quote.status === "DRAFT") {
    return NextResponse.json(
      { success: false, message: "Không tìm thấy báo giá." },
      { status: 404 }
    );
  }
  return quoteXlsxResponse(quote);
}
