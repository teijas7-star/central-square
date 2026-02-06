import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";

interface Activity {
  id: string;
  type: "reply" | "join" | "mention" | "like" | "invite";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  arcadeId?: string;
  postId?: string;
}

// Mock data - will be replaced with real API
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "reply",
    title: "New reply to your post",
    description: "Sarah commented on your discussion about community building",
    timestamp: "2h ago",
    read: false,
    postId: "post-1",
  },
  {
    id: "2",
    type: "join",
    title: "Welcome to Design Community",
    description: "You've successfully joined the Design Community arcade",
    timestamp: "1d ago",
    read: true,
    arcadeId: "arcade-1",
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned",
    description: "Alex mentioned you in a discussion about AI tools",
    timestamp: "2d ago",
    read: true,
    postId: "post-2",
  },
];

export default function ActivityScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch real activities
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "reply":
        return "chatbubble";
      case "join":
        return "enter";
      case "mention":
        return "at";
      case "like":
        return "heart";
      case "invite":
        return "mail";
      default:
        return "notifications";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "reply":
        return colors.info;
      case "join":
        return colors.success;
      case "mention":
        return colors.accent.DEFAULT;
      case "like":
        return "#EF4444";
      case "invite":
        return colors.warning;
      default:
        return colors.foreground.muted;
    }
  };

  const handleActivityPress = (activity: Activity) => {
    if (activity.postId) {
      router.push(`/post/${activity.postId}`);
    } else if (activity.arcadeId) {
      router.push(`/arcade/${activity.arcadeId}`);
    }
  };

  const markAllAsRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = activities.filter((a) => !a.read).length;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-elevated">
        <Text className="text-2xl font-bold text-foreground font-serif">
          Activity
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-accent font-medium">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.DEFAULT}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {activities.length === 0 ? (
          <View className="items-center justify-center py-12 mx-4">
            <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
              <Ionicons
                name="notifications-outline"
                size={32}
                color={colors.foreground.muted}
              />
            </View>
            <Text className="text-foreground font-semibold text-lg mb-2">
              No activity yet
            </Text>
            <Text className="text-foreground-muted text-center">
              When people interact with your posts or you join Arcades, you'll see it here
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => handleActivityPress(activity)}
                className={`flex-row items-start px-4 py-4 border-b border-surface-elevated ${
                  !activity.read ? "bg-surface/50" : ""
                }`}
                activeOpacity={0.7}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: getActivityColor(activity.type) + "20" }}
                >
                  <Ionicons
                    name={getActivityIcon(activity.type)}
                    size={20}
                    color={getActivityColor(activity.type)}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-foreground font-semibold flex-1">
                      {activity.title}
                    </Text>
                    {!activity.read && (
                      <View className="w-2 h-2 rounded-full bg-accent ml-2" />
                    )}
                  </View>
                  <Text className="text-foreground-muted text-sm mb-1">
                    {activity.description}
                  </Text>
                  <Text className="text-foreground-subtle text-xs">
                    {activity.timestamp}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.foreground.subtle}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
