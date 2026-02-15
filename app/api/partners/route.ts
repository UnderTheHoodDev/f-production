import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/s3";

export async function GET() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { order: "asc" },
        });

        const partnersWithUrls = partners.map((p) => ({
            id: p.id,
            name: p.name,
            logoUrl: p.logoKey ? getPublicUrl(p.logoKey) : undefined,
        }));

        return NextResponse.json({
            success: true,
            partners: partnersWithUrls,
        });
    } catch (error) {
        console.error("Error fetching partners:", error);
        return NextResponse.json(
            { success: false, partners: [] },
            { status: 500 }
        );
    }
}
