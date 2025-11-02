import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { ProfileUpdate } from "@/lib/validators";
import { createLogger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    logger.log({
      endpoint: "/api/profiles",
      method: "GET",
      status: 401,
      message: "Unauthorized profile access",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      logger.log({
        endpoint: "/api/profiles",
        method: "GET",
        status: 404,
        userId: user.id,
        message: "Profile not found",
      });
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    logger.log({
      endpoint: "/api/profiles",
      method: "GET",
      status: 200,
      userId: user.id,
      message: "Profile fetched",
    });

    return NextResponse.json({ profile });
  } catch (error: any) {
    logger.error("Failed to fetch profile", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    logger.log({
      endpoint: "/api/profiles",
      method: "PUT",
      status: 401,
      message: "Unauthorized profile update",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ProfileUpdate.safeParse(body);
    
    if (!parsed.success) {
      logger.log({
        endpoint: "/api/profiles",
        method: "PUT",
        status: 400,
        userId: user.id,
        message: "Validation failed",
      });
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Check handle uniqueness
    if (parsed.data.handle) {
      const existing = await prisma.profile.findUnique({
        where: { handle: parsed.data.handle },
      });
      
      if (existing && existing.id !== user.id) {
        logger.log({
          endpoint: "/api/profiles",
          method: "PUT",
          status: 400,
          userId: user.id,
          message: `Handle already taken: ${parsed.data.handle}`,
        });
        return NextResponse.json(
          { error: "Handle already taken" },
          { status: 400 }
        );
      }
    }

    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: parsed.data,
      create: {
        id: user.id,
        name: parsed.data.name,
        handle: parsed.data.handle,
        avatarUrl: parsed.data.avatarUrl ?? null,
        bio: parsed.data.bio ?? null,
        interests: parsed.data.interests ?? [],
      },
    });

    logger.log({
      endpoint: "/api/profiles",
      method: "PUT",
      status: 200,
      userId: user.id,
      message: "Profile updated",
    });

    return NextResponse.json({ profile });
  } catch (error: any) {
    logger.error("Failed to update profile", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

