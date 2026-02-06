import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/constants";

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { error } = await signInWithEmail(email);

      if (error) {
        Alert.alert("Error", error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
          pathname: "/(auth)/verify",
          params: { email },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.foreground.DEFAULT}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-3xl font-bold text-foreground font-serif mb-2">
            Welcome to{"\n"}Central Square
          </Text>
          <Text className="text-foreground-muted text-lg mb-8">
            Enter your email to get started
          </Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-foreground-muted text-sm mb-2 font-medium">
              Email
            </Text>
            <View className="flex-row items-center bg-surface rounded-xl px-4 border border-surface-elevated">
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.foreground.muted}
              />
              <TextInput
                className="flex-1 py-4 ml-3 text-foreground text-base"
                placeholder="you@example.com"
                placeholderTextColor={colors.foreground.subtle}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!isLoading}
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={() => setEmail("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.foreground.muted}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Magic Link Info */}
          <View className="flex-row items-start bg-surface/50 rounded-xl p-4 mb-8">
            <Ionicons
              name="sparkles"
              size={20}
              color={colors.accent.DEFAULT}
              style={{ marginTop: 2 }}
            />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium mb-1">
                Magic link sign in
              </Text>
              <Text className="text-foreground-muted text-sm leading-5">
                We'll send you a link to sign in. No password needed.
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValidEmail(email) || isLoading}
            className={`rounded-full py-4 ${
              isValidEmail(email) && !isLoading ? "bg-accent" : "bg-surface"
            }`}
            activeOpacity={0.9}
          >
            <Text
              className={`font-semibold text-center text-lg ${
                isValidEmail(email) && !isLoading
                  ? "text-background"
                  : "text-foreground-subtle"
              }`}
            >
              {isLoading ? "Sending..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text className="text-foreground-subtle text-center text-sm">
            By continuing, you agree to our{" "}
            <Text className="text-foreground-muted underline">Terms</Text>
            {" "}and{" "}
            <Text className="text-foreground-muted underline">Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
