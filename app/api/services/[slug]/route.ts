import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

// Mapping từ slug (URL) sang service name (database)
const SLUG_SERVICE_MAP: Record<string, string> = {
    "chup-anh-su-kien": "Chụp Ảnh Sự Kiện",
    "quay-phim-su-kien": "Quay Phim Sự Kiện",
    "livestream-su-kien": "Livestream Sự Kiện",
    "tvc-phim-doanh-nghiep": "TVC - Phim Doanh Nghiệp",
    "chup-anh-profile": "Chụp Ảnh Profile Chuyên Nghiệp",
    "team-building": "Quay Phim, Chụp Ảnh Team Building",
    "quay-phim-podcast": "Quay Phim Podcast",
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Chuyển đổi slug sang service name
        const serviceName = SLUG_SERVICE_MAP[slug];

        if (!serviceName) {
            return NextResponse.json({
                success: false,
                message: `Không tìm thấy service với slug "${slug}"`,
                events: [],
                hasContent: false,
            });
        }

        // Tìm service theo name
        const service = await prisma.service.findFirst({
            where: {
                name: {
                    equals: serviceName,
                    mode: "insensitive",
                },
            },
        });

        if (!service) {
            return NextResponse.json({
                success: true,
                events: [],
                hasContent: false,
                message: `Service "${serviceName}" chưa được tạo trong database`,
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

        // Query các events với images và videos
        const events = await prisma.event.findMany({
            where: {
                id: { in: eventIds },
            },
            include: {
                images: {
                    where: { showOnLanding: true },
                    orderBy: { createdAt: "desc" },
                },
                videos: {
                    where: { showOnLanding: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        // Sắp xếp events theo thứ tự trong eventOrder
        const orderedEvents = eventIds
            .map((id) => events.find((e) => e.id === id))
            .filter((e): e is NonNullable<typeof e> => e !== undefined);

        // Transform data để trả về frontend
        const transformedEvents = orderedEvents
            .filter((event) => event.images.length > 0 || event.videos.length > 0)
            .map((event) => ({
                id: event.id,
                title: event.title,
                client: event.client,
                place: event.place,
                products: [
                    // Videos trước (nếu có)
                    ...event.videos.map((video) => ({
                        id: video.id,
                        type: "video" as const,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        youtubeUrl: video.youtubeUrl,
                    })),
                    // Rồi đến Images
                    ...event.images.map((image) => ({
                        id: image.id,
                        type: "image" as const,
                        title: image.title,
                        url: getPublicUrl(image.s3Key),
                        format: image.format,
                    })),
                ],
            }));

        const hasContent = transformedEvents.some((e) => e.products.length > 0);

        return NextResponse.json({
            success: true,
            events: transformedEvents,
            hasContent,
            service: {
                id: service.id,
                name: service.name,
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
