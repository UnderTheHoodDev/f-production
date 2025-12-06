import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services, events });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

