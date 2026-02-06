import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: {
    bg: "bg-accent",
    text: "text-background",
  },
  secondary: {
    bg: "bg-surface",
    text: "text-foreground",
    border: "border border-surface-elevated",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-foreground",
  },
  danger: {
    bg: "bg-error",
    text: "text-white",
  },
};

const sizeStyles: Record<ButtonSize, { padding: string; text: string; height: string }> = {
  sm: {
    padding: "px-4",
    text: "text-sm",
    height: "h-9",
  },
  md: {
    padding: "px-6",
    text: "text-base",
    height: "h-11",
  },
  lg: {
    padding: "px-8",
    text: "text-lg",
    height: "h-14",
  },
};

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`
        flex-row items-center justify-center rounded-full
        ${variantStyle.bg}
        ${variantStyle.border || ""}
        ${sizeStyle.padding}
        ${sizeStyle.height}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.background : colors.foreground.DEFAULT}
        />
      ) : (
        <View className="flex-row items-center">
          {icon && iconPosition === "left" && (
            <View className="mr-2">{icon}</View>
          )}
          <Text
            className={`
              font-semibold
              ${variantStyle.text}
              ${sizeStyle.text}
            `}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <View className="ml-2">{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
