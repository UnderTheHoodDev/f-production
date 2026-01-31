import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fileExistsInS3, getPublicUrl } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { images } = body as {
            images: Array<{
                s3Key: string;
                title: string;
                format: string;
                fileSize: number;
                width?: number;
                height?: number;
            }>;
        };

        if (!images || images.length === 0) {
            return NextResponse.json(
                { success: false, message: "Không có ảnh nào để lưu" },
                { status: 400 }
            );
        }

        // Verify all files exist in S3
        const verifications = await Promise.all(
            images.map((img) => fileExistsInS3(img.s3Key))
        );

        const missingFiles = images.filter((_, index) => !verifications[index]);
        if (missingFiles.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Không tìm thấy ${missingFiles.length} file trong S3`,
                    missingFiles: missingFiles.map((f) => f.s3Key),
                },
                { status: 400 }
            );
        }

        // Save to database using transaction
        const savedImages = await prisma.$transaction(
            images.map((image) =>
                prisma.image.create({
                    data: {
                        s3Key: image.s3Key,
                        title: image.title || null,
                        format: image.format || null,
                        fileSize: image.fileSize || null,
                        width: image.width || null,
                        height: image.height || null,
                        showOnLanding: true,
                    },
                })
            )
        );

        revalidatePath("/admin/media/images");

        return NextResponse.json({
            success: true,
            images: savedImages.map((img) => ({
                ...img,
                url: getPublicUrl(img.s3Key),
            })),
            message: `Đã lưu ${savedImages.length} ảnh thành công`,
        });
    } catch (error) {
        console.error("[api/admin/media/batch] ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Không thể lưu ảnh vào cơ sở dữ liệu" },
            { status: 500 }
        );
    }
}
