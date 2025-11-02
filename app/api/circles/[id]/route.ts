import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const logger = createLogger();
  const { id } = await params;
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  try {
    const arcade = await prisma.arcade.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            handle: true,
          },
        },
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    if (!arcade) {
      logger.log({
        endpoint: `/api/arcades/${id}`,
        method: "GET",
        status: 404,
        message: "Arcade not found",
      });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isMember = user
      ? await prisma.membership.findUnique({
          where: {
            arcadeId_userId: {
              arcadeId: id,
              userId: user.id,
            },
          },
        })
      : null;

    const isHost = user && arcade.hostId === user.id;
    const canJoin = !isMember && arcade.visibility === "open";

    logger.log({
      endpoint: `/api/arcades/${id}`,
      method: "GET",
      status: 200,
      userId: user?.id,
      message: `Arcade fetched: ${id}`,
    });

    return NextResponse.json({ arcade, isMember: !!isMember, isHost: !!isHost, canJoin });
  } catch (error: any) {
    logger.error("Failed to fetch arcade", error);
    return NextResponse.json(
      { error: "Failed to fetch arcade" },
      { status: 500 }
    );
  }
}

