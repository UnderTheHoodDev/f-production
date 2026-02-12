import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json({ success: true, partners });
    } catch (error) {
        console.error("[api/admin/partners] GET FAILED", error);
        return NextResponse.json(
            { success: false, message: "Không thể lấy danh sách đối tác." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name, logoKey } = await request.json();

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { success: false, message: "Tên đối tác là bắt buộc." },
                { status: 400 }
            );
        }

        const partner = await prisma.partner.create({
            data: {
                name: name.trim(),
                logoKey: logoKey && typeof logoKey === "string" ? logoKey : null,
            },
        });

        revalidatePath("/admin/partners");

        return NextResponse.json({ success: true, partner });
    } catch (error) {
        console.error("[api/admin/partners] CREATE FAILED", error);
        return NextResponse.json(
            { success: false, message: "Không thể tạo đối tác." },
            { status: 500 }
        );
    }
}
