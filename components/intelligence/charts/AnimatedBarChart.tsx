"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Horizontal Bar Chart (for benchmarks) ── */

interface HorizontalBarData {
  label: string;
  bars: { value: number; maxValue: number; label: string; color: string }[];
  unit: string;
}

export function HorizontalBarChart({
  data,
  delay = 0,
}: {
  data: HorizontalBarData[];
  delay?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.08 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-[var(--burg-300)] font-medium">
              {item.label}
            </span>
            <span className="text-[10px] text-[var(--burg-400)]">
              {item.bars[0].value}
              {item.unit}
            </span>
          </div>
          <div
            className="space-y-1"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.bars.map((bar, bi) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="text-[9px] text-[var(--burg-500)] w-12 text-right shrink-0">
                  {bar.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--burg-800)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: bar.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(bar.value / bar.maxValue) * 100}%`,
                    }}
                    transition={{
                      delay: delay + i * 0.08 + bi * 0.05,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Vertical Bar Chart (for campaigns / general) ── */

interface VerticalBarData {
  label: string;
  value: number;
  color?: string;
  detail?: Record<string, string | number>;
}

export function VerticalBarChart({
  data,
  maxValue,
  height = 160,
  delay = 0,
}: {
  data: VerticalBarData[];
  maxValue?: number;
  height?: number;
  delay?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="relative">
      <div
        className="flex items-end gap-2"
        style={{ height }}
      >
        {data.map((item, i) => {
          const barHeight = (item.value / max) * 100;
          const isHovered = hovered === i;

          return (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && item.detail && (
                  <motion.div
                    className="absolute bottom-full mb-2 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl z-20 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    <p className="text-[11px] font-semibold text-[var(--cream)] mb-1">
                      {item.label}
                    </p>
                    {Object.entries(item.detail).map(([key, val]) => (
                      <p key={key} className="text-[10px] text-[var(--burg-300)]">
                        {key}: {typeof val === "number" ? val.toLocaleString() : val}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="w-full rounded-t-md cursor-pointer"
                style={{
                  backgroundColor: item.color || "var(--cream)",
                }}
                initial={{ height: 0 }}
                animate={{
                  height: `${isHovered ? Math.min(barHeight + 8, 100) : barHeight}%`,
                }}
                transition={{
                  delay: delay + i * 0.06,
                  duration: 0.5,
                  ease: "easeOut",
                  height: isHovered
                    ? { duration: 0.15, ease: "easeOut" }
                    : { delay: delay + i * 0.06, duration: 0.5 },
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-2 mt-2">
        {data.map((item) => (
          <div key={item.label} className="flex-1 text-center">
            <span className="text-[9px] text-[var(--burg-500)] leading-tight block truncate">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
