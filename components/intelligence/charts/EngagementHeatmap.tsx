"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EngagementDay } from "../mock-data";

interface EngagementHeatmapProps {
  data: EngagementDay[];
}

function getCellColor(value: number): string {
  if (value >= 90) return "var(--cream)";
  if (value >= 75) return "var(--gold)";
  if (value >= 60) return "var(--burg-500)";
  if (value >= 40) return "var(--burg-600)";
  return "var(--burg-800)";
}

export function EngagementHeatmap({ data }: EngagementHeatmapProps) {
  const [hovered, setHovered] = useState<{
    day: EngagementDay;
    row: number;
    col: number;
  } | null>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = ["This week", "Last week", "2 weeks ago", "3 weeks ago"];

  return (
    <div className="relative">
      <div className="flex gap-1">
        {/* Week labels */}
        <div className="flex flex-col gap-1 mr-1 justify-center">
          {weeks.map((w, i) => (
            <div
              key={w}
              className="h-8 flex items-center"
            >
              <span className="text-[9px] text-[var(--burg-500)] whitespace-nowrap w-16 text-right pr-2">
                {i === 0 ? "This wk" : i === 1 ? "Last wk" : `${i + 1}wk ago`}
              </span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1">
            {data.map((cell, index) => {
              const col = index % 7;
              const row = Math.floor(index / 7);
              const isHovered =
                hovered?.row === row && hovered?.col === col;

              return (
                <motion.div
                  key={`${cell.week}-${cell.day}`}
                  className="h-8 rounded-md cursor-pointer relative"
                  style={{ backgroundColor: getCellColor(cell.value) }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: isHovered ? 1.25 : 1,
                  }}
                  transition={{
                    delay: (row * 7 + col) * 0.03,
                    duration: 0.3,
                    scale: { duration: 0.15 },
                  }}
                  onHoverStart={() => setHovered({ day: cell, row, col })}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ zIndex: 10 }}
                />
              );
            })}
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {days.map((d) => (
              <span
                key={d}
                className="text-[9px] text-[var(--burg-500)] text-center"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-50 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl pointer-events-none"
            style={{
              left: `${(hovered.col / 7) * 100 + 15}%`,
              top: `${(hovered.row / 4) * 100}%`,
            }}
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.12 }}
          >
            <p className="text-[11px] font-semibold text-[var(--cream)]">
              {hovered.day.day}, Week {hovered.day.week + 1}
            </p>
            <p className="text-[10px] text-[var(--burg-300)]">
              {hovered.day.value}% engagement
            </p>
            <p className="text-[10px] text-[var(--burg-400)]">
              {hovered.day.events} events &middot; {hovered.day.posts} posts
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[9px] text-[var(--burg-500)]">Low</span>
        {[
          "var(--burg-800)",
          "var(--burg-600)",
          "var(--burg-500)",
          "var(--gold)",
          "var(--cream)",
        ].map((color, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[9px] text-[var(--burg-500)]">High</span>
      </div>
    </div>
  );
}
