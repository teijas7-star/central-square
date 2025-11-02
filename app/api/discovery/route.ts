import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const logger = createLogger();
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag") || undefined;
  const q = url.searchParams.get("q") || undefined;

  try {
    const arcades = await prisma.arcade.findMany({
      where: {
        AND: [
          tag ? { tags: { has: tag } } : {},
          q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {},
        ],
      },
      select: { 
        id: true, 
        name: true, 
        description: true, 
        tags: true, 
        visibility: true,
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
      take: 30,
    });

    logger.log({
      endpoint: "/api/discovery",
      method: "GET",
      status: 200,
      message: `Found ${arcades.length} arcades`,
    });

    return NextResponse.json({ arcades });
  } catch (error: any) {
    logger.error("Failed to fetch discovery", error);
    return NextResponse.json(
      { error: "Failed to fetch arcades" },
      { status: 500 }
    );
  }
}

