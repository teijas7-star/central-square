import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

// Lazy initialization - only create client when API key is available
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PreferenceExtraction {
  interests: string[];
  values: string[];
  goals: string[];
  dislikes: string[];
}

/**
 * Get or create AI Host for a user
 */
export async function getOrCreateAIHost(userId: string, userName: string) {
  let aiHost = await prisma.aIHost.findUnique({
    where: { userId },
  });

  if (!aiHost) {
    aiHost = await prisma.aIHost.create({
      data: {
        userId,
        name: `${userName}'s AI Host`,
      },
    });
  }

  return aiHost;
}

/**
 * Get conversation history for AI Host
 */
export async function getConversationHistory(aiHostId: string, limit = 20) {
  const conversations = await prisma.aIConversation.findMany({
    where: { aiHostId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return conversations.reverse(); // Return in chronological order
}

/**
 * Generate mock AI response for testing (when OpenAI API key not available)
 */
function generateMockAIResponse(
  messages: ConversationMessage[],
  userProfile?: { name: string; bio?: string | null; interests: string[] }
): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
  const messageCount = messages.length;

  // First message - greeting
  if (messageCount === 1) {
    return `Hello! I'm your AI Host, and I'm here to help you discover communities on Central Square. ${userProfile ? `Nice to meet you, ${userProfile.name}! ` : ""}What are you interested in? What topics or communities would you like to explore?`;
  }

  // Detect interests from user messages
  const interests = [
    ...(userProfile?.interests || []),
    ...messages.filter(m => m.role === "user").map(m => m.content.toLowerCase())
  ].join(" ").toLowerCase();

  if (interests.includes("ai") || interests.includes("artificial intelligence")) {
    return "That's great! AI is such an exciting field. Are you more interested in AI ethics, AI development, or AI applications? I can help you find Arcades that match your specific interests.";
  }

  if (interests.includes("climate") || interests.includes("environment")) {
    return "Climate and environment are really important topics! Are you looking for communities focused on climate action, sustainability, or environmental research?";
  }

  if (interests.includes("education") || interests.includes("learning")) {
    return "Education is wonderful! Are you interested in educational technology, teaching methods, or learning communities?";
  }

  // Generic responses based on message count
  if (messageCount <= 3) {
    return "That sounds interesting! Can you tell me more about what you're looking for? What kind of communities or topics excite you?";
  }

  if (messageCount <= 5) {
    return "Thanks for sharing! Based on what you've told me, I'm learning about your interests. What values are important to you in a community?";
  }

  // After enough messages, suggest checking recommendations
  return "I've learned a lot about your interests! Why don't you check out your personalized recommendations? I've found some Arcades that might be a great fit for you. Click 'View Recommendations' to see them!";
}

/**
 * Generate AI response using OpenAI (or mock if no API key)
 */
export async function generateAIResponse(
  messages: ConversationMessage[],
  userProfile?: { name: string; bio?: string | null; interests: string[] }
): Promise<string> {
  // If no API key, use mock responses for testing
  if (!process.env.OPENAI_API_KEY) {
    console.log("⚠️  OpenAI API key not set - using mock responses for testing");
    return generateMockAIResponse(messages, userProfile);
  }

  const systemPrompt = `You are an AI Host helping users discover communities on Central Square, a platform that connects people in meaningful ways.

Your role:
- Have friendly, natural conversations with users
- Ask thoughtful questions about their interests, values, and goals
- Help them discover Arcades (organizational communities) that match their interests
- Be helpful, transparent, and respectful
- Focus on helping users find communities that will be a net positive for them

Guidelines:
- Keep responses concise and conversational
- Ask one question at a time
- Show genuine interest in helping users find the right communities
- If the user provides information about their interests, acknowledge it warmly
- Never make recommendations until you've learned enough about the user

${userProfile ? `User context: ${userProfile.name}${userProfile.bio ? ` - ${userProfile.bio}` : ""}${userProfile.interests.length > 0 ? ` - Interests: ${userProfile.interests.join(", ")}` : ""}` : ""}

Start by greeting the user warmly and asking what they're looking for or what interests them.`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return generateMockAIResponse(messages, userProfile);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for cost efficiency in MVP
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "I'm here to help you discover communities!";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    // Fallback to mock if API fails
    console.log("⚠️  Falling back to mock responses");
    return generateMockAIResponse(messages, userProfile);
  }
}

/**
 * Extract preferences from conversation using simple pattern matching (mock mode)
 */
function extractMockPreferences(
  conversationHistory: ConversationMessage[]
): PreferenceExtraction {
  const allText = conversationHistory
    .filter(m => m.role === "user")
    .map(m => m.content.toLowerCase())
    .join(" ");

  const interests: string[] = [];
  const values: string[] = [];
  const goals: string[] = [];
  const dislikes: string[] = [];

  // Simple keyword extraction
  const keywords: Record<string, string[]> = {
    "ai": ["artificial intelligence", "machine learning", "ai ethics"],
    "climate": ["climate change", "environment", "sustainability"],
    "education": ["education", "learning", "teaching"],
    "tech": ["technology", "software", "programming"],
    "health": ["health", "wellness", "medical"],
  };

  for (const [key, terms] of Object.entries(keywords)) {
    if (terms.some(term => allText.includes(term))) {
      interests.push(key);
    }
  }

  // Extract common interests
  if (allText.includes("interested in")) {
    const match = allText.match(/interested in ([^.]+)/);
    if (match) {
      const items = match[1].split(/[,\s]+and\s+/).map(s => s.trim());
      interests.push(...items.filter(i => i.length > 2));
    }
  }

  return {
    interests: [...new Set(interests)].slice(0, 5),
    values: [],
    goals: [],
    dislikes: [],
  };
}

/**
 * Extract preferences from conversation using AI (or mock if no API key)
 */
export async function extractPreferences(
  conversationHistory: ConversationMessage[]
): Promise<PreferenceExtraction> {
  // If no API key, use mock extraction
  if (!process.env.OPENAI_API_KEY) {
    console.log("⚠️  Using mock preference extraction");
    return extractMockPreferences(conversationHistory);
  }

  const extractionPrompt = `Analyze the following conversation and extract structured preferences.

Return ONLY a JSON object with this exact structure:
{
  "interests": ["interest1", "interest2"],
  "values": ["value1", "value2"],
  "goals": ["goal1", "goal2"],
  "dislikes": ["dislike1"]
}

Conversation:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Extract preferences from what the user has shared. Be specific but concise.`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return extractMockPreferences(conversationHistory);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a preference extraction system. Return only valid JSON.",
        },
        { role: "user", content: extractionPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const extracted = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    return {
      interests: extracted.interests || [],
      values: extracted.values || [],
      goals: extracted.goals || [],
      dislikes: extracted.dislikes || [],
    };
  } catch (error: any) {
    console.error("Preference extraction error:", error);
    // Fallback to mock extraction
    return extractMockPreferences(conversationHistory);
  }
}

