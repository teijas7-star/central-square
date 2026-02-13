"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useAnimatedNumber, TrendPill } from "../shared";

interface MetricCardProps {
  label: string;
  value: number;
  trend: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  trendSuffix?: string;
  index?: number;
}

export function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  prefix = "",
  suffix = "",
  trendSuffix = "%",
  index = 0,
}: MetricCardProps) {
  const display = useAnimatedNumber(value);

  return (
    <motion.div
      className="bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{
        y: -3,
        borderColor: "var(--burg-700)",
        boxShadow: "0 8px 24px rgba(245, 237, 224, 0.06)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--burg-800)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--burg-400)]" />
        </div>
        <TrendPill value={trend} suffix={trendSuffix} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        {prefix && (
          <span className="text-lg font-semibold text-[var(--burg-300)]">
            {prefix}
          </span>
        )}
        <motion.span className="text-3xl font-bold text-[var(--cream)]">
          {display}
        </motion.span>
        {suffix && (
          <span className="text-lg font-semibold text-[var(--burg-300)]">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm text-[var(--burg-400)] mt-1">{label}</p>
    </motion.div>
  );
}
