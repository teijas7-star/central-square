import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/post/PostCard";
import { colors } from "@/constants";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { posts, isLoading, refetch } = usePosts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const openAIHost = () => {
    router.push("/ai-host");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-elevated">
        <Text className="text-2xl font-bold text-foreground font-serif">
          The Square
        </Text>
        <TouchableOpacity
          onPress={openAIHost}
          className="w-10 h-10 rounded-full bg-accent items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.DEFAULT}
            colors={[colors.accent.DEFAULT]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* AI Host Suggestion Card */}
        <TouchableOpacity
          onPress={openAIHost}
          className="mx-4 mt-4 p-4 bg-surface rounded-2xl border border-surface-elevated"
          activeOpacity={0.8}
        >
          <View className="flex-row items-start">
            <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={20} color={colors.accent.DEFAULT} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-foreground font-semibold mr-2">
                  Your AI Host
                </Text>
                <View className="bg-accent/20 px-2 py-0.5 rounded-full">
                  <Text className="text-accent text-xs font-medium">AI</Text>
                </View>
              </View>
              <Text className="text-foreground-muted text-sm leading-5">
                Tell me about your interests and I'll help you find the perfect communities to join.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </View>
        </TouchableOpacity>

        {/* Posts */}
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
            <Text className="text-foreground-muted mt-4">Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View className="items-center justify-center py-12 mx-4">
            <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
              <Ionicons name="chatbubbles-outline" size={32} color={colors.foreground.muted} />
            </View>
            <Text className="text-foreground font-semibold text-lg mb-2">
              No posts yet
            </Text>
            <Text className="text-foreground-muted text-center">
              Join some Arcades to see posts from your communities
            </Text>
          </View>
        ) : (
          <View className="mt-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => router.push(`/post/${post.id}`)}
                showArcade
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
