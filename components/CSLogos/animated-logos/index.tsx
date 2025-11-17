import React from "react";
import { motion } from "framer-motion";
import { BrandMotion } from "../BrandMotionSystem";

// Animated Logo Components
export function AnimatedRootsLogo({
  size = 64,
}: {
  size?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      {/* Central hub - appears first */}
      <motion.circle
        cx="32"
        cy="32"
        r="6"
        fill="currentColor"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: BrandMotion.timing.normal,
              ease: BrandMotion.easing.rootGrowth,
            },
          },
        }}
      />

      {/* Main roots - grow outward like organic roots */}
      <motion.path
        d="M32 26 Q32 20 32 10 Q30 8 28 6"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: BrandMotion.timing.slowest,
              delay: BrandMotion.timing.normal,
              ease: BrandMotion.easing.rootGrowth,
            },
          },
        }}
      />

      <motion.path
        d="M38 32 Q44 32 54 32 Q56 30 58 28"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: BrandMotion.timing.slowest,
              delay: BrandMotion.timing.slow,
              ease: BrandMotion.easing.rootGrowth,
            },
          },
        }}
      />

      <motion.path
        d="M32 38 Q32 44 32 54 Q34 56 36 58"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: BrandMotion.timing.slowest,
              delay: BrandMotion.timing.slowest,
              ease: BrandMotion.easing.rootGrowth,
            },
          },
        }}
      />

      <motion.path
        d="M26 32 Q20 32 10 32 Q8 34 6 36"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: BrandMotion.timing.slowest,
              delay:
                BrandMotion.timing.slowest +
                BrandMotion.timing.normal,
              ease: BrandMotion.easing.rootGrowth,
            },
          },
        }}
      />

      {/* Secondary branching roots */}
      <motion.path
        d="M44 20 Q48 16 52 12"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.7,
            transition: {
              duration: BrandMotion.timing.slow,
              delay:
                BrandMotion.timing.slowest +
                BrandMotion.timing.normal +
                BrandMotion.stagger.normal,
              ease: BrandMotion.easing.connection,
            },
          },
        }}
      />

      <motion.path
        d="M44 44 Q48 48 52 52"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.7,
            transition: {
              duration: BrandMotion.timing.slow,
              delay:
                BrandMotion.timing.slowest +
                BrandMotion.timing.slow +
                BrandMotion.stagger.normal,
              ease: BrandMotion.easing.connection,
            },
          },
        }}
      />

      <motion.path
        d="M20 44 Q16 48 12 52"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.7,
            transition: {
              duration: BrandMotion.timing.slow,
              delay:
                BrandMotion.timing.slowest +
                BrandMotion.timing.slow +
                BrandMotion.stagger.loose,
              ease: BrandMotion.easing.connection,
            },
          },
        }}
      />

      <motion.path
        d="M20 20 Q16 16 12 12"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.7,
            transition: {
              duration: BrandMotion.timing.slow,
              delay:
                BrandMotion.timing.slowest * 2 +
                BrandMotion.stagger.loose,
              ease: BrandMotion.easing.connection,
            },
          },
        }}
      />
    </motion.svg>
  );
}

export function SequentialBloomLogo({
  size = 64,
}: {
  size?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      animate={{
        rotate: [0, 360],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        },
      }}
    >
      {/* Central hub */}
      <motion.circle
        cx="32"
        cy="32"
        r="6"
        fill="currentColor"
        animate={{
          scale: [1, 1.2, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Roots that bloom sequentially */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(
        (angle, index) => (
          <motion.g
            key={angle}
            style={{ transformOrigin: "32px 32px" }}
          >
            <motion.path
              d="M32 32 Q32 20 32 8 Q30 6 28 4"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "32px 32px",
              }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0.3],
                transition: {
                  duration: 3,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.g>
        ),
      )}
    </motion.svg>
  );
}

export function PulseGrowLogo({
  size = 64,
}: {
  size?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      {/* Central hub with pulse */}
      <motion.circle
        cx="32"
        cy="32"
        r="6"
        fill="currentColor"
        animate={{
          scale: [1, 1.3, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Pulse rings */}
      <motion.circle
        cx="32"
        cy="32"
        r="12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        animate={{
          scale: [0.5, 2],
          opacity: [0.8, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          },
        }}
      />

      {/* Growing roots */}
      <motion.path
        d="M32 26 L32 8 Q30 6 28 4"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{
          pathLength: [0.3, 1, 0.3],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.path
        d="M38 32 L56 32 Q58 30 60 28"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{
          pathLength: [0.3, 1, 0.3],
          transition: {
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.path
        d="M32 38 L32 56 Q34 58 36 60"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{
          pathLength: [0.3, 1, 0.3],
          transition: {
            duration: 3,
            delay: 1.0,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.path
        d="M26 32 L8 32 Q6 34 4 36"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{
          pathLength: [0.3, 1, 0.3],
          transition: {
            duration: 3,
            delay: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
    </motion.svg>
  );
}

export function BreathingNetworkLogo({
  size = 64,
}: {
  size?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      {/* Central hub */}
      <motion.circle
        cx="32"
        cy="32"
        r="6"
        fill="currentColor"
        animate={{
          scale: [1, 1.1, 1],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Breathing root network */}
      <motion.g
        animate={{
          scale: [0.95, 1.05, 0.95],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        style={{ transformOrigin: "32px 32px" }}
      >
        <motion.path
          d="M32 26 Q32 18 32 10 Q30 8 28 6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M38 32 Q46 32 54 32 Q56 30 58 28"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 4,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M32 38 Q32 46 32 54 Q34 56 36 58"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 4,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M26 32 Q18 32 10 32 Q8 34 6 36"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 4,
              delay: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Diagonal branches */}
        <motion.path
          d="M44 20 Q48 16 52 12"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            transition: {
              duration: 4,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M44 44 Q48 48 52 52"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            transition: {
              duration: 4,
              delay: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M20 44 Q16 48 12 52"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            transition: {
              duration: 4,
              delay: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        <motion.path
          d="M20 20 Q16 16 12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            transition: {
              duration: 4,
              delay: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </motion.g>
    </motion.svg>
  );
}