import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

// Mapping từ filter type (frontend) sang service name (database)
// Có thể mở rộng sau này
const FILTER_SERVICE_MAP: Record<string, string> = {
  "ẢNH EVENT": "Chụp Ảnh Sự Kiện",
  // Thêm các mapping khác sau
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get("filterType"); // Filter type từ frontend
    const serviceName = searchParams.get("serviceName"); // Hoặc trực tiếp service name
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Ưu tiên serviceName nếu có, không thì map từ filterType
    const targetServiceName = serviceName || (filterType ? FILTER_SERVICE_MAP[filterType] : null);

    if (!targetServiceName) {
      return NextResponse.json(
        {
          success: false,
          message: "Cần cung cấp filterType hoặc serviceName",
          availableFilters: Object.keys(FILTER_SERVICE_MAP)
        },
        { status: 400 }
      );
    }

    // 1. Tìm service theo name (case-insensitive)
    const service = await prisma.service.findFirst({
      where: {
        name: {
          equals: targetServiceName,
          mode: "insensitive",
        },
      },
    });

    if (!service) {
      return NextResponse.json({
        success: true,
        images: [],
        pagination: { page, limit, total: 0, hasMore: false },
        message: `Không tìm thấy service "${targetServiceName}"`,
      });
    }

    // 2. Lấy eventOrder (danh sách event IDs theo thứ tự)
    const eventIds = service.eventOrder || [];

    if (eventIds.length === 0) {
      return NextResponse.json({
        success: true,
        images: [],
        pagination: { page, limit, total: 0, hasMore: false },
        message: "Service chưa có event nào được liên kết",
      });
    }

    // 3. Query các events với images (chỉ lấy showOnLanding = true)
    const events = await prisma.event.findMany({
      where: {
        id: { in: eventIds },
      },
      include: {
        images: {
          where: { showOnLanding: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // 4. Sắp xếp events theo thứ tự trong eventOrder
    const orderedEvents = eventIds
      .map((id) => events.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined);

    // 5. Flatten images với thông tin event
    const allImages = orderedEvents.flatMap((event) =>
      event.images.map((image) => ({
        id: image.id,
        title: image.title,
        format: image.format,
        url: getPublicUrl(image.s3Key),
        s3Key: image.s3Key,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
        type: "image" as const,
        event: {
          id: event.id,
          title: event.title,
          client: event.client,
        },
      }))
    );

    // 6. Pagination
    const total = allImages.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = allImages.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return NextResponse.json({
      success: true,
      images: paginatedImages,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
      service: {
        id: service.id,
        name: service.name,
      },
    });
  } catch (error) {
    console.error("Error fetching landing images:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách ảnh." },
      { status: 500 }
    );
  }
}
