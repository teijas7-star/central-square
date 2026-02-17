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
        name: "Ellie",
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
  const allUserMessages = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase()).join(" ");

  // First message - greeting
  if (messageCount === 1) {
    const greetings = [
      `👋 Hello! I'm Ellie, and I'm here to help you discover communities on Central Square. ${userProfile ? `Nice to meet you, ${userProfile.name}! ` : ""}What are you interested in? What topics or communities would you like to explore?`,
      `Hey there! ${userProfile ? `${userProfile.name}, I'm Ellie! ` : "I'm Ellie! "}I'm here to help you find amazing communities that match your interests. What brings you to Central Square today?`,
      `Welcome! ${userProfile ? `${userProfile.name}, ` : ""}I'm Ellie and I'd love to help you discover communities. What are you passionate about?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Detect interests from user messages
  const interests = [
    ...(userProfile?.interests || []),
    ...messages.filter(m => m.role === "user").map(m => m.content.toLowerCase())
  ].join(" ").toLowerCase();

  // Sustainability/Climate responses
  if (lastMessage.includes("sustainability") || lastMessage.includes("climate") || lastMessage.includes("environment") || lastMessage.includes("green")) {
    const responses = [
      "Great choice! Sustainability is such an important topic. I found several sustainability groups in your area:\n\n**Green City Collective** - Local urban gardening and clean energy advocacy (📍 2.3 miles away)\n\n**Climate Action Network** - Community organizing for climate policy (📍 1.8 miles away)\n\nWould you like me to show you upcoming events from these groups?",
      "That's wonderful! Climate action communities are really active right now. Are you more interested in local community gardens, policy advocacy, or clean energy initiatives?",
      "Excellent! I can help you find sustainability-focused Arcades. What aspect interests you most - urban gardening, renewable energy, or climate policy?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // AI/Tech responses
  if (lastMessage.includes("ai") || lastMessage.includes("artificial intelligence") || lastMessage.includes("tech") || lastMessage.includes("technology")) {
    const responses = [
      "That's exciting! AI and tech communities are thriving on Central Square. Are you interested in AI ethics, development, or practical applications? I can help you find Arcades that match.",
      "Tech communities are great! What specific area draws you in - AI ethics, software development, or emerging technologies?",
      "Awesome! There are some fascinating tech and AI Arcades. Are you looking for communities focused on ethical AI, building projects, or discussing the future of technology?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Local/Arcades responses
  if (lastMessage.includes("local") || lastMessage.includes("find") || lastMessage.includes("arcade") || lastMessage.includes("community")) {
    const responses = [
      "I'd be happy to help you find local Arcades! What city or area are you in? Or are you looking for communities around a specific topic?",
      "Local communities are where great things happen! What topics interest you? I can help you find Arcades in your area.",
      "Finding the right Arcade is important! Are you looking for something in your city, or are you open to global communities too?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // People/Connections responses
  if (lastMessage.includes("people") || lastMessage.includes("connect") || lastMessage.includes("meet") || lastMessage.includes("network")) {
    const responses = [
      "Connecting with like-minded people is one of the best parts of Central Square! What kind of people are you hoping to meet? What shared interests or values matter to you?",
      "I love helping people connect! What brings you here - are you looking for collaborators, mentors, or just interesting conversations?",
      "Meeting new people is exciting! What topics or activities would help you find the right connections?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Education responses
  if (lastMessage.includes("education") || lastMessage.includes("learn") || lastMessage.includes("teach") || lastMessage.includes("school")) {
    const responses = [
      "Education communities are wonderful! Are you interested in educational technology, teaching methods, or learning communities?",
      "Learning never stops! What aspect of education excites you - ed tech, pedagogy, or lifelong learning?",
      "Education is such a powerful topic! Are you looking for communities focused on K-12, higher ed, or adult learning?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generic responses based on message count and context
  if (messageCount === 2) {
    const responses = [
      "That sounds interesting! Can you tell me more about what you're looking for? What kind of communities or topics excite you?",
      "I'd love to learn more! What drew you to explore communities on Central Square?",
      "Tell me more! What are you hoping to find or contribute to in a community?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (messageCount === 3) {
    const responses = [
      "Thanks for sharing! I'm starting to understand your interests better. What values are important to you in a community?",
      "This is helpful! What kind of activities or discussions would you want to see in an Arcade?",
      "Great! Based on what you've shared, I'm learning about your interests. Are you looking for something local or global?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (messageCount === 4) {
    const responses = [
      "Perfect! I'm getting a good sense of what you're looking for. Are you ready to explore some Arcades that might be a great fit?",
      "Wonderful! I've learned enough to start making some recommendations. Want to see what I've found?",
      "Excellent! I think I have enough information to suggest some communities. Check out your recommendations!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // After enough messages, suggest checking recommendations
  const closingResponses = [
    "I've learned a lot about your interests! Why don't you check out your personalized recommendations? I've found some Arcades that might be a great fit for you. Click 'View Recommendations' to see them!",
    "Based on our conversation, I have some exciting Arcades to show you! Check out your recommendations - I think you'll find some communities that really match what you're looking for.",
    "Perfect! I've gathered enough information to personalize some recommendations for you. Head over to your recommendations page to see what I've found!",
  ];
  return closingResponses[Math.floor(Math.random() * closingResponses.length)];
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

  const systemPrompt = `You are Ellie, an AI Host helping users discover communities on Central Square, a platform that connects people in meaningful ways.

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

