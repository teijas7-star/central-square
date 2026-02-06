/**
 * Central Square Color System
 * Dark theme with warm amber accents
 */

export const colors = {
  // Primary - Dark theme
  background: "#000000",
  surface: {
    DEFAULT: "#171717",
    elevated: "#262626",
    hover: "#404040",
  },

  // Text colors
  foreground: {
    DEFAULT: "#FAFAFA",
    muted: "#A3A3A3",
    subtle: "#737373",
  },

  // Accent - Warm amber
  accent: {
    DEFAULT: "#F59E0B",
    hover: "#D97706",
    muted: "#92400E",
  },

  // Status colors
  success: "#22C55E",
  warning: "#EAB308",
  error: "#EF4444",
  info: "#3B82F6",

  // Neutral scale
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },

  // Transparency helpers
  overlay: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.2)",
    dark: "rgba(0, 0, 0, 0.5)",
  },
} as const;

export type ColorKey = keyof typeof colors;
