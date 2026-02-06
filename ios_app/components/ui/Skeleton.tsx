import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className = "",
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      className={`bg-surface-elevated ${className}`}
      style={[
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
      ]}
    />
  );
}

// Pre-composed skeleton components
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <View className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height={16}
          className={i < lines - 1 ? "mb-2" : ""}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <View className={`bg-surface rounded-2xl p-4 border border-surface-elevated ${className}`}>
      <View className="flex-row items-center mb-3">
        <SkeletonAvatar size={40} />
        <View className="ml-3 flex-1">
          <Skeleton width="40%" height={14} className="mb-2" />
          <Skeleton width="25%" height={12} />
        </View>
      </View>
      <SkeletonText lines={2} />
      <View className="flex-row mt-4">
        <Skeleton width={60} height={24} borderRadius={12} className="mr-4" />
        <Skeleton width={60} height={24} borderRadius={12} className="mr-4" />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

export function SkeletonArcadeCard({ className = "" }: { className?: string }) {
  return (
    <View className={`bg-surface rounded-2xl p-4 border border-surface-elevated ${className}`}>
      <View className="flex-row items-start mb-3">
        <Skeleton width={48} height={48} borderRadius={12} />
        <View className="ml-3 flex-1">
          <Skeleton width="60%" height={18} className="mb-2" />
          <Skeleton width="40%" height={14} />
        </View>
      </View>
      <SkeletonText lines={2} className="mb-3" />
      <View className="flex-row">
        <Skeleton width={80} height={24} borderRadius={12} className="mr-2" />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  );
}
