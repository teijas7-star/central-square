"use client";

import { motion } from "framer-motion";

interface AIHostAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  speaking?: boolean;
  listening?: boolean;
}

const sizes = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export function AIHostAvatar({
  size = "md",
  speaking = false,
  listening = false,
}: AIHostAvatarProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pulse rings when speaking/listening */}
      {(speaking || listening) && (
        <>
          <div
            className={`absolute ${sizes[size]} rounded-full animate-voice-ring`}
            style={{
              background: listening
                ? "rgba(74, 144, 226, 0.2)"
                : "rgba(255, 107, 53, 0.2)",
            }}
          />
          <div
            className={`absolute ${sizes[size]} rounded-full animate-voice-ring`}
            style={{
              background: listening
                ? "rgba(74, 144, 226, 0.15)"
                : "rgba(255, 107, 53, 0.15)",
              animationDelay: "0.5s",
            }}
          />
        </>
      )}

      {/* Main avatar */}
      <motion.div
        className={`${sizes[size]} rounded-full relative overflow-hidden ${
          speaking || listening ? "animate-ai-glow" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #FF6B35, #4A90E2)",
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
        {/* Inner icon - abstract "CS" mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            className="w-3/5 h-3/5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Abstract square/community symbol */}
            <rect
              x="8"
              y="8"
              width="10"
              height="10"
              rx="3"
              fill="white"
              opacity="0.9"
            />
            <rect
              x="22"
              y="8"
              width="10"
              height="10"
              rx="3"
              fill="white"
              opacity="0.7"
            />
            <rect
              x="8"
              y="22"
              width="10"
              height="10"
              rx="3"
              fill="white"
              opacity="0.7"
            />
            <rect
              x="22"
              y="22"
              width="10"
              height="10"
              rx="3"
              fill="white"
              opacity="0.5"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
