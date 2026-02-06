import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { magicLinkSchema } from "@/lib/validators";
import { emailRateLimit, limitOrThrow } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = magicLinkSchema.safeParse(body);
    
    if (!parsed.success) {
      console.error("Invalid email format:", parsed.error);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Rate limit: 1 per 60 seconds per email (only if Redis is configured)
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      try {
        await limitOrThrow(`magic-link:${email}`, emailRateLimit);
      } catch (e: any) {
        // Check if this is a rate limit error vs a connection error
        if (e.message?.includes("Rate limit exceeded")) {
          console.error("Rate limit exceeded:", e.message);
          return NextResponse.json(
            { error: e.message },
            { status: 429 }
          );
        }
        // Redis connection failed - log and continue without rate limiting
        console.warn("Redis unavailable, skipping rate limit:", e.message);
      }
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
      const errorInfo = {
        message: error.message || "Unknown error",
        status: error.status || "No status",
        name: error.name || "Unknown",
        toString: String(error)
      };
      console.error("Magic link error:", errorInfo);
      console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      return NextResponse.json(
        { 
          error: error.message || "Failed to send magic link", 
          details: error.status || "Unknown error",
          errorType: error.name || "Unknown"
        },
        { status: 500 }
      );
    }

    console.log("Magic link sent successfully:", data);
    return NextResponse.json({ message: "Magic link sent to email" });
  } catch (err: any) {
    console.error("Unexpected error in magic-link route:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      fullError: err
    });
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

