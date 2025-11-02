import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { ReportCreate } from "@/lib/validators";
import { limitOrThrow, reportRatelimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await limitOrThrow(`report:${user.id}`, reportRatelimit);

  const body = await req.json();
  const parsed = ReportCreate.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const report = await prisma.report.create({
    data: { ...parsed.data, reporterId: user.id }
  });

  return NextResponse.json({ report }, { status: 201 });
}

