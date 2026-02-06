import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import type { Arcade } from "@/hooks/useArcades";

interface ArcadeCardProps {
  arcade: Arcade;
  onPress?: () => void;
}

export function ArcadeCard({ arcade, onPress }: ArcadeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mx-4 mb-3 p-4 bg-surface rounded-2xl border border-surface-elevated"
    >
      {/* Header */}
      <View className="flex-row items-start mb-3">
        <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center mr-3">
          <Ionicons name="people" size={24} color={colors.accent.DEFAULT} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-foreground font-semibold text-lg flex-1">
              {arcade.name}
            </Text>
            {arcade.visibility === "invite" && (
              <View className="bg-surface-elevated px-2 py-1 rounded-full">
                <Ionicons name="lock-closed" size={12} color={colors.foreground.muted} />
              </View>
            )}
          </View>
          <Text className="text-foreground-muted text-sm">
            Hosted by @{arcade.host.handle}
          </Text>
        </View>
      </View>

      {/* Description */}
      {arcade.description && (
        <Text
          className="text-foreground-muted text-sm leading-5 mb-3"
          numberOfLines={2}
        >
          {arcade.description}
        </Text>
      )}

      {/* Tags */}
      {arcade.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {arcade.tags.slice(0, 4).map((tag, index) => (
            <View
              key={index}
              className="bg-surface-elevated px-2 py-1 rounded-full mr-2 mb-1"
            >
              <Text className="text-foreground-muted text-xs">{tag}</Text>
            </View>
          ))}
          {arcade.tags.length > 4 && (
            <View className="bg-surface-elevated px-2 py-1 rounded-full">
              <Text className="text-foreground-subtle text-xs">
                +{arcade.tags.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Stats */}
      <View className="flex-row items-center pt-3 border-t border-surface-elevated">
        <View className="flex-row items-center mr-6">
          <Ionicons name="people-outline" size={16} color={colors.foreground.muted} />
          <Text className="text-foreground-muted text-sm ml-1">
            {arcade._count.memberships} members
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="chatbubbles-outline" size={16} color={colors.foreground.muted} />
          <Text className="text-foreground-muted text-sm ml-1">
            {arcade._count.posts} posts
          </Text>
        </View>
        <View className="flex-1" />
        <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
      </View>
    </TouchableOpacity>
  );
}
