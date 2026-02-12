"use client";

import { motion } from "framer-motion";

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            background:
              i === current
                ? "var(--cs-orange-500)"
                : i < current
                  ? "var(--cs-orange-300)"
                  : "var(--cs-gray-200)",
          }}
          animate={{
            width: i === current ? 24 : 8,
            height: 8,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
