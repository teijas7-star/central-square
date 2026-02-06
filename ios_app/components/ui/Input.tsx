import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  icon,
  rightIcon,
  onRightIconPress,
  containerClassName = "",
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry !== undefined;
  const shouldHideText = isPassword && !showPassword;

  return (
    <View className={containerClassName}>
      {/* Label */}
      {label && (
        <Text className="text-foreground-muted text-sm mb-2 font-medium">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`
          flex-row items-center bg-surface rounded-xl px-4
          border
          ${error ? "border-error" : isFocused ? "border-accent" : "border-surface-elevated"}
        `}
      >
        {/* Left Icon */}
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? colors.error : colors.foreground.muted}
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          className="flex-1 py-4 text-foreground text-base"
          placeholderTextColor={colors.foreground.subtle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={shouldHideText}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.foreground.muted}
            />
          </TouchableOpacity>
        )}

        {/* Right Icon */}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.foreground.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text className="text-error text-sm ml-1">{error}</Text>
        </View>
      )}

      {/* Hint */}
      {hint && !error && (
        <Text className="text-foreground-subtle text-sm mt-2">{hint}</Text>
      )}
    </View>
  );
}
