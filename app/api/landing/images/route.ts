import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

// Slugs chứa "chup-anh" → trả về images, còn lại → trả về videos
function getMediaType(slug: string): "image" | "video" {
  if (slug.startsWith("chup-anh")) return "image";
  return "video";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get("serviceSlug");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    if (!serviceSlug) {
      return NextResponse.json(
        { success: false, message: "Cần cung cấp serviceSlug" },
        { status: 400 }
      );
    }

    // 1. Tìm service theo slug
    const service = await prisma.service.findUnique({
      where: { slug: serviceSlug },
    });

    if (!service) {
      return NextResponse.json({
        success: true,
        products: [],
        mediaType: "image",
        pagination: { page, limit, total: 0, hasMore: false },
        message: `Không tìm thấy service với slug "${serviceSlug}"`,
      });
    }

    // 2. Xác định media type dựa trên slug
    const mediaType = getMediaType(serviceSlug);

    // 3. Lấy eventOrder (danh sách event IDs theo thứ tự)
    const eventIds = service.eventOrder || [];

    if (eventIds.length === 0) {
      return NextResponse.json({
        success: true,
        products: [],
        mediaType,
        pagination: { page, limit, total: 0, hasMore: false },
        message: "Service chưa có event nào được liên kết",
      });
    }

    // 4. Query các events với images hoặc videos tùy media type
    const events = await prisma.event.findMany({
      where: {
        id: { in: eventIds },
      },
      include: {
        ...(mediaType === "image"
          ? {
            images: {
              where: { showOnLanding: true },
              orderBy: { createdAt: "desc" as const },
            },
          }
          : {
            videos: {
              where: { showOnLanding: true },
              orderBy: { createdAt: "desc" as const },
            },
          }),
      },
    });

    // 5. Sắp xếp events theo thứ tự trong eventOrder
    const orderedEvents = eventIds
      .map((id) => events.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined);

    // 6. Flatten products với thông tin event
    let allProducts: Array<Record<string, unknown>> = [];

    if (mediaType === "image") {
      allProducts = orderedEvents.flatMap((event) =>
        ("images" in event ? event.images as Array<{ id: string; title: string | null; format: string | null; s3Key: string; createdAt: Date; updatedAt: Date }> : []).map((image) => ({
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
    } else {
      allProducts = orderedEvents.flatMap((event) =>
        ("videos" in event ? event.videos as Array<{ id: string; title: string | null; youtubeUrl: string | null; thumbnail: string | null; createdAt: Date; updatedAt: Date }> : []).map((video) => ({
          id: video.id,
          title: video.title,
          youtubeUrl: video.youtubeUrl,
          thumbnail: video.thumbnail,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          type: "video" as const,
          event: {
            id: event.id,
            title: event.title,
            client: event.client,
          },
        }))
      );
    }

    // 7. Pagination
    const total = allProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      mediaType,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
      service: {
        id: service.id,
        name: service.name,
        slug: service.slug,
      },
    });
  } catch (error) {
    console.error("Error fetching landing products:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách sản phẩm." },
      { status: 500 }
    );
  }
}
