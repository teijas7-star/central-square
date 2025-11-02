import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

function randomToken(len = 32) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({length: len}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const arcade = await prisma.arcade.findUnique({ where: { id } });
  if (!arcade) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (arcade.hostId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const invite = await prisma.invite.create({
    data: {
      arcadeId: arcade.id,
      token: randomToken(),
      createdBy: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    }
  });

  return NextResponse.json({ inviteToken: invite.token });
}

