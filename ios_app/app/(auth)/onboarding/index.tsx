import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants";

const { width } = Dimensions.get("window");

// Interest categories
const INTERESTS = [
  { id: "civic", label: "Civic Engagement", icon: "people" as const },
  { id: "tech", label: "Technology", icon: "code-slash" as const },
  { id: "design", label: "Design", icon: "color-palette" as const },
  { id: "education", label: "Education", icon: "school" as const },
  { id: "environment", label: "Environment", icon: "leaf" as const },
  { id: "health", label: "Health & Wellness", icon: "fitness" as const },
  { id: "arts", label: "Arts & Culture", icon: "brush" as const },
  { id: "business", label: "Business", icon: "briefcase" as const },
  { id: "social", label: "Social Impact", icon: "heart" as const },
  { id: "science", label: "Science", icon: "flask" as const },
  { id: "local", label: "Local Community", icon: "location" as const },
  { id: "global", label: "Global Issues", icon: "globe" as const },
];

// Values/goals
const VALUES = [
  { id: "connect", label: "Connect with like-minded people", icon: "people-circle" as const },
  { id: "learn", label: "Learn new skills", icon: "bulb" as const },
  { id: "lead", label: "Lead a community", icon: "flag" as const },
  { id: "contribute", label: "Contribute to causes", icon: "hand-left" as const },
  { id: "network", label: "Professional networking", icon: "git-network" as const },
  { id: "local", label: "Improve my local area", icon: "home" as const },
];

type Step = "interests" | "values" | "complete";

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("interests");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleValue = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === "interests") {
      setStep("values");
    } else if (step === "values") {
      setStep("complete");
    }
  };

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Save preferences to API
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  const canProceed =
    step === "interests"
      ? selectedInterests.length >= 2
      : step === "values"
      ? selectedValues.length >= 1
      : true;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={handleSkip} className="py-2">
          <Text className="text-foreground-muted">Skip</Text>
        </TouchableOpacity>

        {/* Progress Dots */}
        <View className="flex-row items-center">
          {(["interests", "values", "complete"] as Step[]).map((s, index) => (
            <View
              key={s}
              className={`w-2 h-2 rounded-full mx-1 ${
                step === s
                  ? "bg-accent"
                  : index < ["interests", "values", "complete"].indexOf(step)
                  ? "bg-accent/50"
                  : "bg-surface-elevated"
              }`}
            />
          ))}
        </View>

        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1">
        {step === "interests" && (
          <Animated.View
            entering={FadeIn}
            exiting={SlideOutLeft}
            className="flex-1"
          >
            <View className="px-6 mb-6">
              <Text className="text-3xl font-bold text-foreground font-serif mb-2">
                What interests you?
              </Text>
              <Text className="text-foreground-muted text-lg">
                Select at least 2 topics to help us find the right communities for you
              </Text>
            </View>

            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View className="flex-row flex-wrap">
                {INTERESTS.map((interest, index) => (
                  <Animated.View
                    key={interest.id}
                    entering={FadeInUp.delay(index * 50)}
                    style={{ width: (width - 48) / 2 }}
                    className="p-1"
                  >
                    <TouchableOpacity
                      onPress={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-xl border ${
                        selectedInterests.includes(interest.id)
                          ? "bg-accent/20 border-accent"
                          : "bg-surface border-surface-elevated"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={interest.icon}
                        size={24}
                        color={
                          selectedInterests.includes(interest.id)
                            ? colors.accent.DEFAULT
                            : colors.foreground.muted
                        }
                      />
                      <Text
                        className={`mt-2 font-medium ${
                          selectedInterests.includes(interest.id)
                            ? "text-foreground"
                            : "text-foreground-muted"
                        }`}
                      >
                        {interest.label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {step === "values" && (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            className="flex-1"
          >
            <View className="px-6 mb-6">
              <Text className="text-3xl font-bold text-foreground font-serif mb-2">
                What brings you here?
              </Text>
              <Text className="text-foreground-muted text-lg">
                Select what you're hoping to achieve
              </Text>
            </View>

            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {VALUES.map((value, index) => (
                <Animated.View
                  key={value.id}
                  entering={FadeInUp.delay(index * 50)}
                >
                  <TouchableOpacity
                    onPress={() => toggleValue(value.id)}
                    className={`flex-row items-center p-4 rounded-xl border mb-3 ${
                      selectedValues.includes(value.id)
                        ? "bg-accent/20 border-accent"
                        : "bg-surface border-surface-elevated"
                    }`}
                    activeOpacity={0.8}
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        selectedValues.includes(value.id)
                          ? "bg-accent/30"
                          : "bg-surface-elevated"
                      }`}
                    >
                      <Ionicons
                        name={value.icon}
                        size={24}
                        color={
                          selectedValues.includes(value.id)
                            ? colors.accent.DEFAULT
                            : colors.foreground.muted
                        }
                      />
                    </View>
                    <Text
                      className={`flex-1 ml-4 text-lg ${
                        selectedValues.includes(value.id)
                          ? "text-foreground font-medium"
                          : "text-foreground-muted"
                      }`}
                    >
                      {value.label}
                    </Text>
                    {selectedValues.includes(value.id) && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.accent.DEFAULT} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {step === "complete" && (
          <Animated.View
            entering={SlideInRight}
            className="flex-1 items-center justify-center px-6"
          >
            <Animated.View
              entering={FadeIn.delay(200)}
              className="w-24 h-24 rounded-full bg-accent/20 items-center justify-center mb-8"
            >
              <Ionicons name="checkmark-circle" size={64} color={colors.accent.DEFAULT} />
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(300)}
              className="text-3xl font-bold text-foreground text-center font-serif mb-4"
            >
              You're all set!
            </Animated.Text>

            <Animated.Text
              entering={FadeInUp.delay(400)}
              className="text-foreground-muted text-lg text-center mb-8"
            >
              Your AI Host will use your preferences to recommend communities that match your interests
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(500)} className="w-full">
              <Button onPress={handleComplete} fullWidth size="lg">
                Explore Central Square
              </Button>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Action */}
      {step !== "complete" && (
        <View className="px-6 pb-6">
          <Button
            onPress={handleNext}
            disabled={!canProceed}
            fullWidth
            size="lg"
          >
            {step === "interests"
              ? `Continue (${selectedInterests.length}/2 minimum)`
              : "Continue"}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
