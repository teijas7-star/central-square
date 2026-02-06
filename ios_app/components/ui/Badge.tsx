import { View, Text } from "react-native";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: "bg-surface-elevated",
    text: "text-foreground-muted",
  },
  accent: {
    bg: "bg-accent/20",
    text: "text-accent",
  },
  success: {
    bg: "bg-success/20",
    text: "text-success",
  },
  warning: {
    bg: "bg-warning/20",
    text: "text-warning",
  },
  error: {
    bg: "bg-error/20",
    text: "text-error",
  },
  info: {
    bg: "bg-info/20",
    text: "text-info",
  },
};

const sizeStyles: Record<BadgeSize, { padding: string; text: string }> = {
  sm: {
    padding: "px-2 py-0.5",
    text: "text-xs",
  },
  md: {
    padding: "px-2.5 py-1",
    text: "text-sm",
  },
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  icon,
  className = "",
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View
      className={`
        flex-row items-center rounded-full
        ${variantStyle.bg}
        ${sizeStyle.padding}
        ${className}
      `}
    >
      {icon && <View className="mr-1">{icon}</View>}
      <Text
        className={`
          font-medium
          ${variantStyle.text}
          ${sizeStyle.text}
        `}
      >
        {children}
      </Text>
    </View>
  );
}

// Dot Badge for notifications
interface DotBadgeProps {
  count?: number;
  show?: boolean;
  size?: "sm" | "md";
}

export function DotBadge({ count, show = true, size = "sm" }: DotBadgeProps) {
  if (!show) return null;

  const sizeStyles = {
    sm: count ? "min-w-4 h-4 px-1" : "w-2 h-2",
    md: count ? "min-w-5 h-5 px-1.5" : "w-3 h-3",
  };

  return (
    <View
      className={`
        bg-error rounded-full items-center justify-center
        ${sizeStyles[size]}
      `}
    >
      {count && count > 0 && (
        <Text className="text-white text-xs font-bold">
          {count > 99 ? "99+" : count}
        </Text>
      )}
    </View>
  );
}
