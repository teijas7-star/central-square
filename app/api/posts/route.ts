import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { PostCreate } from "@/lib/validators";
import { limitOrThrow, postRatelimit } from "@/lib/rate-limit";
import { createLogger } from "@/lib/logger";

const banned = ["slur1","slur2"]; // replace with real list

export async function GET(req: NextRequest) {
  const logger = createLogger();
  const url = new URL(req.url);
  const arcadeId = url.searchParams.get("arcadeId");
  const parentId = url.searchParams.get("parentId");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      where: { 
        arcadeId: arcadeId ?? undefined, 
        parentId: parentId ?? undefined, 
        deletedAt: null 
      },
      include: {
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
          include: {
            author: {
              select: {
                id: true,
                name: true,
                handle: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        arcade: arcadeId ? undefined : {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    const total = await prisma.post.count({
      where: { 
        arcadeId: arcadeId ?? undefined, 
        parentId: parentId ?? undefined, 
        deletedAt: null 
      },
    });

    logger.log({
      endpoint: "/api/posts",
      method: "GET",
      status: 200,
      message: `Fetched ${posts.length} posts`,
    });

    return NextResponse.json({ 
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      }
    });
  } catch (error: any) {
    logger.error("Failed to fetch posts", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    logger.log({
      endpoint: "/api/posts",
      method: "POST",
      status: 401,
      message: "Unauthorized post attempt",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await limitOrThrow(`post:${user.id}`, postRatelimit);
  } catch (e: any) {
    logger.log({
      endpoint: "/api/posts",
      method: "POST",
      status: 429,
      userId: user.id,
      message: "Rate limit exceeded",
    });
    throw e;
  }

  const body = await req.json();
  const parsed = PostCreate.safeParse(body);
  if (!parsed.success) {
    logger.log({
      endpoint: "/api/posts",
      method: "POST",
      status: 400,
      userId: user.id,
      message: "Invalid request body",
    });
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const text = parsed.data.body.trim();
  if (text.length < 1 || text.length > 800) {
    logger.log({
      endpoint: "/api/posts",
      method: "POST",
      status: 400,
      userId: user.id,
      message: "Post length validation failed",
    });
    return NextResponse.json({ error: "Post must be between 1 and 800 characters" }, { status: 400 });
  }

  if (banned.some(w => text.toLowerCase().includes(w))) {
    logger.log({
      endpoint: "/api/posts",
      method: "POST",
      status: 400,
      userId: user.id,
      message: "Content rejected by filter",
    });
    return NextResponse.json({ error: "Content rejected" }, { status: 400 });
  }

  // Check membership if posting to an arcade
  if (parsed.data.arcadeId) {
    const membership = await prisma.membership.findUnique({
      where: {
        arcadeId_userId: {
          arcadeId: parsed.data.arcadeId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      logger.log({
        endpoint: "/api/posts",
        method: "POST",
        status: 403,
        userId: user.id,
        message: `User not member of arcade ${parsed.data.arcadeId}`,
      });
      return NextResponse.json({ error: "Not a member of this arcade" }, { status: 403 });
    }
  }

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      arcadeId: parsed.data.arcadeId ?? null,
      parentId: parsed.data.parentId ?? null,
      body: text
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
        },
      },
    },
  });

  logger.log({
    endpoint: "/api/posts",
    method: "POST",
    status: 201,
    userId: user.id,
    message: `Post created: ${post.id}`,
  });

  return NextResponse.json({ post }, { status: 201 });
}
