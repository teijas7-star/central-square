export * from "./colors";
export * from "./typography";
export * from "./spacing";

// API Configuration
export const API_CONFIG = {
  // Base URL for the web API
  // In development, this should point to your local Next.js server
  // In production, this should point to your deployed API
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",

  // Endpoints
  ENDPOINTS: {
    // Auth
    SIGNOUT: "/api/auth/signout",

    // Profiles
    PROFILES: "/api/profiles",

    // Arcades
    ARCADES: "/api/arcades",
    ARCADE: (id: string) => `/api/arcades/${id}`,
    ARCADE_JOIN: (id: string) => `/api/arcades/${id}/join`,
    ARCADE_INVITE: (id: string) => `/api/arcades/${id}/invite`,
    ARCADE_MEMBERS: (id: string) => `/api/arcades/${id}/members`,

    // Posts
    POSTS: "/api/posts",
    POST_LANTERN: (id: string) => `/api/posts/${id}/lantern`,

    // AI Host
    AI_HOST_CHAT: "/api/ai-host/chat",
    AI_HOST_RECOMMENDATIONS: "/api/ai-host/recommendations",

    // Discovery
    DISCOVERY: "/api/discovery",
    FEED_SQUARE: "/api/feed/square",
  },
} as const;

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Central Square",
  TAGLINE: "A digital agora where communities thrive",
  VERSION: "1.0.0",

  // Pagination
  DEFAULT_PAGE_SIZE: 20,

  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds

  // Animation durations (in ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;
