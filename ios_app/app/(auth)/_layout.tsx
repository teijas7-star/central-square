import { Stack } from "expo-router";
import { colors } from "@/constants";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "fade",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
