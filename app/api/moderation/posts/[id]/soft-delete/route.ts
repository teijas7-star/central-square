import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { arcade: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Host of the Arcade (or author if Square) can soft-delete
  const isHost = post.arcade ? post.arcade.hostId === user.id : post.authorId === user.id;
  if (!isHost) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ post: updated });
}

