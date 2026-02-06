import { Stack } from "expo-router";
import { colors } from "@/constants";

export default function ArcadeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface.DEFAULT,
        },
        headerTintColor: colors.foreground.DEFAULT,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="compose"
        options={{
          title: "New Post",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="members"
        options={{
          title: "Members",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Arcade Settings",
        }}
      />
    </Stack>
  );
}
