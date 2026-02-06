/**
 * Central Square Typography System
 * Serif headlines, sans-serif body
 */

export const typography = {
  // Font families
  fonts: {
    serif: "Georgia",
    sans: "Inter",
    mono: "SF Mono",
  },

  // Font sizes (in pixels, converted to RN points)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },

  // Line heights (multipliers)
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  weights: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// Pre-composed text styles
export const textStyles = {
  // Headlines (Serif)
  h1: {
    fontFamily: typography.fonts.serif,
    fontSize: typography.sizes["4xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes["4xl"] * typography.lineHeights.tight,
  },
  h2: {
    fontFamily: typography.fonts.serif,
    fontSize: typography.sizes["3xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes["3xl"] * typography.lineHeights.tight,
  },
  h3: {
    fontFamily: typography.fonts.serif,
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes["2xl"] * typography.lineHeights.tight,
  },
  h4: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xl * typography.lineHeights.tight,
  },

  // Body (Sans-serif)
  body: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },

  // UI Elements
  label: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.sm * typography.lineHeights.tight,
  },
  caption: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  button: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.base * typography.lineHeights.tight,
  },
} as const;
