"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SentimentPoint } from "../mock-data";

interface SentimentTimelineProps {
  data: SentimentPoint[];
  height?: number;
  delay?: number;
}

export function SentimentTimeline({
  data,
  height = 180,
  delay = 0,
}: SentimentTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 500;
  const padding = 30;
  const plotH = height - padding * 2;
  const plotW = width - padding * 2;
  const stepX = plotW / (data.length - 1);
  const baseline = padding + plotH / 2;

  // Build positive area (above baseline)
  const posPath = useMemo(() => {
    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = baseline - d.overall * (plotH / 2);
      return { x, y: Math.min(y, baseline) };
    });
    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ");
    return `${line} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;
  }, [data, stepX, baseline, plotH, padding]);

  // Build negative area (below baseline)
  const negPath = useMemo(() => {
    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = baseline - d.overall * (plotH / 2);
      return { x, y: Math.max(y, baseline) };
    });
    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ");
    return `${line} L${points[points.length - 1].x},${baseline} L${points[0].x},${baseline} Z`;
  }, [data, stepX, baseline, plotH, padding]);

  // Build main line
  const linePath = useMemo(() => {
    return data
      .map((d, i) => {
        const x = padding + i * stepX;
        const y = baseline - d.overall * (plotH / 2);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [data, stepX, baseline, plotH, padding]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        onMouseLeave={() => setHoveredIndex(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * width;
          const idx = Math.round((x - padding) / stepX);
          if (idx >= 0 && idx < data.length) {
            setHoveredIndex(idx);
          }
        }}
      >
        {/* Baseline */}
        <line
          x1={padding}
          y1={baseline}
          x2={width - padding}
          y2={baseline}
          stroke="var(--burg-700)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Y-axis labels */}
        <text x={padding - 5} y={padding + 4} textAnchor="end" fill="var(--burg-500)" fontSize="9">
          +1.0
        </text>
        <text x={padding - 5} y={baseline + 3} textAnchor="end" fill="var(--burg-500)" fontSize="9">
          0
        </text>
        <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="var(--burg-500)" fontSize="9">
          -1.0
        </text>

        {/* Positive area */}
        <motion.path
          d={posPath}
          fill="var(--cs-success)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay, duration: 0.5 }}
        />

        {/* Negative area */}
        <motion.path
          d={negPath}
          fill="var(--cs-error)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay, duration: 0.5 }}
        />

        {/* Main line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--cream)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.2, duration: 1.5, ease: "easeInOut" }}
        />

        {/* Hover vertical line */}
        {hoveredIndex !== null && (
          <line
            x1={padding + hoveredIndex * stepX}
            y1={padding}
            x2={padding + hoveredIndex * stepX}
            y2={height - padding}
            stroke="var(--burg-600)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Data point */}
        {hoveredIndex !== null && (
          <motion.circle
            cx={padding + hoveredIndex * stepX}
            cy={baseline - data[hoveredIndex].overall * (plotH / 2)}
            r="4"
            fill="var(--cream)"
            stroke="var(--burg-900)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}

        {/* X-axis labels (every 5th) */}
        {data.map(
          (d, i) =>
            i % 5 === 0 && (
              <text
                key={i}
                x={padding + i * stepX}
                y={height - 8}
                textAnchor="middle"
                fill="var(--burg-500)"
                fontSize="9"
              >
                {d.date}
              </text>
            )
        )}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="absolute bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl z-20 pointer-events-none"
            style={{
              left: `${((padding + hoveredIndex * stepX) / width) * 100}%`,
              top: "5%",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
          >
            <p className="text-[11px] font-semibold text-[var(--cream)]">
              {data[hoveredIndex].date}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-emerald-400">
                +{data[hoveredIndex].positive.toFixed(2)}
              </span>
              <span className="text-[10px] text-red-400">
                -{data[hoveredIndex].negative.toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] text-[var(--burg-300)] mt-0.5">
              Overall: {data[hoveredIndex].overall > 0 ? "+" : ""}
              {data[hoveredIndex].overall.toFixed(2)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          <span className="text-[10px] text-[var(--burg-400)]">Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
          <span className="text-[10px] text-[var(--burg-400)]">Negative</span>
        </div>
      </div>
    </div>
  );
}
