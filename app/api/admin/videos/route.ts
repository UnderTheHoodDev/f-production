import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json({ success: true, videos });
}

export async function POST(request: Request) {
  try {
    const { youtubeUrl, title, thumbnail } = await request.json();

    if (!youtubeUrl || typeof youtubeUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "Thiếu YouTube URL cần lưu." },
        { status: 400 }
      );
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { success: false, message: "URL YouTube không hợp lệ." },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        youtubeUrl,
        title: title && typeof title === "string" ? title : null,
        thumbnail: thumbnail && typeof thumbnail === "string" ? thumbnail : null,
        showOnLanding: true,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("[api/admin/videos] CREATE FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể lưu video vào cơ sở dữ liệu." },
      { status: 500 }
    );
  }
}

