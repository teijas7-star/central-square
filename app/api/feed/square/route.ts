import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const tag = new URL(req.url).searchParams.get("tag") || undefined;

  const posts = await prisma.post.findMany({
    where: tag
      ? {
          OR: [
            { arcadeId: null },
            { isLantern: true, arcade: { tags: { has: tag } } },
          ],
          deletedAt: null,
        }
      : {
          OR: [{ arcadeId: null }, { isLantern: true }],
          deletedAt: null,
        },
    include: {
      arcade: { select: { id: true, name: true } },
      author: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
        },
      },
      replies: {
        where: { deletedAt: null },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return NextResponse.json({ posts });
}

