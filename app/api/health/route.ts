import { NextResponse } from "next/server";

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "present" : "missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnon ? "present" : "missing",
      NODE_ENV: process.env.NODE_ENV,
    },
    note: "If any are missing, check .env.local and restart dev server.",
  });
}

