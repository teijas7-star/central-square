import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { arcade: { select: { id: true, hostId: true } } }
  });
  if (!post || !post.arcadeId) return NextResponse.json({ error: "Not in an Arcade" }, { status: 400 });
  if (post.arcade?.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.post.update({ where: { id }, data: { isLantern: !post.isLantern } });
  return NextResponse.json({ post: updated });
}

