import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Avatar } from "@/components/ui/Avatar";
import { useCreatePost } from "@/hooks/usePosts";
import { colors } from "@/constants";

interface ComposeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  arcadeId?: string;
  arcadeName?: string;
  replyTo?: {
    id: string;
    authorName: string;
  };
}

const MAX_CHARACTERS = 2000;

export function ComposeSheet({
  isOpen,
  onClose,
  arcadeId,
  arcadeName,
  replyTo,
}: ComposeSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const [content, setContent] = useState("");
  const { createPost, isLoading } = useCreatePost();

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
      // Delay focus to allow animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    if (content.trim()) {
      Alert.alert(
        "Discard post?",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setContent("");
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  }, [content, onClose]);

  const handleSubmit = async () => {
    if (!content.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createPost({
        body: content.trim(),
        arcadeId: arcadeId || null,
        parentId: replyTo?.id || null,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setContent("");
      onClose();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isLoading;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["75%", "95%"]}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.foreground.muted }}
      backgroundStyle={{ backgroundColor: colors.surface.DEFAULT }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-elevated">
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-foreground-muted text-base">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground">
              {replyTo ? "Reply" : "New Post"}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit}
              className={`px-4 py-1.5 rounded-full ${
                canSubmit ? "bg-accent" : "bg-surface-elevated"
              }`}
            >
              <Text
                className={`font-semibold ${
                  canSubmit ? "text-background" : "text-foreground-subtle"
                }`}
              >
                {isLoading ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reply Context */}
          {replyTo && (
            <View className="px-4 py-3 border-b border-surface-elevated bg-surface-elevated/50">
              <Text className="text-foreground-muted text-sm">
                Replying to{" "}
                <Text className="text-accent">@{replyTo.authorName}</Text>
              </Text>
            </View>
          )}

          {/* Arcade Badge */}
          {arcadeName && !replyTo && (
            <View className="px-4 py-3 border-b border-surface-elevated">
              <View className="flex-row items-center">
                <Ionicons
                  name="people"
                  size={16}
                  color={colors.foreground.muted}
                />
                <Text className="text-foreground-muted text-sm ml-2">
                  Posting to{" "}
                  <Text className="text-foreground font-medium">
                    {arcadeName}
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Compose Area */}
          <View className="flex-1 px-4 pt-4">
            <View className="flex-row">
              <Avatar source={null} name="You" size="md" />
              <TextInput
                ref={inputRef}
                className="flex-1 ml-3 text-foreground text-lg leading-6"
                placeholder={
                  replyTo
                    ? "Write your reply..."
                    : "What's on your mind?"
                }
                placeholderTextColor={colors.foreground.subtle}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={MAX_CHARACTERS + 100}
                style={{ minHeight: 120 }}
              />
            </View>
          </View>

          {/* Bottom Toolbar */}
          <View className="border-t border-surface-elevated px-4 py-3">
            <View className="flex-row items-center justify-between">
              {/* Tools */}
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
              <View className="flex-row items-center">
                {characterCount > MAX_CHARACTERS * 0.8 && (
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-2 ${
                      isOverLimit
                        ? "border-error"
                        : "border-warning"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isOverLimit ? "text-error" : "text-warning"
                      }`}
                    >
                      {MAX_CHARACTERS - characterCount}
                    </Text>
                  </View>
                )}
                <Text
                  className={`text-sm ${
                    isOverLimit ? "text-error" : "text-foreground-muted"
                  }`}
                >
                  {characterCount}/{MAX_CHARACTERS}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}
