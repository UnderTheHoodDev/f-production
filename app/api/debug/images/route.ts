import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("[api/debug/images] Failed to load images", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách ảnh." },
      { status: 500 }
    );
  }
}

