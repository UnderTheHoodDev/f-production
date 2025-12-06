import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        videos: true,
      },
    })
    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách sự kiện." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, place, client, description, startDate, endDate } = body

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Tiêu đề sự kiện là bắt buộc." },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
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
    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { success: false, message: "Không thể tạo sự kiện." },
      { status: 500 }
    )
  }
}

