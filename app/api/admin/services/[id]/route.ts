import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { eventOrder } = body;

    if (!Array.isArray(eventOrder)) {
      return NextResponse.json(
        { error: "eventOrder must be an array" },
        { status: 400 }
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        eventOrder,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/services");
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

