/**
 * Central Square Route Constants
 * 
 * Canonical paths for the application. Use these constants instead of
 * hardcoding paths throughout the codebase.
 * 
 * Note: Route groups like (city), (global), (arcades), (account), (public)
 * don't affect the URL path - they're just for organization.
 */

export const routes = {
  // Public routes
  home: "/",
  signin: "/signin",
  
  // Global routes
  global: {
    agora: "/agora",
    agoraFeed: "/agora/feed",
    globalArcades: "/global/arcades", // Legacy route, kept for now
  },
  
  // City routes (dynamic)
  city: {
    home: (city: string) => `/${city.toLowerCase()}`,
    feed: (city: string) => `/${city.toLowerCase()}/feed`,
  },
  
  // Arcade routes
  arcades: {
    create: "/arcades/create",
    detail: (id: string) => `/arcades/${id}`,
    dashboard: (id: string) => `/arcades/${id}/dashboard`,
    events: (id: string) => `/arcades/${id}/events`,
    members: (id: string) => `/arcades/${id}/members`,
    settings: (id: string) => `/arcades/${id}/settings`,
  },
  
  // Account routes
  account: {
    profileCreate: "/profile/create",
    aiHost: "/ai-host",
  },
  
  // App routes
  app: {
    dashboard: "/dashboard",
    discover: "/discover",
    square: "/square",
  },
} as const;

/**
 * Helper function to build city routes
 */
export function getCityRoute(city: string, type: "home" | "feed"): string {
  return routes.city[type](city);
}

/**
 * Helper function to build arcade routes
 */
export function getArcadeRoute(
  id: string,
  type: "detail" | "dashboard" | "events" | "members" | "settings"
): string {
  return routes.arcades[type](id);
}
