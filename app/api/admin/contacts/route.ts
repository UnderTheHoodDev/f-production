import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
        const status = searchParams.get("status"); // NEW, CONTACTED, COMPLETED, or null for all

        const whereClause = status ? { status } : {};

        const [total, contacts] = await Promise.all([
            prisma.contact.count({ where: whereClause }),
            prisma.contact.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            contacts,
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
        console.error("Failed to fetch contacts:", error);
        return NextResponse.json(
            { success: false, message: "Không thể tải danh sách liên hệ." },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, note } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID là bắt buộc." },
                { status: 400 }
            );
        }

        const validStatuses = ["NEW", "CONTACTED", "COMPLETED"];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Status không hợp lệ." },
                { status: 400 }
            );
        }

        const updateData: { status?: string; note?: string } = {};
        if (status) updateData.status = status;
        if (note !== undefined) updateData.note = note;

        const contact = await prisma.contact.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            contact,
        });
    } catch (error) {
        console.error("Failed to update contact:", error);
        return NextResponse.json(
            { success: false, message: "Không thể cập nhật liên hệ." },
            { status: 500 }
        );
    }
}
