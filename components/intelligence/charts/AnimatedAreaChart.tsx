"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SeriesData {
  label: string;
  data: number[];
  color: string;
}

interface AnimatedAreaChartProps {
  series: SeriesData[];
  labels: string[];
  height?: number;
  delay?: number;
}

function buildPath(
  data: number[],
  width: number,
  height: number,
  maxVal: number,
  padding: number
): string {
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const stepX = plotW / (data.length - 1);

  return data
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = padding + plotH - (v / maxVal) * plotH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  data: number[],
  width: number,
  height: number,
  maxVal: number,
  padding: number
): string {
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const stepX = plotW / (data.length - 1);

  const linePath = data
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = padding + plotH - (v / maxVal) * plotH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const lastX = padding + (data.length - 1) * stepX;
  const baseline = padding + plotH;

  return `${linePath} L${lastX},${baseline} L${padding},${baseline} Z`;
}

export function AnimatedAreaChart({
  series,
  labels,
  height = 200,
  delay = 0,
}: AnimatedAreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 500;
  const padding = 30;

  const maxVal = useMemo(
    () => Math.max(...series.flatMap((s) => s.data)) * 1.15,
    [series]
  );

  const plotW = width - padding * 2;
  const stepX = plotW / (labels.length - 1);

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
          if (idx >= 0 && idx < labels.length) {
            setHoveredIndex(idx);
          }
        }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding + (height - padding * 2) * (1 - pct);
          return (
            <line
              key={pct}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--burg-800)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Area fills */}
        {series.map((s, si) => (
          <motion.path
            key={`area-${s.label}`}
            d={buildAreaPath(s.data, width, height, maxVal, padding)}
            fill={s.color}
            opacity={0.08}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ delay: delay + si * 0.2, duration: 0.5 }}
          />
        ))}

        {/* Lines */}
        {series.map((s, si) => (
          <motion.path
            key={`line-${s.label}`}
            d={buildPath(s.data, width, height, maxVal, padding)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: delay + si * 0.2,
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Data point dots */}
        {series.map((s) =>
          s.data.map((v, i) => {
            const x = padding + i * stepX;
            const y =
              padding +
              (height - padding * 2) -
              (v / maxVal) * (height - padding * 2);
            const isHovered = hoveredIndex === i;

            return (
              <motion.circle
                key={`dot-${s.label}-${i}`}
                cx={x}
                cy={y}
                fill={s.color}
                stroke="var(--burg-900)"
                strokeWidth="2"
                initial={{ r: 0 }}
                animate={{ r: isHovered ? 5 : 3 }}
                transition={{ duration: 0.15 }}
              />
            );
          })
        )}

        {/* Hover vertical line */}
        {hoveredIndex !== null && (
          <motion.line
            x1={padding + hoveredIndex * stepX}
            y1={padding}
            x2={padding + hoveredIndex * stepX}
            y2={height - padding}
            stroke="var(--burg-600)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={label}
            x={padding + i * stepX}
            y={height - 8}
            textAnchor="middle"
            fill="var(--burg-500)"
            fontSize="10"
          >
            {label}
          </text>
        ))}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="absolute bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl z-20 pointer-events-none"
            style={{
              left: `${((padding + hoveredIndex * stepX) / width) * 100}%`,
              top: "0%",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
          >
            <p className="text-[11px] font-semibold text-[var(--cream)] mb-1">
              {labels[hoveredIndex]}
            </p>
            {series.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[10px] text-[var(--burg-300)]">
                  {s.label}: {s.data[hoveredIndex].toLocaleString()}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[10px] text-[var(--burg-400)]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
