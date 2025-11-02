import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { InviteJoin } from "@/lib/validators";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const arcade = await prisma.arcade.findUnique({ where: { id } });
  if (!arcade) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check if already a member
  const existing = await prisma.membership.findUnique({
    where: {
      arcadeId_userId: {
        arcadeId: id,
        userId: user.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ joined: true, alreadyMember: true });
  }

  // Handle open arcades (no token needed)
  if (arcade.visibility === "open") {
    await prisma.membership.create({
      data: { arcadeId: id, userId: user.id, role: "member" },
    });
    return NextResponse.json({ joined: true });
  }

  // Handle invite-only arcades (token required)
  const body = await req.json();
  const parsed = InviteJoin.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const invite = await prisma.invite.findUnique({ where: { token: parsed.data.token } });
  if (!invite || invite.arcadeId !== id) return NextResponse.json({ error: "Invalid invite" }, { status: 400 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "Invite expired" }, { status: 400 });

  await prisma.membership.create({
    data: { arcadeId: id, userId: user.id, role: "member" },
  });

  await prisma.invite.update({ where: { token: invite.token }, data: { usedBy: user.id } });

  return NextResponse.json({ joined: true });
}

