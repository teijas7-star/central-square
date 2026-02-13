"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { RevenueSegment } from "../mock-data";

interface AnimatedDonutProps {
  segments: RevenueSegment[];
  total: number;
  totalLabel?: string;
  size?: number;
  delay?: number;
}

const SEGMENT_COLORS = [
  "var(--cream)",
  "var(--gold)",
  "var(--burg-400)",
  "var(--burg-300)",
];

export function AnimatedDonut({
  segments,
  total,
  totalLabel = "Total Revenue",
  size = 200,
  delay = 0,
}: AnimatedDonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const radius = (size - 40) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animated total count-up
  const totalMotion = useMotionValue(0);
  const totalSpring = useSpring(totalMotion, { stiffness: 40, damping: 20 });
  const totalDisplay = useTransform(totalSpring, (v) =>
    `$${Math.round(v).toLocaleString()}`
  );
  useEffect(() => {
    totalMotion.set(total);
  }, [total, totalMotion]);

  let cumulativePercentage = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--burg-800)"
            strokeWidth="20"
          />

          {/* Segments */}
          {segments.map((seg, i) => {
            const dashLength = (seg.percentage / 100) * circumference;
            const gapLength = circumference - dashLength;
            const offset = -(cumulativePercentage / 100) * circumference;
            cumulativePercentage += seg.percentage;
            const isHovered = hoveredIndex === i;

            return (
              <motion.circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                strokeWidth={isHovered ? 24 : 20}
                strokeDasharray={`${dashLength} ${gapLength}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                className="cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + i * 0.15, duration: 0.5 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null ? (
              <motion.div
                key={`seg-${hoveredIndex}`}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-2xl font-bold text-[var(--cream)] block">
                  ${segments[hoveredIndex].value.toLocaleString()}
                </span>
                <span className="text-[11px] text-[var(--burg-300)] block mt-0.5">
                  {segments[hoveredIndex].label}
                </span>
                <span className="text-[10px] text-[var(--burg-400)]">
                  {segments[hoveredIndex].percentage}%
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="total"
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <motion.span className="text-2xl font-bold text-[var(--cream)] block">
                  {totalDisplay}
                </motion.span>
                <span className="text-[10px] text-[var(--burg-400)] block mt-0.5">
                  {totalLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="flex items-center gap-1.5 cursor-pointer"
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ x: 3 }}
          >
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
            />
            <span className="text-[10px] text-[var(--burg-300)] truncate">
              {seg.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
