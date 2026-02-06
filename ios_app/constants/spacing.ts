/**
 * Central Square Spacing System
 * Generous, spacious, not cluttered
 */

export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Semantic spacing
export const layout = {
  // Screen padding
  screenPadding: spacing[4], // 16px
  screenPaddingLarge: spacing[6], // 24px

  // Card padding
  cardPadding: spacing[4], // 16px
  cardPaddingLarge: spacing[6], // 24px

  // Section spacing
  sectionGap: spacing[8], // 32px
  sectionGapLarge: spacing[12], // 48px

  // Component gaps
  componentGap: spacing[3], // 12px
  componentGapSmall: spacing[2], // 8px
  componentGapLarge: spacing[4], // 16px

  // List item spacing
  listItemGap: spacing[3], // 12px
  listItemPadding: spacing[4], // 16px

  // Input spacing
  inputPadding: spacing[3], // 12px
  inputPaddingLarge: spacing[4], // 16px

  // Button spacing
  buttonPaddingX: spacing[6], // 24px
  buttonPaddingY: spacing[3], // 12px

  // Icon sizes
  iconSmall: spacing[4], // 16px
  iconMedium: spacing[5], // 20px
  iconLarge: spacing[6], // 24px
  iconXLarge: spacing[8], // 32px

  // Avatar sizes
  avatarSmall: spacing[8], // 32px
  avatarMedium: spacing[10], // 40px
  avatarLarge: spacing[12], // 48px
  avatarXLarge: spacing[16], // 64px

  // Border radius
  radiusSmall: spacing[1], // 4px
  radiusMedium: spacing[2], // 8px
  radiusLarge: spacing[3], // 12px
  radiusXLarge: spacing[4], // 16px
  radiusFull: 9999,

  // Tab bar
  tabBarHeight: spacing[16], // 64px
  tabBarPadding: spacing[2], // 8px

  // Header
  headerHeight: spacing[14], // 56px

  // Bottom sheet
  bottomSheetHandle: spacing[1], // 4px height
  bottomSheetHandleWidth: spacing[10], // 40px width
} as const;

export type SpacingKey = keyof typeof spacing;
export type LayoutKey = keyof typeof layout;
