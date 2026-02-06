import { useState, useRef, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/constants";

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp, signInWithEmail } = useAuthStore();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Auto-verify when code is complete
    if (code.length === CODE_LENGTH) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH || !email) return;

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { error } = await verifyOtp(email, code);

      if (error) {
        Alert.alert("Invalid code", "Please check the code and try again.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode("");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Navigate to onboarding or main app
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await signInWithEmail(email);
      setResendCooldown(60);
      Alert.alert("Code sent", "We've sent a new code to your email.");
    } catch (error) {
      Alert.alert("Error", "Failed to resend code. Please try again.");
    }
  };

  const handleCodeChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(cleaned);
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
            Check your email
          </Text>
          <Text className="text-foreground-muted text-lg mb-2">
            We sent a verification code to
          </Text>
          <Text className="text-accent text-lg font-medium mb-8">
            {email}
          </Text>

          {/* Code Input */}
          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}
          >
            <View className="flex-row justify-between mb-8">
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <View
                  key={index}
                  className={`w-12 h-14 rounded-xl items-center justify-center ${
                    code.length === index
                      ? "border-2 border-accent bg-surface"
                      : code.length > index
                      ? "bg-surface border-2 border-surface-elevated"
                      : "bg-surface border border-surface-elevated"
                  }`}
                >
                  <Text className="text-foreground text-2xl font-semibold">
                    {code[index] || ""}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* Hidden input for keyboard */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            autoFocus
            style={{ position: "absolute", opacity: 0 }}
            maxLength={CODE_LENGTH}
          />

          {/* Resend Button */}
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendCooldown > 0}
            className="py-4"
          >
            <Text className="text-center text-foreground-muted">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <Text className="text-foreground-subtle">
                  Resend in {resendCooldown}s
                </Text>
              ) : (
                <Text className="text-accent font-medium">Resend</Text>
              )}
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={code.length !== CODE_LENGTH || isLoading}
            className={`rounded-full py-4 mt-4 ${
              code.length === CODE_LENGTH && !isLoading
                ? "bg-accent"
                : "bg-surface"
            }`}
            activeOpacity={0.9}
          >
            <Text
              className={`font-semibold text-center text-lg ${
                code.length === CODE_LENGTH && !isLoading
                  ? "text-background"
                  : "text-foreground-subtle"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="mail-outline"
              size={16}
              color={colors.foreground.subtle}
            />
            <Text className="text-foreground-subtle text-sm ml-2">
              Check your spam folder if you don't see the email
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
