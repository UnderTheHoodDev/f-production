import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/quotes/rate-limit";
import type { QuoteContent } from "@/lib/quotes/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const ip = clientIp(request);

    if (!rateLimit(`feedback:${token}:${ip}`)) {
      return NextResponse.json(
        { success: false, message: "Bạn thao tác quá nhanh, vui lòng thử lại sau." },
        { status: 429 }
      );
    }

    const quote = await prisma.quote.findUnique({ where: { token } });
    if (!quote || quote.status === "DRAFT") {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy báo giá." },
        { status: 404 }
      );
    }

    // Expired quotes can't receive feedback.
    if (quote.validUntil) {
      const today = new Date().toISOString().slice(0, 10);
      const valid =
        (quote.validUntil instanceof Date
          ? quote.validUntil.toISOString()
          : String(quote.validUntil)
        ).slice(0, 10);
      if (valid < today) {
        return NextResponse.json(
          { success: false, message: "Báo giá đã hết hiệu lực." },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const option = typeof body.option === "string" ? body.option.trim() : "";
    const comment =
      typeof body.comment === "string" ? body.comment.trim().slice(0, 2000) : "";

    const content = quote.content as unknown as QuoteContent;
    const validOptions = content.feedback?.options ?? [];
    if (!option || !validOptions.includes(option)) {
      return NextResponse.json(
        { success: false, message: "Lựa chọn phản hồi không hợp lệ." },
        { status: 400 }
      );
    }

    await prisma.quote.update({
      where: { token },
      data: {
        customerFeedback: option,
        feedbackComment: comment || null,
        respondedAt: new Date(),
        respondentIp: ip,
        status: "RESPONDED",
      },
    });

    revalidatePath(`/q/${token}`);
    revalidatePath("/admin/quotes");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/q/[token]/feedback] FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể gửi phản hồi." },
      { status: 500 }
    );
  }
}
