"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { HealthMetric } from "../mock-data";

interface AnimatedRadialScoreProps {
  score: number;
  trend: number;
  breakdown: HealthMetric[];
  size?: number;
}

export function AnimatedRadialScore({
  score,
  trend,
  breakdown,
  size = 200,
}: AnimatedRadialScoreProps) {
  const [hovered, setHovered] = useState(false);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animated score count-up
  const scoreMotion = useMotionValue(0);
  const scoreSpring = useSpring(scoreMotion, { stiffness: 40, damping: 20 });
  const scoreDisplay = useTransform(scoreSpring, (v) => Math.round(v));

  useEffect(() => {
    scoreMotion.set(score);
  }, [score, scoreMotion]);

  // Animated arc
  const arcProgress = useMotionValue(0);
  const arcSpring = useSpring(arcProgress, { stiffness: 30, damping: 18 });
  const dashOffset = useTransform(
    arcSpring,
    (v) => circumference - (circumference * v) / 100
  );

  useEffect(() => {
    arcProgress.set(score);
  }, [score, arcProgress]);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--burg-800)"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--cream)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Gold accent glow */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          opacity={0.3}
          filter="blur(4px)"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-bold text-[var(--cream)]">
          {scoreDisplay}
        </motion.span>
        <span className="text-xs text-[var(--burg-400)] mt-0.5">/ 100</span>
        <div className="flex items-center gap-1 mt-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2L8 6H2L5 2Z" fill="#22c55e" />
          </svg>
          <span className="text-[11px] font-semibold text-emerald-400">
            +{trend}%
          </span>
        </div>
      </div>

      {/* Hover breakdown */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl p-3 shadow-xl z-20 min-w-[180px]"
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-[10px] font-semibold text-[var(--gold)] uppercase tracking-wider mb-2">
              Health Breakdown
            </p>
            <div className="space-y-2">
              {breakdown.map((metric) => (
                <div key={metric.label} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-[var(--burg-300)]">
                        {metric.label}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--cream)]">
                        {metric.value}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--burg-700)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: metric.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
