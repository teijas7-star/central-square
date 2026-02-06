import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { colors } from "@/constants";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      {/* Background Pattern */}
      <View className="absolute inset-0">
        <LinearGradient
          colors={["transparent", colors.accent.muted + "20", "transparent"]}
          locations={[0, 0.5, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: height,
          }}
        />
        {/* Constellation dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(i * 100).duration(1000)}
            className="absolute w-1 h-1 rounded-full bg-foreground/20"
            style={{
              left: Math.random() * width,
              top: Math.random() * height * 0.6,
            }}
          />
        ))}
      </View>

      <SafeAreaView className="flex-1 justify-between px-6 py-8">
        {/* Logo & Title */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          className="items-center mt-16"
        >
          <View className="w-20 h-20 rounded-full bg-accent items-center justify-center mb-6">
            <Ionicons name="globe-outline" size={40} color={colors.background} />
          </View>
          <Text className="text-4xl font-bold text-foreground text-center font-serif">
            Central Square
          </Text>
          <Text className="text-xl text-foreground-muted text-center mt-2">
            A digital agora where communities thrive
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          entering={FadeIn.delay(600).duration(800)}
          className="my-12"
        >
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-xl bg-surface items-center justify-center mr-4">
              <Ionicons name="people" size={24} color={colors.accent.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">Join Arcades</Text>
              <Text className="text-foreground-muted text-sm">
                Find communities that match your values
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 rounded-xl bg-surface items-center justify-center mr-4">
              <Ionicons name="sparkles" size={24} color={colors.accent.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">AI Host</Text>
              <Text className="text-foreground-muted text-sm">
                Get personalized community recommendations
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-surface items-center justify-center mr-4">
              <Ionicons name="chatbubbles" size={24} color={colors.accent.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">The Square</Text>
              <Text className="text-foreground-muted text-sm">
                Discover conversations across communities
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View entering={FadeInUp.delay(800).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signin")}
            className="bg-accent rounded-full py-4 mb-4"
            activeOpacity={0.9}
          >
            <Text className="text-background font-semibold text-center text-lg">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/signin")}
            className="border border-surface-elevated rounded-full py-4"
            activeOpacity={0.8}
          >
            <Text className="text-foreground font-semibold text-center text-lg">
              I already have an account
            </Text>
          </TouchableOpacity>

          <Text className="text-foreground-subtle text-center text-xs mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
