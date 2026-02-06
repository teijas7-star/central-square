import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCreatePost } from "@/hooks/usePosts";
import { colors } from "@/constants";

export default function CreateScreen() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedArcade, setSelectedArcade] = useState<string | null>(null);
  const { createPost, isLoading } = useCreatePost();

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("Empty post", "Please write something before posting.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createPost({
        body: content.trim(),
        arcadeId: selectedArcade,
      });

      setContent("");
      setSelectedArcade(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };

  const characterCount = content.length;
  const maxCharacters = 2000;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-elevated">
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-2"
          >
            <Text className="text-foreground-muted text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">
            Create Post
          </Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={isLoading || !content.trim() || isOverLimit}
            className={`px-4 py-2 rounded-full ${
              content.trim() && !isOverLimit
                ? "bg-accent"
                : "bg-surface"
            }`}
          >
            <Text
              className={`font-semibold ${
                content.trim() && !isOverLimit
                  ? "text-background"
                  : "text-foreground-subtle"
              }`}
            >
              {isLoading ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Compose Area */}
          <View className="p-4">
            {/* Arcade Selector */}
            <TouchableOpacity
              className="flex-row items-center mb-4 p-3 bg-surface rounded-xl"
              activeOpacity={0.8}
            >
              <Ionicons
                name="globe-outline"
                size={20}
                color={colors.foreground.muted}
              />
              <Text className="text-foreground-muted ml-2 flex-1">
                {selectedArcade ? "Selected Arcade" : "Post to The Square (Public)"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.foreground.muted}
              />
            </TouchableOpacity>

            {/* Text Input */}
            <TextInput
              className="text-foreground text-lg leading-6 min-h-[200px]"
              placeholder="What's on your mind?"
              placeholderTextColor={colors.foreground.subtle}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus
              maxLength={maxCharacters + 100}
            />
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View className="border-t border-surface-elevated px-4 py-3">
          <View className="flex-row items-center justify-between">
            {/* Formatting Options */}
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity className="p-2">
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={colors.foreground.muted}
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Ionicons
                  name="link-outline"
                  size={24}
                  color={colors.foreground.muted}
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Ionicons
                  name="at-outline"
                  size={24}
                  color={colors.foreground.muted}
                />
              </TouchableOpacity>
            </View>

            {/* Character Count */}
            <Text
              className={`text-sm ${
                isOverLimit ? "text-error" : "text-foreground-muted"
              }`}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
