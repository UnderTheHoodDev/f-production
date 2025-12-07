import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get image from database
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy ảnh." },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error("[api/admin/media] Cloudinary delete failed", cloudinaryError);
        // Continue to delete from DB even if Cloudinary delete fails
      }
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa ảnh thành công.",
    });
  } catch (error) {
    console.error("[api/admin/media] DELETE FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa ảnh." },
      { status: 500 }
    );
  }
}

