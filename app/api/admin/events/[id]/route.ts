import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        images: true,
        videos: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sự kiện." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { success: false, message: "Không thể lấy thông tin sự kiện." },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, place, client, description, startDate, endDate } = body

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Tiêu đề sự kiện là bắt buộc." },
        { status: 400 }
      )
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title.trim(),
        place: place?.trim() || null,
        client: client?.trim() || null,
        description: description?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        images: true,
        videos: true,
      },
    })

    revalidatePath("/admin/events")
    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { success: false, message: "Không thể cập nhật sự kiện." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.event.delete({
      where: { id },
    })

    revalidatePath("/admin/events")
    return NextResponse.json({ success: true, message: "Đã xóa sự kiện." })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { success: false, message: "Không thể xóa sự kiện." },
      { status: 500 }
    )
  }
}

