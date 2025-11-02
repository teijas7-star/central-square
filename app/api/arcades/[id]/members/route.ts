import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = createLogger();
  const { id } = await params;
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || undefined;
    const filter = url.searchParams.get("filter") || "all"; // all, online, hosts, new, active

    // Build where clause
    const whereClause: any = {
      arcadeId: id,
    };

    if (search) {
      whereClause.profile = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { handle: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (filter === "hosts") {
      whereClause.role = "host";
    }

    // Get memberships with profiles
    const orderBy: any =
      filter === "new"
        ? { joinedAt: "desc" }
        : filter === "active"
        ? { joinedAt: "desc" } // Simplified for now - would need post count aggregation
        : { joinedAt: "asc" };

    const memberships = await prisma.membership.findMany({
      where: whereClause,
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarUrl: true,
            bio: true,
            _count: {
              select: {
                posts: true,
              },
            },
          },
        },
      },
      orderBy,
      take: limit,
      skip,
    });

    // Get total count
    const total = await prisma.membership.count({ where: whereClause });

    // Get member stats
    const stats = {
      total: await prisma.membership.count({ where: { arcadeId: id } }),
      hosts: await prisma.membership.count({ where: { arcadeId: id, role: "host" } }),
      newThisWeek: await prisma.membership.count({
        where: {
          arcadeId: id,
          joinedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    };

    logger.log({
      endpoint: `/api/arcades/${id}/members`,
      method: "GET",
      status: 200,
      userId: user?.id,
      message: `Fetched ${memberships.length} members`,
    });

    return NextResponse.json({
      members: memberships.map((m) => ({
        id: m.profile.id,
        name: m.profile.name,
        handle: m.profile.handle,
        avatarUrl: m.profile.avatarUrl,
        bio: m.profile.bio,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
        membershipId: m.id,
        postCount: m.profile._count.posts,
        commentCount: 0, // Would need to add comment count if comments are tracked
      })),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + memberships.length < total,
      },
      stats,
    });
  } catch (error: any) {
    logger.error("Failed to fetch members", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

