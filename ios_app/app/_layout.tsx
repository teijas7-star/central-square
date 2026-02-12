import "../global.css";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/constants";

// Prevent splash screen from auto-hiding (native only)
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    // Initialize auth state on app load
    const initApp = async () => {
      await initialize();
      if (Platform.OS !== "web") {
        await SplashScreen.hideAsync();
      }
    };
    initApp();

    // Force show app after 2 seconds regardless of auth state (for development)
    const timer = setTimeout(() => {
      setForceShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [initialize]);

  if (isLoading && !forceShow) {
    // Show loading screen (visible on web, splash screen on native)
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text style={{
          color: colors.accent.DEFAULT,
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20
        }}>
          Central Square
        </Text>
        <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
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
          {/* Auth screens */}
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />

          {/* Main tab navigator */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Arcade detail */}
          <Stack.Screen
            name="arcade/[id]"
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />

          {/* Post detail */}
          <Stack.Screen
            name="post/[id]"
            options={{
              title: "Post",
              presentation: "card",
            }}
          />

          {/* AI Host */}
          <Stack.Screen
            name="ai-host"
            options={{
              title: "AI Host",
              presentation: "modal",
              headerStyle: {
                backgroundColor: colors.surface.DEFAULT,
              },
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
