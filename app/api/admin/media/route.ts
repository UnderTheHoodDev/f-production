import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json({ success: true, images });
}

export async function POST(request: Request) {
  try {
    const { url, publicId, title, format } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "Thiếu URL ảnh cần lưu." },
        { status: 400 }
      );
    }

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { success: false, message: "Thiếu publicId ảnh cần lưu." },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        url,
        publicId,
        title: title && typeof title === "string" ? title : null,
        format: format && typeof format === "string" ? format : null,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("[api/admin/media] CREATE FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu ảnh vào cơ sở dữ liệu." },
      { status: 500 }
    );
  }
}

