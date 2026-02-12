import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/s3";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const existingPartner = await prisma.partner.findUnique({ where: { id } });
        if (!existingPartner) {
            return NextResponse.json(
                { success: false, message: "Không tìm thấy đối tác." },
                { status: 404 }
            );
        }

        const updateData: Record<string, unknown> = {};

        if (body.name !== undefined) {
            if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
                return NextResponse.json(
                    { success: false, message: "Tên đối tác là bắt buộc." },
                    { status: 400 }
                );
            }
            updateData.name = body.name.trim();
        }

        if (body.logoKey !== undefined) {
            // If changing logo, delete old one from S3
            if (existingPartner.logoKey && existingPartner.logoKey !== body.logoKey) {
                try {
                    await deleteFromS3(existingPartner.logoKey);
                } catch (e) {
                    console.error("Failed to delete old logo from S3", e);
                }
            }
            updateData.logoKey = body.logoKey;
        }

        if (body.order !== undefined) {
            updateData.order = body.order;
        }

        const partner = await prisma.partner.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/partners");

        return NextResponse.json({ success: true, partner });
    } catch (error) {
        console.error("[api/admin/partners/[id]] PATCH FAILED", error);
        return NextResponse.json(
            { success: false, message: "Không thể cập nhật đối tác." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const partner = await prisma.partner.findUnique({ where: { id } });
        if (!partner) {
            return NextResponse.json(
                { success: false, message: "Không tìm thấy đối tác." },
                { status: 404 }
            );
        }

        // Delete logo from S3 if exists
        if (partner.logoKey) {
            try {
                await deleteFromS3(partner.logoKey);
            } catch (e) {
                console.error("Failed to delete logo from S3", e);
            }
        }

        await prisma.partner.delete({ where: { id } });

        revalidatePath("/admin/partners");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[api/admin/partners/[id]] DELETE FAILED", error);
        return NextResponse.json(
            { success: false, message: "Không thể xóa đối tác." },
            { status: 500 }
        );
    }
}
