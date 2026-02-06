import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/authStore";
import { useProfile } from "@/hooks/useProfile";
import { colors } from "@/constants";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { profile, isLoading, refetch } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  const avatarUrl = profile?.avatarUrl ||
    `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${profile?.id || "default"}`;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-elevated">
        <Text className="text-2xl font-bold text-foreground font-serif">
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          className="p-2"
        >
          <Ionicons name="settings-outline" size={24} color={colors.foreground.DEFAULT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.DEFAULT}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center py-8 px-4">
          <Image
            source={{ uri: avatarUrl }}
            className="w-24 h-24 rounded-full bg-surface mb-4"
          />
          <Text className="text-2xl font-bold text-foreground mb-1">
            {profile?.name || "Your Name"}
          </Text>
          <Text className="text-foreground-muted mb-4">
            @{profile?.handle || "handle"}
          </Text>
          {profile?.bio && (
            <Text className="text-foreground-muted text-center leading-5 mb-4">
              {profile.bio}
            </Text>
          )}
          <TouchableOpacity
            className="px-6 py-2 border border-surface-elevated rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-foreground font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around py-4 border-y border-surface-elevated mx-4">
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">0</Text>
            <Text className="text-foreground-muted text-sm">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">0</Text>
            <Text className="text-foreground-muted text-sm">Arcades</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">0</Text>
            <Text className="text-foreground-muted text-sm">Connections</Text>
          </View>
        </View>

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Interests
            </Text>
            <View className="flex-row flex-wrap">
              {profile.interests.map((interest, index) => (
                <View
                  key={index}
                  className="bg-surface px-3 py-1.5 rounded-full mr-2 mb-2"
                >
                  <Text className="text-foreground-muted text-sm">{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="mt-4">
          <TouchableOpacity
            onPress={() => router.push("/ai-host")}
            className="flex-row items-center px-4 py-4 border-b border-surface-elevated"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={20} color={colors.accent.DEFAULT} />
            </View>
            <Text className="text-foreground flex-1">AI Host</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center px-4 py-4 border-b border-surface-elevated"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
              <Ionicons name="bookmark-outline" size={20} color={colors.foreground.muted} />
            </View>
            <Text className="text-foreground flex-1">Saved Posts</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center px-4 py-4 border-b border-surface-elevated"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
              <Ionicons name="people-outline" size={20} color={colors.foreground.muted} />
            </View>
            <Text className="text-foreground flex-1">My Arcades</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center px-4 py-4 border-b border-surface-elevated"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={20} color={colors.foreground.muted} />
            </View>
            <Text className="text-foreground flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View className="px-4 mt-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="py-4 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-error font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text className="text-center text-foreground-subtle text-sm mt-4">
          Central Square v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
