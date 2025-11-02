import { NextRequest, NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import {
  getOrCreateAIHost,
  getConversationHistory,
  generateAIResponse,
  saveConversationMessage,
  extractPreferences,
  updateUserPreferences,
  matchArcadesToPreferences,
} from "@/lib/ai-host";
import { createLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Note: OpenAI API key is optional - we'll use mock responses if not set
    if (!process.env.OPENAI_API_KEY) {
      logger.log({
        endpoint: "/api/ai-host/chat",
        method: "POST",
        message: "Using mock AI responses (no OpenAI API key configured)",
      });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get or create AI Host
    const aiHost = await getOrCreateAIHost(user.id, profile.name);

    // Save user message
    await saveConversationMessage(aiHost.id, "user", message);

    // Get conversation history
    const history = await getConversationHistory(aiHost.id);
    const conversationMessages = history.map((conv) => ({
      role: conv.role as "user" | "assistant",
      content: conv.message,
    }));

    // Add current user message
    conversationMessages.push({ role: "user", content: message });

    // Generate AI response
    const aiResponse = await generateAIResponse(conversationMessages, {
      name: profile.name,
      bio: profile.bio,
      interests: profile.interests,
    });

    // Save AI response
    await saveConversationMessage(aiHost.id, "assistant", aiResponse);

    // Extract preferences if we have enough conversation
    if (conversationMessages.length >= 4) {
      try {
        const preferences = await extractPreferences(conversationMessages);
        if (preferences.interests.length > 0 || preferences.values.length > 0) {
          await updateUserPreferences(user.id, preferences);
        }
      } catch (error) {
        // Log but don't fail the request
        logger.error("Failed to extract preferences", error instanceof Error ? error : new Error(String(error)));
      }
    }

    logger.log({
      endpoint: "/api/ai-host/chat",
      method: "POST",
      status: 200,
      userId: user.id,
      message: "AI Host conversation",
    });

    return NextResponse.json({
      response: aiResponse,
      aiHostId: aiHost.id,
    });
  } catch (error: any) {
    logger.error("AI Host chat error", error);
    
    // Provide helpful error messages
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "AI service configuration error. Please check OPENAI_API_KEY." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const logger = createLogger();
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const aiHost = await getOrCreateAIHost(user.id, "User");
    const history = await getConversationHistory(aiHost.id);

    logger.log({
      endpoint: "/api/ai-host/chat",
      method: "GET",
      status: 200,
      userId: user.id,
      message: "Retrieved conversation history",
    });

    return NextResponse.json({
      aiHost: {
        id: aiHost.id,
        name: aiHost.name,
      },
      messages: history.map((conv) => ({
        id: conv.id,
        role: conv.role,
        message: conv.message,
        createdAt: conv.createdAt,
      })),
    });
  } catch (error: any) {
    logger.error("Failed to get conversation history", error);
    return NextResponse.json(
      { error: "Failed to get conversation history" },
      { status: 500 }
    );
  }
}
