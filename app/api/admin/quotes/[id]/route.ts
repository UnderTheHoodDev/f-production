import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";
import { requireAdmin } from "@/lib/quotes/auth-guard";
import { serializeQuote } from "@/lib/quotes/serialize";
import { updateQuote } from "@/lib/quotes/service";
import { parseQuoteInput } from "@/lib/quotes/validate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy báo giá." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, quote: serializeQuote(quote) });
  } catch (error) {
    console.error("[api/admin/quotes/[id]] GET FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy báo giá." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const existing = await prisma.quote.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy báo giá." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = parseQuoteInput(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, message: parsed.error },
        { status: 400 }
      );
    }

    // If the representative signature changed, clean up the old S3 object.
    const newKey = parsed.value.representativeKey;
    if (existing.representativeKey && existing.representativeKey !== newKey) {
      try {
        await deleteFromS3(existing.representativeKey);
      } catch (e) {
        console.error("Failed to delete old signature from S3", e);
      }
    }

    const quote = await updateQuote(id, parsed.value);
    revalidatePath("/admin/quotes");
    revalidatePath(`/q/${quote.token}`);

    return NextResponse.json({ success: true, quote: serializeQuote(quote) });
  } catch (error) {
    console.error("[api/admin/quotes/[id]] PUT FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật báo giá." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy báo giá." },
        { status: 404 }
      );
    }

    if (quote.representativeKey) {
      try {
        await deleteFromS3(quote.representativeKey);
      } catch (e) {
        console.error("Failed to delete signature from S3", e);
      }
    }

    await prisma.quote.delete({ where: { id } });
    revalidatePath("/admin/quotes");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/quotes/[id]] DELETE FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa báo giá." },
      { status: 500 }
    );
  }
}
