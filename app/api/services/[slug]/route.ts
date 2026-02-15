import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Tìm service trực tiếp theo slug
        const service = await prisma.service.findUnique({
            where: { slug },
        });

        if (!service) {
            return NextResponse.json({
                success: true,
                events: [],
                hasContent: false,
                message: `Service với slug "${slug}" chưa được tạo trong database`,
            });
        }

        // Lấy eventOrder (danh sách event IDs theo thứ tự)
        const eventIds = service.eventOrder || [];

        if (eventIds.length === 0) {
            return NextResponse.json({
                success: true,
                events: [],
                hasContent: false,
                message: "Service chưa có event nào được liên kết",
            });
        }

        // Xác định media type dựa trên slug
        const mediaType = slug.startsWith("chup-anh") ? "image" : "video";

        // Query các events với images hoặc videos tùy media type
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

        // Sắp xếp events theo thứ tự trong eventOrder
        const orderedEvents = eventIds
            .map((id) => events.find((e) => e.id === id))
            .filter((e): e is NonNullable<typeof e> => e !== undefined);

        // Transform data để trả về frontend
        const transformedEvents = orderedEvents
            .map((event) => ({
                id: event.id,
                title: event.title,
                client: event.client,
                place: event.place,
                products: mediaType === "video"
                    ? ("videos" in event ? (event.videos as Array<{ id: string; title: string | null; thumbnail: string | null; youtubeUrl: string | null }>) : []).map((video) => ({
                        id: video.id,
                        type: "video" as const,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        youtubeUrl: video.youtubeUrl,
                    }))
                    : ("images" in event ? (event.images as Array<{ id: string; title: string | null; s3Key: string; format: string | null }>) : []).map((image) => ({
                        id: image.id,
                        type: "image" as const,
                        title: image.title,
                        url: getPublicUrl(image.s3Key),
                        format: image.format,
                    })),
            }))
            .filter((event) => event.products.length > 0);

        const hasContent = transformedEvents.some((e) => e.products.length > 0);

        return NextResponse.json({
            success: true,
            events: transformedEvents,
            hasContent,
            mediaType,
            service: {
                id: service.id,
                name: service.name,
                slug: service.slug,
            },
        });
    } catch (error) {
        console.error("Error fetching service data:", error);
        return NextResponse.json(
            { success: false, message: "Không thể lấy dữ liệu service.", events: [], hasContent: false },
            { status: 500 }
        );
    }
}
