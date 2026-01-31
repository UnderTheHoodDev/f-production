import { NextRequest, NextResponse } from "next/server";
import {
    generatePresignedUploadUrl,
    isValidImageType,
    isValidFileSize,
} from "@/lib/s3";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { files } = body as {
            files: Array<{
                filename: string;
                contentType: string;
                fileSize: number;
            }>;
        };

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: "Không có file nào được chọn" },
                { status: 400 }
            );
        }

        // Validate all files
        for (const file of files) {
            if (!isValidImageType(file.contentType)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Loại file không hợp lệ: ${file.filename}. Chỉ hỗ trợ JPEG, PNG, WebP, GIF, HEIC.`,
                    },
                    { status: 400 }
                );
            }

            if (!isValidFileSize(file.fileSize)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `File quá lớn: ${file.filename}. Kích thước tối đa là 50MB.`,
                    },
                    { status: 400 }
                );
            }
        }

        // Generate presigned URLs for all files
        const presignedData = await Promise.all(
            files.map((file) => generatePresignedUploadUrl(file))
        );

        return NextResponse.json({
            success: true,
            data: presignedData,
        });
    } catch (error) {
        console.error("[api/admin/media/presigned-urls] ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Không thể tạo URL upload" },
            { status: 500 }
        );
    }
}
