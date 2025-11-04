import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, check their profile for city
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (profile) {
      // Check if profile has city property (type-safe check)
      const profileWithCity = profile as typeof profile & { city?: string | null };
      
      if (profileWithCity.city) {
        // Redirect to user's city feed with 301 permanent redirect
        return NextResponse.redirect(
          new URL(`/${profileWithCity.city.toLowerCase()}/feed`, req.url),
          { status: 301 }
        );
      }
    }
  }

  // If no city set or not authenticated, redirect to home (city chooser) with 301
  return NextResponse.redirect(new URL("/", req.url), { status: 301 });
}
