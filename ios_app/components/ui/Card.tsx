import { View, TouchableOpacity, ViewProps } from "react-native";
import * as Haptics from "expo-haptics";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: "bg-surface border border-surface-elevated",
  elevated: "bg-surface-elevated",
  outlined: "bg-transparent border border-surface-elevated",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  onPress,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const baseStyles = `rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className={baseStyles}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={baseStyles} {...props}>
      {children}
    </View>
  );
}

// Card Header component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <View className={`mb-3 ${className}`}>
      {children}
    </View>
  );
}

// Card Content component
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <View className={className}>{children}</View>;
}

// Card Footer component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <View className={`mt-3 pt-3 border-t border-surface-elevated ${className}`}>
      {children}
    </View>
  );
}
