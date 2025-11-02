import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { matchArcadesToPreferences } from "@/lib/ai-host";
import { createLogger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!preferences || preferences.interests.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "Start a conversation with your AI Host to get personalized recommendations!",
      });
    }

    // Match arcades to preferences
    const matches = await matchArcadesToPreferences(user.id, {
      interests: preferences.interests,
      values: preferences.values,
      goals: preferences.goals,
      dislikes: preferences.dislikes,
    });

    // Save recommendations
    const savedRecommendations = await Promise.all(
      matches.map((match) =>
        prisma.aIRecommendation.create({
          data: {
            userId: user.id,
            arcadeId: match.arcade.id,
            reason: match.reason,
            confidence: match.confidence,
          },
        })
      )
    );

    logger.log({
      endpoint: "/api/ai-host/recommendations",
      method: "GET",
      status: 200,
      userId: user.id,
      message: `Generated ${matches.length} recommendations`,
    });

    return NextResponse.json({
      recommendations: matches.map((match, index) => ({
        id: savedRecommendations[index].id,
        arcade: {
          id: match.arcade.id,
          name: match.arcade.name,
          description: match.arcade.description,
          tags: match.arcade.tags,
          memberCount: match.arcade._count.memberships,
          postCount: match.arcade._count.posts,
        },
        reason: match.reason,
        confidence: match.confidence,
      })),
    });
  } catch (error: any) {
    logger.error("Failed to get recommendations", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { recommendationId, action } = body; // action: "click" | "join"

    if (!recommendationId || !action) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const updateData: any = {};
    if (action === "click") {
      updateData.clickedAt = new Date();
    } else if (action === "join") {
      updateData.joinedAt = new Date();
    }

    await prisma.aIRecommendation.update({
      where: { id: recommendationId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update recommendation" },
      { status: 500 }
    );
  }
}

