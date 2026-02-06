import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/constants";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  danger = false,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className="flex-row items-center py-4 px-4 bg-surface border-b border-surface-elevated"
      activeOpacity={0.7}
    >
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
          danger ? "bg-error/20" : "bg-surface-elevated"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? colors.error : colors.foreground.muted}
        />
      </View>
      <Text
        className={`flex-1 text-base ${
          danger ? "text-error" : "text-foreground"
        }`}
      >
        {label}
      </Text>
      {value && (
        <Text className="text-foreground-muted mr-2">{value}</Text>
      )}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.foreground.muted}
        />
      )}
    </TouchableOpacity>
  );
}

interface SettingToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SettingToggle({
  icon,
  label,
  description,
  value,
  onValueChange,
}: SettingToggleProps) {
  return (
    <View className="flex-row items-center py-4 px-4 bg-surface border-b border-surface-elevated">
      <View className="w-8 h-8 rounded-lg bg-surface-elevated items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color={colors.foreground.muted} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-base">{label}</Text>
        {description && (
          <Text className="text-foreground-muted text-sm mt-0.5">
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={(newValue) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange(newValue);
        }}
        trackColor={{
          false: colors.surface.elevated,
          true: colors.accent.DEFAULT,
        }}
        thumbColor={colors.foreground.DEFAULT}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert("Coming Soon", "Account deletion will be available soon.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Account
          </Text>
          <SettingItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push("/profile/edit")}
          />
          <SettingItem
            icon="mail-outline"
            label="Email"
            value="user@example.com"
            onPress={() => {}}
          />
          <SettingItem
            icon="key-outline"
            label="Change Password"
            onPress={() => {}}
          />
        </View>

        {/* Notifications Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Notifications
          </Text>
          <SettingToggle
            icon="notifications-outline"
            label="Push Notifications"
            description="Get notified about activity"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingToggle
            icon="mail-outline"
            label="Email Notifications"
            description="Weekly digest and updates"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </View>

        {/* Preferences Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Preferences
          </Text>
          <SettingToggle
            icon="moon-outline"
            label="Dark Mode"
            description="Always use dark theme"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingToggle
            icon="phone-portrait-outline"
            label="Haptic Feedback"
            description="Vibration on interactions"
            value={haptics}
            onValueChange={setHaptics}
          />
          <SettingItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </View>

        {/* AI Host Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            AI Host
          </Text>
          <SettingItem
            icon="sparkles-outline"
            label="Preferences"
            onPress={() => router.push("/(auth)/onboarding")}
          />
          <SettingItem
            icon="trash-outline"
            label="Clear Conversation History"
            onPress={() => {
              Alert.alert(
                "Clear History",
                "This will delete your AI Host conversation history.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: () => {} },
                ]
              );
            }}
          />
        </View>

        {/* Support Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Support
          </Text>
          <SettingItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
          />
          <SettingItem
            icon="chatbubble-outline"
            label="Contact Support"
            onPress={() => {}}
          />
          <SettingItem
            icon="bug-outline"
            label="Report a Bug"
            onPress={() => {}}
          />
        </View>

        {/* Legal Section */}
        <View className="mt-6">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Legal
          </Text>
          <SettingItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <SettingItem
            icon="information-circle-outline"
            label="Licenses"
            onPress={() => {}}
          />
        </View>

        {/* Danger Zone */}
        <View className="mt-6 mb-8">
          <Text className="text-foreground-muted text-sm font-medium px-4 mb-2 uppercase tracking-wide">
            Account Actions
          </Text>
          <SettingItem
            icon="log-out-outline"
            label="Sign Out"
            showChevron={false}
            danger
            onPress={handleSignOut}
          />
          <SettingItem
            icon="trash-outline"
            label="Delete Account"
            showChevron={false}
            danger
            onPress={handleDeleteAccount}
          />
        </View>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className="text-foreground-subtle text-sm">
            Central Square v1.0.0
          </Text>
          <Text className="text-foreground-subtle text-xs mt-1">
            Built with love for communities
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
