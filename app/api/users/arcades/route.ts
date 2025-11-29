import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get arcades user hosts
    const hostedArcades = await prisma.arcade.findMany({
      where: { hostId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        tags: true,
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
    });

    // Get arcades user is a member of (but not host)
    const memberships = await prisma.membership.findMany({
      where: {
        userId: user.id,
        role: { not: "host" },
      },
      include: {
        arcade: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
            _count: {
              select: {
                memberships: true,
                posts: true,
              },
            },
          },
        },
      },
    });

    // Combine and format arcades
    const arcades = [
      ...hostedArcades.map((arcade) => ({
        id: arcade.id,
        name: arcade.name,
        description: arcade.description,
        tags: arcade.tags,
        isHost: true,
        memberCount: arcade._count.memberships,
        postCount: arcade._count.posts,
      })),
      ...memberships.map((membership) => ({
        id: membership.arcade.id,
        name: membership.arcade.name,
        description: membership.arcade.description,
        tags: membership.arcade.tags,
        isHost: false,
        memberCount: membership.arcade._count.memberships,
        postCount: membership.arcade._count.posts,
      })),
    ];

    return NextResponse.json({ arcades });
  } catch (error: any) {
    console.error("Failed to fetch user arcades", error);
    return NextResponse.json(
      { error: "Failed to fetch arcades" },
      { status: 500 }
    );
  }
}



