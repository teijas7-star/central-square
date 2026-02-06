import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { colors } from "@/constants";

// Mock data - will be replaced with real API
const MOCK_POST = {
  id: "1",
  body: "Just had an amazing discussion about the future of civic technology at our monthly meetup. The energy was incredible! Looking forward to implementing some of these ideas in our community.",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  isLantern: true,
  author: {
    id: "author-1",
    name: "Sarah Chen",
    handle: "sarahchen",
    avatarUrl: null,
  },
  arcade: {
    id: "arcade-1",
    name: "Civic Tech Community",
  },
  replies: [
    {
      id: "reply-1",
      body: "This was such a great event! Especially loved the breakout session on AI in governance.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      author: {
        id: "author-2",
        name: "Marcus Johnson",
        handle: "marcusj",
        avatarUrl: null,
      },
    },
    {
      id: "reply-2",
      body: "Count me in for the next one! When is it scheduled?",
      createdAt: new Date(Date.now() - 900000).toISOString(),
      author: {
        id: "author-3",
        name: "Emily Park",
        handle: "emilyp",
        avatarUrl: null,
      },
    },
  ],
};

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace with real API call
  const post = MOCK_POST;
  const isLoading = false;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement like
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      // TODO: API call to submit reply
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReplyText("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-4 py-4">
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Post */}
          <View className="px-4 py-4 border-b border-surface-elevated">
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
            {post.arcade && (
              <TouchableOpacity
                onPress={() => router.push(`/arcade/${post.arcade!.id}`)}
                className="flex-row items-center mb-3"
                activeOpacity={0.7}
              >
                <View className="w-5 h-5 rounded bg-surface-elevated items-center justify-center mr-2">
                  <Ionicons name="people" size={12} color={colors.foreground.muted} />
                </View>
                <Text className="text-foreground-muted text-sm">
                  {post.arcade.name}
                </Text>
              </TouchableOpacity>
            )}

            {/* Author Row */}
            <View className="flex-row items-center mb-4">
              <Avatar source={post.author.avatarUrl} name={post.author.name} size="lg" />
              <View className="ml-3 flex-1">
                <Text className="text-foreground font-semibold text-lg">
                  {post.author.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-foreground-muted">@{post.author.handle}</Text>
                  <Text className="text-foreground-subtle mx-1">·</Text>
                  <Text className="text-foreground-muted">
                    {formatTimeAgo(post.createdAt)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.foreground.muted} />
              </TouchableOpacity>
            </View>

            {/* Post Body */}
            <Text className="text-foreground text-lg leading-7 mb-4">
              {post.body}
            </Text>

            {/* Engagement Stats */}
            <View className="flex-row items-center py-3 border-t border-b border-surface-elevated">
              <Text className="text-foreground-muted">
                <Text className="text-foreground font-semibold">0</Text> likes
              </Text>
              <Text className="text-foreground-subtle mx-2">·</Text>
              <Text className="text-foreground-muted">
                <Text className="text-foreground font-semibold">{post.replies.length}</Text> replies
              </Text>
            </View>

            {/* Action Bar */}
            <View className="flex-row items-center justify-around py-2">
              <TouchableOpacity
                onPress={handleLike}
                className="flex-row items-center py-2 px-4"
                activeOpacity={0.7}
              >
                <Ionicons name="heart-outline" size={22} color={colors.foreground.muted} />
                <Text className="text-foreground-muted ml-2">Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-2 px-4"
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={22} color={colors.foreground.muted} />
                <Text className="text-foreground-muted ml-2">Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                className="flex-row items-center py-2 px-4"
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={22} color={colors.foreground.muted} />
                <Text className="text-foreground-muted ml-2">Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Replies */}
          <View className="py-2">
            {post.replies.map((reply) => (
              <View
                key={reply.id}
                className="px-4 py-4 border-b border-surface-elevated"
              >
                <View className="flex-row items-start">
                  <Avatar source={reply.author.avatarUrl} name={reply.author.name} size="md" />
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-foreground font-semibold">
                        {reply.author.name}
                      </Text>
                      <Text className="text-foreground-muted ml-2">
                        @{reply.author.handle}
                      </Text>
                      <Text className="text-foreground-subtle mx-1">·</Text>
                      <Text className="text-foreground-muted text-sm">
                        {formatTimeAgo(reply.createdAt)}
                      </Text>
                    </View>
                    <Text className="text-foreground leading-5">{reply.body}</Text>

                    {/* Reply Actions */}
                    <View className="flex-row items-center mt-3">
                      <TouchableOpacity className="flex-row items-center mr-6" activeOpacity={0.7}>
                        <Ionicons name="heart-outline" size={16} color={colors.foreground.muted} />
                        <Text className="text-foreground-muted text-sm ml-1">0</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
                        <Ionicons name="chatbubble-outline" size={16} color={colors.foreground.muted} />
                        <Text className="text-foreground-muted text-sm ml-1">Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom padding for reply input */}
          <View className="h-20" />
        </ScrollView>

        {/* Reply Input */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-surface-elevated bg-background px-4 py-3">
          <View className="flex-row items-end">
            <Avatar source={null} name="You" size="sm" />
            <View className="flex-1 bg-surface rounded-2xl px-4 py-2 mx-3 max-h-24">
              <TextInput
                className="text-foreground text-base"
                placeholder="Write a reply..."
                placeholderTextColor={colors.foreground.subtle}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                style={{ maxHeight: 80 }}
              />
            </View>
            <TouchableOpacity
              onPress={handleSubmitReply}
              disabled={!replyText.trim() || isSubmitting}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                replyText.trim() && !isSubmitting ? "bg-accent" : "bg-surface"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name="send"
                size={18}
                color={
                  replyText.trim() && !isSubmitting
                    ? colors.background
                    : colors.foreground.subtle
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
