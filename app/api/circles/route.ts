import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { ArcadeCreate } from "@/lib/validators";

export async function GET() {
  const arcades = await prisma.arcade.findMany({
    select: { id: true, name: true, description: true, tags: true, visibility: true, createdAt: true },
    orderBy: { createdAt: "desc" }, take: 50
  });
  return NextResponse.json({ arcades });
}

export async function POST(req: NextRequest) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const parsed = ArcadeCreate.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const arcade = await prisma.arcade.create({
    data: { ...parsed.data, hostId: user.id }
  });

  // create host membership
  await prisma.membership.create({ data: { arcadeId: arcade.id, userId: user.id, role: "host" } });

  return NextResponse.json({ arcade }, { status: 201 });
}

