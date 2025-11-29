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
        createdAt: true,
        _count: {
          select: {
            memberships: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ arcades: hostedArcades });
  } catch (error: any) {
    console.error("Failed to fetch hosted arcades", error);
    return NextResponse.json(
      { error: "Failed to fetch arcades" },
      { status: 500 }
    );
  }
}



