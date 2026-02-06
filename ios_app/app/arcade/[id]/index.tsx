import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useArcade, useJoinArcade } from "@/hooks/useArcades";
import { usePosts } from "@/hooks/usePosts";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/post/PostCard";
import { SkeletonCard, SkeletonArcadeCard } from "@/components/ui/Skeleton";
import { colors } from "@/constants";

type TabType = "posts" | "events" | "members" | "about";

export default function ArcadeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [refreshing, setRefreshing] = useState(false);

  const { data: arcadeData, isLoading: arcadeLoading, refetch: refetchArcade } = useArcade(id);
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = usePosts(id);
  const { joinArcade, isLoading: joining } = useJoinArcade();

  const arcade = arcadeData?.arcade;
  const isMember = arcadeData?.isMember;
  const isHost = arcadeData?.isHost;
  const posts = postsData?.posts || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchArcade(), refetchPosts()]);
    setRefreshing(false);
  }, [refetchArcade, refetchPosts]);

  const handleJoin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await joinArcade(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to join arcade. Please try again.");
    }
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement share
  };

  if (arcadeLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-4 py-4">
          <SkeletonArcadeCard />
        </View>
      </SafeAreaView>
    );
  }

  if (!arcade) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color={colors.foreground.muted} />
        <Text className="text-foreground-muted mt-4">Arcade not found</Text>
        <Button variant="secondary" onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-surface-elevated">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 mr-2"
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground.DEFAULT} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground" numberOfLines={1}>
            {arcade.name}
          </Text>
          <Text className="text-foreground-muted text-sm">
            {arcade._count.memberships} members
          </Text>
        </View>
        <TouchableOpacity onPress={handleShare} className="p-2">
          <Ionicons name="share-outline" size={22} color={colors.foreground.DEFAULT} />
        </TouchableOpacity>
        {isHost && (
          <TouchableOpacity className="p-2">
            <Ionicons name="settings-outline" size={22} color={colors.foreground.DEFAULT} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.DEFAULT}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Arcade Header Card */}
        <View className="px-4 py-6 border-b border-surface-elevated">
          <View className="flex-row items-start mb-4">
            <View className="w-16 h-16 rounded-2xl bg-accent/20 items-center justify-center mr-4">
              <Ionicons name="people" size={32} color={colors.accent.DEFAULT} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-xl font-bold text-foreground flex-1">
                  {arcade.name}
                </Text>
                {arcade.visibility === "invite" && (
                  <Badge variant="default" icon={<Ionicons name="lock-closed" size={10} color={colors.foreground.muted} />}>
                    Invite Only
                  </Badge>
                )}
              </View>
              <Text className="text-foreground-muted">
                Hosted by @{arcade.host.handle}
              </Text>
            </View>
          </View>

          {/* Description */}
          {arcade.description && (
            <Text className="text-foreground leading-6 mb-4">
              {arcade.description}
            </Text>
          )}

          {/* Tags */}
          {arcade.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {arcade.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-surface-elevated px-3 py-1.5 rounded-full mr-2 mb-2"
                >
                  <Text className="text-foreground-muted text-sm">{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-6">
              <Ionicons name="people-outline" size={18} color={colors.foreground.muted} />
              <Text className="text-foreground-muted ml-2">
                {arcade._count.memberships} members
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="chatbubbles-outline" size={18} color={colors.foreground.muted} />
              <Text className="text-foreground-muted ml-2">
                {arcade._count.posts} posts
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {!isMember ? (
            <Button
              onPress={handleJoin}
              loading={joining}
              fullWidth
              icon={<Ionicons name="enter-outline" size={18} color={colors.background} />}
            >
              Join Arcade
            </Button>
          ) : (
            <View className="flex-row">
              <Button
                variant="secondary"
                onPress={() => router.push(`/arcade/${id}/compose`)}
                className="flex-1 mr-2"
                icon={<Ionicons name="create-outline" size={18} color={colors.foreground.DEFAULT} />}
              >
                Post
              </Button>
              <Button
                variant="secondary"
                onPress={() => {}}
                icon={<Ionicons name="person-add-outline" size={18} color={colors.foreground.DEFAULT} />}
              >
                Invite
              </Button>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-surface-elevated">
          {(["posts", "events", "members", "about"] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab);
              }}
              className={`flex-1 py-4 items-center border-b-2 ${
                activeTab === tab
                  ? "border-accent"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`font-medium capitalize ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-foreground-muted"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="py-4">
          {activeTab === "posts" && (
            <>
              {postsLoading ? (
                <View className="px-4">
                  <SkeletonCard className="mb-3" />
                  <SkeletonCard className="mb-3" />
                </View>
              ) : posts.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Ionicons name="chatbubbles-outline" size={48} color={colors.foreground.muted} />
                  <Text className="text-foreground font-semibold mt-4 mb-2">No posts yet</Text>
                  <Text className="text-foreground-muted text-center px-8">
                    {isMember
                      ? "Be the first to start a conversation!"
                      : "Join this Arcade to see and create posts"}
                  </Text>
                </View>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPress={() => router.push(`/post/${post.id}`)}
                  />
                ))
              )}
            </>
          )}

          {activeTab === "events" && (
            <View className="items-center justify-center py-12">
              <Ionicons name="calendar-outline" size={48} color={colors.foreground.muted} />
              <Text className="text-foreground font-semibold mt-4 mb-2">No upcoming events</Text>
              <Text className="text-foreground-muted text-center px-8">
                Events will appear here when scheduled
              </Text>
            </View>
          )}

          {activeTab === "members" && (
            <View className="px-4">
              {/* Host */}
              <TouchableOpacity
                className="flex-row items-center py-4 border-b border-surface-elevated"
                activeOpacity={0.7}
              >
                <Avatar source={null} name={arcade.host.name} size="lg" />
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center">
                    <Text className="text-foreground font-semibold">{arcade.host.name}</Text>
                    <Badge variant="accent" size="sm" className="ml-2">Host</Badge>
                  </View>
                  <Text className="text-foreground-muted">@{arcade.host.handle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
              </TouchableOpacity>

              {/* Placeholder for more members */}
              <Text className="text-foreground-muted text-center py-8">
                {arcade._count.memberships - 1} other members
              </Text>
            </View>
          )}

          {activeTab === "about" && (
            <View className="px-4">
              <View className="mb-6">
                <Text className="text-foreground font-semibold mb-2">About</Text>
                <Text className="text-foreground-muted leading-6">
                  {arcade.description || "No description provided."}
                </Text>
              </View>

              <View className="mb-6">
                <Text className="text-foreground font-semibold mb-2">Created</Text>
                <Text className="text-foreground-muted">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <View className="mb-6">
                <Text className="text-foreground font-semibold mb-2">Visibility</Text>
                <Text className="text-foreground-muted capitalize">
                  {arcade.visibility === "open" ? "Open to everyone" : "Invite only"}
                </Text>
              </View>

              {arcade.tags.length > 0 && (
                <View>
                  <Text className="text-foreground font-semibold mb-2">Topics</Text>
                  <View className="flex-row flex-wrap">
                    {arcade.tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="mr-2 mb-2">
                        {tag}
                      </Badge>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
