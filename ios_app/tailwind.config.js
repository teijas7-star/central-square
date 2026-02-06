/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      spacing: {
        "safe-top": "var(--safe-area-inset-top)",
        "safe-bottom": "var(--safe-area-inset-bottom)",
        "safe-left": "var(--safe-area-inset-left)",
        "safe-right": "var(--safe-area-inset-right)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
