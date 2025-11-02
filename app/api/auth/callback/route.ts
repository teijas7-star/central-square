import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  if (error) {
    console.error("Auth callback error:", error);
    const errorDescription = requestUrl.searchParams.get("error_description");
    const errorCode = requestUrl.searchParams.get("error_code");
    
    let errorMessage = error;
    if (errorCode === "otp_expired") {
      errorMessage = "otp_expired";
    } else if (errorDescription) {
      errorMessage = errorDescription;
    }
    
    return NextResponse.redirect(
      new URL(`/signin?error=${errorMessage}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/signin?error=no_code", req.url)
    );
  }

  const cookieStore = await cookies();
  const cookiesToSet: Array<{ name: string; value: string; options: any }> = [];
  
  // Create Supabase client for route handler
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSetParam) {
          // Capture cookies that Supabase wants to set
          cookiesToSetParam.forEach((cookie) => {
            cookiesToSet.push(cookie);
          });
        },
      },
    }
  );
  
  // Exchange code for session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Auth exchange error:", exchangeError);
    return NextResponse.redirect(
      new URL(`/signin?error=auth_failed&details=${encodeURIComponent(exchangeError.message)}`, req.url)
    );
  }

  // Get user after exchange
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Get user error:", userError);
    return NextResponse.redirect(
      new URL(`/signin?error=auth_failed&details=${encodeURIComponent(userError?.message || "No user found")}`, req.url)
    );
  }

  // Check if user has a profile
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  const redirectUrl = profile ? "/dashboard" : "/profile/create";

  // Create redirect response
  const response = NextResponse.redirect(new URL(redirectUrl, req.url));
  
  // Set all cookies that Supabase wants to set
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      ...options,
      httpOnly: options?.httpOnly ?? true,
      secure: options?.secure ?? process.env.NODE_ENV === "production",
      sameSite: options?.sameSite ?? "lax",
      path: options?.path ?? "/",
    });
  });

  return response;
}

