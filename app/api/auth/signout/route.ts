import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = await sbServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/", req.url));
}

