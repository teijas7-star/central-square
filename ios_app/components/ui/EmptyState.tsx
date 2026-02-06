import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { colors } from "@/constants";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <View className="w-20 h-20 rounded-full bg-surface items-center justify-center mb-6">
        <Ionicons name={icon} size={40} color={colors.foreground.muted} />
      </View>
      <Text className="text-xl font-semibold text-foreground text-center mb-2">
        {title}
      </Text>
      <Text className="text-foreground-muted text-center leading-6 mb-6">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <Button variant="ghost" onPress={onSecondaryAction} className="mt-2">
          {secondaryActionLabel}
        </Button>
      )}
    </View>
  );
}

// Pre-defined empty states for common scenarios
export function EmptyFeed({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon="chatbubbles-outline"
      title="No posts yet"
      description="Join some Arcades to see posts from your communities, or explore The Square."
      actionLabel="Explore Arcades"
      onAction={onRefresh}
    />
  );
}

export function EmptyArcades({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon="people-outline"
      title="No Arcades found"
      description="Try adjusting your search or explore different categories to find communities."
      actionLabel="Clear Filters"
      onAction={onExplore}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="No activity yet"
      description="When people interact with your posts or you join Arcades, you'll see updates here."
    />
  );
}

export function EmptyMembers() {
  return (
    <EmptyState
      icon="person-outline"
      title="No members yet"
      description="Invite people to join this Arcade and start building your community."
      actionLabel="Invite Members"
    />
  );
}

export function EmptyEvents() {
  return (
    <EmptyState
      icon="calendar-outline"
      title="No upcoming events"
      description="Events will appear here when they're scheduled by Arcade hosts."
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon="search-outline"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
  );
}

export function ErrorState({
  onRetry,
  message = "Something went wrong. Please try again.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <EmptyState
      icon="alert-circle-outline"
      title="Oops!"
      description={message}
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="You're offline"
      description="Check your internet connection and try again."
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}
