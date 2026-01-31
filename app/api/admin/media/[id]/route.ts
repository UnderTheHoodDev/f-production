import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, eventIds, showOnLanding } = body;

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

    // Update image with new title, events, and showOnLanding
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        title: title !== undefined ? (title && title.trim() ? title.trim() : null) : undefined,
        showOnLanding: showOnLanding !== undefined ? showOnLanding : undefined,
        events: eventIds
          ? {
            set: eventIds.map((eventId: string) => ({ id: eventId })),
          }
          : undefined,
      },
      include: {
        events: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    revalidatePath("/admin/media/images");
    return NextResponse.json({
      success: true,
      image: updatedImage,
      message: "Đã cập nhật ảnh thành công.",
    });
  } catch (error) {
    console.error("[api/admin/media] PATCH FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật ảnh." },
      { status: 500 }
    );
  }
}

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

    // Delete from S3
    try {
      await deleteFromS3(image.s3Key);
    } catch (s3Error) {
      console.error("[api/admin/media] S3 delete failed:", s3Error);
      // Continue to delete from DB even if S3 delete fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    revalidatePath("/admin/media/images");
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
