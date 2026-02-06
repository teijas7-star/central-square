import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, layout } from "@/constants";

type IconName = keyof typeof Ionicons.glyphMap;

function TabBarIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  return (
    <View className="items-center justify-center">
      <Ionicons
        name={name}
        size={focused ? 26 : 24}
        color={color}
      />
      {focused && (
        <View className="w-1 h-1 rounded-full bg-accent mt-1" />
      )}
    </View>
  );
}

export default function TabLayout() {
  const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.DEFAULT,
        tabBarInactiveTintColor: colors.foreground.muted,
        tabBarStyle: {
          backgroundColor: colors.surface.DEFAULT,
          borderTopColor: colors.surface.elevated,
          borderTopWidth: 1,
          height: layout.tabBarHeight,
          paddingBottom: layout.tabBarPadding,
          paddingTop: layout.tabBarPadding,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.surface.DEFAULT,
        },
        headerTintColor: colors.foreground.DEFAULT,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "compass" : "compass-outline"} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "add-circle" : "add-circle-outline"} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "notifications" : "notifications-outline"} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tabs>
  );
}
