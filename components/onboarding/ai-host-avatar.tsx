"use client";

import { motion } from "framer-motion";
import { BreathingNetworkLogo } from "../CSLogos/animated-logos";

interface AIHostAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  speaking?: boolean;
  listening?: boolean;
}

const sizeConfig = {
  sm: { container: "w-10 h-10", logo: 28 },
  md: { container: "w-16 h-16", logo: 44 },
  lg: { container: "w-24 h-24", logo: 64 },
  xl: { container: "w-32 h-32", logo: 88 },
};

export function AIHostAvatar({
  size = "md",
  speaking = false,
  listening = false,
}: AIHostAvatarProps) {
  const { container, logo } = sizeConfig[size];

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pulse rings when speaking/listening */}
      {(speaking || listening) && (
        <>
          <div
            className={`absolute ${container} rounded-full animate-voice-ring`}
            style={{
              background: listening
                ? "rgba(245, 237, 224, 0.1)"
                : "rgba(245, 237, 224, 0.08)",
            }}
          />
          <div
            className={`absolute ${container} rounded-full animate-voice-ring`}
            style={{
              background: listening
                ? "rgba(245, 237, 224, 0.06)"
                : "rgba(245, 237, 224, 0.04)",
              animationDelay: "0.5s",
            }}
          />
        </>
      )}

      {/* Main avatar — dark circle with BreathingNetworkLogo */}
      <motion.div
        className={`${container} rounded-full relative flex items-center justify-center bg-[var(--burg-900)] border border-[var(--burg-800)] overflow-hidden`}
        style={{
          boxShadow:
            speaking || listening
              ? "0 0 24px rgba(245, 237, 224, 0.15)"
              : "0 4px 12px rgba(0, 0, 0, 0.25)",
        }}
        animate={
          speaking
            ? { scale: [1, 1.05, 1] }
            : listening
              ? { scale: [1, 1.02, 1] }
              : {}
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="text-[var(--cream)]">
          <BreathingNetworkLogo size={logo} />
        </div>
      </motion.div>
    </div>
  );
}
