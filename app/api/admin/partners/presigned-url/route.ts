import { NextResponse } from "next/server";
import { generatePresignedUploadUrl, isValidImageType, isValidFileSize } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { filename, contentType, fileSize } = await request.json();

        if (!filename || !contentType || !fileSize) {
            return NextResponse.json(
                { success: false, message: "Thiếu thông tin file." },
                { status: 400 }
            );
        }

        if (!isValidImageType(contentType)) {
            return NextResponse.json(
                { success: false, message: "Định dạng file không hợp lệ." },
                { status: 400 }
            );
        }

        if (!isValidFileSize(fileSize)) {
            return NextResponse.json(
                { success: false, message: "File quá lớn (tối đa 50MB)." },
                { status: 400 }
            );
        }

        const result = await generatePresignedUploadUrl({
            filename,
            contentType,
            fileSize,
        });

        return NextResponse.json({
            success: true,
            presignedUrl: result.presignedUrl,
            s3Key: result.s3Key,
        });
    } catch (error) {
        console.error("[api/admin/partners/presigned-url] FAILED", error);
        return NextResponse.json(
            { success: false, message: "Không thể tạo URL upload." },
            { status: 500 }
        );
    }
}
