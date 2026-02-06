import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useAIHost } from "@/hooks/useAIHost";
import { colors } from "@/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIHostScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, recommendations } = useAIHost();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const message = input.trim();
    setInput("");

    await sendMessage(message);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Message */}
          {messages.length === 0 && (
            <Animated.View
              entering={FadeIn.duration(500)}
              className="items-center py-8"
            >
              <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-6">
                <Ionicons name="sparkles" size={40} color={colors.accent.DEFAULT} />
              </View>
              <Text className="text-2xl font-bold text-foreground text-center mb-2">
                Hello! I'm your AI Host
              </Text>
              <Text className="text-foreground-muted text-center leading-5 px-4">
                I'm here to help you discover communities that match your interests and values. Tell me about yourself!
              </Text>

              {/* Suggested Prompts */}
              <View className="mt-8 w-full">
                <Text className="text-foreground-muted text-sm mb-4 text-center">
                  Try asking:
                </Text>
                {[
                  "I'm interested in design and technology",
                  "Help me find civic engagement communities",
                  "What communities would you recommend for me?",
                ].map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setInput(prompt);
                      handleSend();
                    }}
                    className="bg-surface rounded-xl p-4 mb-3 border border-surface-elevated"
                    activeOpacity={0.8}
                  >
                    <Text className="text-foreground">{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.delay(index * 50).duration(300)}
              className={`mb-4 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <View
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-accent rounded-br-sm"
                    : "bg-surface rounded-bl-sm"
                }`}
              >
                <Text
                  className={`text-base leading-5 ${
                    message.role === "user" ? "text-background" : "text-foreground"
                  }`}
                >
                  {message.content}
                </Text>
              </View>
              <Text className="text-foreground-subtle text-xs mt-1 mx-1">
                {formatTime(message.timestamp)}
              </Text>
            </Animated.View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View className="items-start mb-4">
              <View className="bg-surface rounded-2xl rounded-bl-sm px-4 py-3">
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color={colors.accent.DEFAULT} />
                  <Text className="text-foreground-muted ml-2">Thinking...</Text>
                </View>
              </View>
            </View>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Animated.View
              entering={FadeIn.duration(500)}
              className="mt-4"
            >
              <Text className="text-foreground font-semibold mb-3">
                Recommended for you:
              </Text>
              {recommendations.map((rec) => (
                <TouchableOpacity
                  key={rec.arcadeId}
                  onPress={() => router.push(`/arcade/${rec.arcadeId}`)}
                  className="bg-surface rounded-xl p-4 mb-3 border border-surface-elevated"
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-lg bg-accent/20 items-center justify-center mr-3">
                      <Ionicons name="people" size={20} color={colors.accent.DEFAULT} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold">
                        {rec.arcadeName}
                      </Text>
                      <Text className="text-foreground-muted text-sm">
                        {Math.round(rec.confidence * 100)}% match
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.foreground.muted} />
                  </View>
                  <Text className="text-foreground-muted text-sm">
                    {rec.reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View className="px-4 py-3 border-t border-surface-elevated bg-background">
          <View className="flex-row items-end">
            <View className="flex-1 bg-surface rounded-2xl px-4 py-2 mr-3 max-h-32">
              <TextInput
                className="text-foreground text-base"
                placeholder="Message your AI Host..."
                placeholderTextColor={colors.foreground.subtle}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={1000}
                style={{ maxHeight: 100 }}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                input.trim() && !isLoading ? "bg-accent" : "bg-surface"
              }`}
              activeOpacity={0.8}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  input.trim() && !isLoading
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
