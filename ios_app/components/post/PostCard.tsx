import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants";
import type { Post } from "@/hooks/usePosts";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  showArcade?: boolean;
}

export function PostCard({ post, onPress, showArcade = false }: PostCardProps) {
  const router = useRouter();

  const avatarUrl =
    post.author.avatarUrl ||
    `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${post.author.id}`;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement like functionality
  };

  const handleReply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    }
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share functionality
  };

  const goToArcade = () => {
    if (post.arcade) {
      router.push(`/arcade/${post.arcade.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mx-4 mb-3 p-4 bg-surface rounded-2xl border border-surface-elevated"
    >
      {/* Lantern Badge */}
      {post.isLantern && (
        <View className="flex-row items-center mb-3">
          <Ionicons name="flame" size={14} color={colors.accent.DEFAULT} />
          <Text className="text-accent text-xs ml-1 font-medium">
            Highlighted by host
          </Text>
        </View>
      )}

      {/* Arcade Badge */}
      {showArcade && post.arcade && (
        <TouchableOpacity
          onPress={goToArcade}
          className="flex-row items-center mb-3"
          activeOpacity={0.7}
        >
          <View className="w-5 h-5 rounded bg-surface-elevated items-center justify-center mr-2">
            <Ionicons name="people" size={12} color={colors.foreground.muted} />
          </View>
          <Text className="text-foreground-muted text-xs">
            {post.arcade.name}
          </Text>
        </TouchableOpacity>
      )}

      {/* Author Row */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: avatarUrl }}
          className="w-10 h-10 rounded-full bg-surface-elevated"
        />
        <View className="ml-3 flex-1">
          <Text className="text-foreground font-semibold">
            {post.author.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-foreground-muted text-sm">
              @{post.author.handle}
            </Text>
            <Text className="text-foreground-subtle mx-1">·</Text>
            <Text className="text-foreground-muted text-sm">
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="p-2" activeOpacity={0.7}>
          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            color={colors.foreground.muted}
          />
        </TouchableOpacity>
      </View>

      {/* Post Body */}
      <Text className="text-foreground text-base leading-6 mb-4">
        {post.body}
      </Text>

      {/* Action Bar */}
      <View className="flex-row items-center justify-between">
        {/* Like */}
        <TouchableOpacity
          onPress={handleLike}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name="heart-outline"
            size={20}
            color={colors.foreground.muted}
          />
          <Text className="text-foreground-muted text-sm ml-1">0</Text>
        </TouchableOpacity>

        {/* Reply */}
        <TouchableOpacity
          onPress={handleReply}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.foreground.muted}
          />
          <Text className="text-foreground-muted text-sm ml-1">
            {post.replies?.length || 0}
          </Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={colors.foreground.muted}
          />
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
          <Ionicons
            name="bookmark-outline"
            size={20}
            color={colors.foreground.muted}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
