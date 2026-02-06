import { NextResponse } from "next/server";

export async function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "present" : "missing",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: hasKey ? "present" : "missing",
      NODE_ENV: process.env.NODE_ENV,
    },
    note: "If any are missing, check .env.local and restart dev server.",
  });
}

