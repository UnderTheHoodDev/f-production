import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate sort options
    const validSortFields = ["createdAt", "updatedAt"];
    const validSortOrders = ["asc", "desc"];

    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "desc";

    // Get total count
    const total = await prisma.image.count();

    // Get paginated images
    const rawImages = await prisma.image.findMany({
      orderBy: { [finalSortBy]: finalSortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        events: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Transform images to include computed url from s3Key
    const images = rawImages.map((image) => ({
      ...image,
      url: getPublicUrl(image.s3Key),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[api/admin/media] GET FAILED", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách ảnh." },
      { status: 500 }
    );
  }
}
