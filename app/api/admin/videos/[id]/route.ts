import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, eventIds, showOnLanding } = body;

    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy video." },
        { status: 404 }
      );
    }

    // Update video with new title, events, and showOnLanding
    const updatedVideo = await prisma.video.update({
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

    revalidatePath("/admin/media/videos");
    return NextResponse.json({
      success: true,
      video: updatedVideo,
      message: "Đã cập nhật video thành công.",
    });
  } catch (error) {
    console.error("[api/admin/videos] PATCH FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật video." },
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

    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy video." },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.video.delete({
      where: { id },
    });

    revalidatePath("/admin/media/videos");
    return NextResponse.json({
      success: true,
      message: "Đã xóa video thành công.",
    });
  } catch (error) {
    console.error("[api/admin/videos] DELETE FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể xóa video." },
      { status: 500 }
    );
  }
}