/**
 * Match user preferences to Arcades
 */
export async function matchArcadesToPreferences(
  userId: string,
  preferences: PreferenceExtraction
): Promise<Array<{ arcade: any; reason: string; confidence: number }>> {
  // Get all open arcades
  const arcades = await prisma.arcade.findMany({
    where: { visibility: "open" },
    include: {
      _count: {
        select: {
          memberships: true,
          posts: true,
        },
      },
    },
  });

  // Simple matching algorithm: check tag overlap
  const matches = arcades
    .map((arcade) => {
      const tagMatches = arcade.tags.filter((tag) =>
        preferences.interests.some((interest) =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
        )
      );

      const descriptionMatch = preferences.interests.some((interest) =>
        (arcade.description || "")
          .toLowerCase()
          .includes(interest.toLowerCase())
      );

      const score = tagMatches.length * 0.7 + (descriptionMatch ? 0.3 : 0);
      const confidence = Math.min(score / 3, 1); // Normalize to 0-1

      return {
        arcade,
        reason: tagMatches.length > 0
          ? `Matches your interests in ${tagMatches.join(", ")}`
          : descriptionMatch
          ? `Related to your interests`
          : "Based on your profile",
        confidence,
      };
    })
    .filter((match) => match.confidence > 0.1) // Only return matches with >10% confidence
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5); // Top 5 matches

  return matches;
}

/**
 * Save conversation message
 */
export async function saveConversationMessage(
  aiHostId: string,
  role: "user" | "assistant",
  message: string,
  context?: any
) {
  return prisma.aIConversation.create({
    data: {
      aiHostId,
      role,
      message,
      context: context || null,
    },
  });
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: PreferenceExtraction
) {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: {
      interests: preferences.interests,
      values: preferences.values,
      goals: preferences.goals,
      dislikes: preferences.dislikes,
      learnedAt: new Date(),
    },
    create: {
      userId,
      interests: preferences.interests,
      values: preferences.values,
      goals: preferences.goals,
      dislikes: preferences.dislikes,
    },
  });
}

