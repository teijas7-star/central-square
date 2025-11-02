import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: arcadeId, userId } = await params;

  const arcade = await prisma.arcade.findUnique({
    where: { id: arcadeId },
  });

  if (!arcade) {
    return NextResponse.json({ error: "Arcade not found" }, { status: 404 });
  }

  if (arcade.hostId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.membership.delete({
    where: {
      arcadeId_userId: {
        arcadeId,
        userId,
      },
    },
  });

  return NextResponse.json({ success: true });
}

