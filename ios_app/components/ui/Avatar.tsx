import { View, Image, Text } from "react-native";
import { colors } from "@/constants";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; indicator: string; indicatorBorder: string }> = {
  xs: {
    container: "w-6 h-6",
    text: "text-xs",
    indicator: "w-2 h-2",
    indicatorBorder: "border",
  },
  sm: {
    container: "w-8 h-8",
    text: "text-sm",
    indicator: "w-2.5 h-2.5",
    indicatorBorder: "border",
  },
  md: {
    container: "w-10 h-10",
    text: "text-base",
    indicator: "w-3 h-3",
    indicatorBorder: "border-2",
  },
  lg: {
    container: "w-12 h-12",
    text: "text-lg",
    indicator: "w-3.5 h-3.5",
    indicatorBorder: "border-2",
  },
  xl: {
    container: "w-16 h-16",
    text: "text-xl",
    indicator: "w-4 h-4",
    indicatorBorder: "border-2",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function generateFallbackUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${encodeURIComponent(seed)}`;
}

export function Avatar({
  source,
  name = "User",
  size = "md",
  showOnlineIndicator = false,
  isOnline = false,
}: AvatarProps) {
  const sizeStyle = sizeStyles[size];
  const imageUrl = source || generateFallbackUrl(name);

  return (
    <View className="relative">
      {/* Avatar Image */}
      <View
        className={`
          ${sizeStyle.container}
          rounded-full
          bg-surface-elevated
          overflow-hidden
        `}
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Online Indicator */}
      {showOnlineIndicator && (
        <View
          className={`
            absolute bottom-0 right-0
            ${sizeStyle.indicator}
            rounded-full
            ${sizeStyle.indicatorBorder}
            border-background
            ${isOnline ? "bg-success" : "bg-neutral-500"}
          `}
        />
      )}
    </View>
  );
}

// Avatar Group for showing multiple avatars
interface AvatarGroupProps {
  avatars: Array<{ source?: string | null; name?: string }>;
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = "sm" }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;
  const sizeStyle = sizeStyles[size];

  return (
    <View className="flex-row">
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          className="border-2 border-background rounded-full"
          style={{ marginLeft: index > 0 ? -8 : 0 }}
        >
          <Avatar source={avatar.source} name={avatar.name} size={size} />
        </View>
      ))}
      {remainingCount > 0 && (
        <View
          className={`
            ${sizeStyle.container}
            rounded-full
            bg-surface-elevated
            items-center
            justify-center
            border-2
            border-background
          `}
          style={{ marginLeft: -8 }}
        >
          <Text className={`text-foreground-muted ${sizeStyle.text} font-medium`}>
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );
}
