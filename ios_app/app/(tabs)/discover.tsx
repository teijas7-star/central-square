import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useArcades } from "@/hooks/useArcades";
import { ArcadeCard } from "@/components/arcade/ArcadeCard";
import { colors } from "@/constants";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "civic", label: "Civic" },
  { id: "design", label: "Design" },
  { id: "tech", label: "Tech" },
  { id: "community", label: "Community" },
  { id: "education", label: "Education" },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { arcades, isLoading, refetch } = useArcades();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredArcades = arcades.filter((arcade) => {
    const matchesSearch =
      searchQuery === "" ||
      arcade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arcade.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      arcade.tags.some((tag) =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-surface-elevated">
        <Text className="text-2xl font-bold text-foreground font-serif mb-4">
          Discover
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color={colors.foreground.muted} />
          <TextInput
            className="flex-1 ml-3 text-foreground text-base"
            placeholder="Search Arcades..."
            placeholderTextColor={colors.foreground.subtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.foreground.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mx-4 px-4"
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? "bg-accent"
                  : "bg-surface border border-surface-elevated"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category.id
                    ? "text-background"
                    : "text-foreground-muted"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Arcades List */}
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
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
            <Text className="text-foreground-muted mt-4">Loading Arcades...</Text>
          </View>
        ) : filteredArcades.length === 0 ? (
          <View className="items-center justify-center py-12 mx-4">
            <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
              <Ionicons name="search-outline" size={32} color={colors.foreground.muted} />
            </View>
            <Text className="text-foreground font-semibold text-lg mb-2">
              No Arcades found
            </Text>
            <Text className="text-foreground-muted text-center">
              Try adjusting your search or explore different categories
            </Text>
          </View>
        ) : (
          <View className="mt-4">
            {filteredArcades.map((arcade) => (
              <ArcadeCard
                key={arcade.id}
                arcade={arcade}
                onPress={() => router.push(`/arcade/${arcade.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
