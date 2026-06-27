import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Fired client-side (navigator.sendBeacon) after the public page mounts.
// Only promotes SENT -> VIEWED; never downgrades RESPONDED, never touches DRAFT.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const result = await prisma.quote.updateMany({
      where: { token, status: "SENT" },
      data: { status: "VIEWED", viewedAt: new Date() },
    });
    return NextResponse.json({ success: true, updated: result.count });
  } catch (error) {
    console.error("[api/q/[token]/view] FAILED", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
