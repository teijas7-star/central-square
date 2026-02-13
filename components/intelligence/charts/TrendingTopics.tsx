"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TrendingTopic } from "../mock-data";

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  delay?: number;
}

function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.6) return "var(--cs-success)";
  if (sentiment >= 0.2) return "var(--gold)";
  if (sentiment >= -0.2) return "var(--burg-400)";
  return "var(--cs-error)";
}

function getVolumeSize(volume: number): string {
  if (volume >= 8) return "text-base px-4 py-2";
  if (volume >= 6) return "text-sm px-3 py-1.5";
  if (volume >= 4) return "text-xs px-2.5 py-1";
  return "text-[11px] px-2 py-0.5";
}

export function TrendingTopics({ topics, delay = 0 }: TrendingTopicsProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, i) => {
          const isHovered = hovered === topic.id;
          const sentimentColor = getSentimentColor(topic.sentiment);

          return (
            <motion.div
              key={topic.id}
              className="relative"
              onHoverStart={() => setHovered(topic.id)}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.span
                className={`inline-flex items-center gap-1.5 rounded-full border cursor-pointer font-medium ${getVolumeSize(
                  topic.volume
                )}`}
                style={{
                  borderColor: isHovered ? sentimentColor : "var(--burg-800)",
                  backgroundColor: isHovered
                    ? "var(--burg-800)"
                    : "var(--burg-900)",
                  color: isHovered ? "var(--cream)" : "var(--burg-300)",
                }}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  x: (Math.random() - 0.5) * 30,
                  y: (Math.random() - 0.5) * 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: isHovered ? -3 : 0,
                }}
                transition={{
                  delay: delay + i * 0.04,
                  duration: 0.4,
                  y: { duration: 0.15 },
                }}
                whileHover={{
                  boxShadow: `0 4px 16px ${sentimentColor}20`,
                }}
              >
                {/* Velocity indicator */}
                {topic.velocity > 50 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 2L8 6H2L5 2Z" fill={sentimentColor} />
                  </svg>
                )}
                {topic.label}
              </motion.span>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl z-30 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <p className="text-[11px] font-semibold text-[var(--cream)]">
                      {topic.label}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[var(--burg-400)]">
                        Volume: {topic.volume}/10
                      </span>
                      <span className="text-[10px]" style={{ color: sentimentColor }}>
                        Sentiment: {topic.sentiment > 0 ? "+" : ""}
                        {topic.sentiment.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-[var(--burg-400)]">
                        {topic.category}
                      </span>
                      <span className="text-[10px] text-[var(--burg-500)]">
                        &middot;
                      </span>
                      <span className="text-[10px] text-[var(--gold)]">
                        {topic.velocity}% velocity
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
