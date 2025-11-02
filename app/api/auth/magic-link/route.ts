import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { magicLinkSchema } from "@/lib/validators";
import { emailRateLimit, limitOrThrow } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = magicLinkSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  try {
    // Rate limit: 1 per 60 seconds per email (only if Redis is configured)
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      await limitOrThrow(`magic-link:${email}`, emailRateLimit);
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Rate limit exceeded. Please try again later." },
      { status: e.status || 429 }
    );
  }

  const supabase = await sbServer();
  
  // Get the base URL for redirect
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.NEXT_PUBLIC_SITE_URL || 
                  req.headers.get("origin") || 
                  "http://localhost:3000";

  const redirectUrl = `${baseUrl}/api/auth/callback`;
  
  console.log("Sending magic link to:", email);
  console.log("Redirect URL:", redirectUrl);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || "Failed to send magic link" },
      { status: 500 }
    );
  }

  console.log("Magic link sent successfully:", data);
  return NextResponse.json({ message: "Magic link sent to email" });
}

