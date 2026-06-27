import { NextResponse } from "next/server";

import { generatePresignedUploadUrl, isValidFileSize } from "@/lib/s3";
import { requireAdmin } from "@/lib/quotes/auth-guard";

// PDF rendering (@react-pdf <Image>) only supports PNG/JPEG, so restrict
// signature uploads to those formats here.
const ALLOWED = ["image/png", "image/jpeg"];

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { filename, contentType, fileSize } = await request.json();

    if (!filename || !contentType || !fileSize) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin file." },
        { status: 400 }
      );
    }
    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json(
        { success: false, message: "Chữ ký phải là ảnh PNG hoặc JPEG." },
        { status: 400 }
      );
    }
    if (!isValidFileSize(fileSize)) {
      return NextResponse.json(
        { success: false, message: "File quá lớn (tối đa 50MB)." },
        { status: 400 }
      );
    }

    const result = await generatePresignedUploadUrl({ filename, contentType, fileSize });
    return NextResponse.json({
      success: true,
      presignedUrl: result.presignedUrl,
      s3Key: result.s3Key,
    });
  } catch (error) {
    console.error("[api/admin/quotes/presigned-url] FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể tạo URL upload." },
      { status: 500 }
    );
  }
}
