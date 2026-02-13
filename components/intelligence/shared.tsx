"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

/* ── Animated number hook (count-up) ── */
export function useAnimatedNumber(target: number, duration = 1.2) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    if (target % 1 !== 0) {
      return v.toFixed(1);
    }
    return Math.round(v).toLocaleString();
  });

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  return display;
}

/* ── Section header with gold label ── */
export function SectionHeader({
  title,
  subtitle,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-1">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-[var(--burg-400)] font-light">{subtitle}</p>
      )}
    </motion.div>
  );
}

/* ── Shimmer sweep effect ── */
export function ShimmerSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
      style={{
        background:
          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
      }}
      animate={{ x: ["-150%", "150%"] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 2,
      }}
    />
  );
}

/* ── AI sparkle badge ── */
export function AISparkle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
      <span className="text-xs font-semibold text-[var(--gold)]">{text}</span>
    </div>
  );
}

/* ── Card wrapper with burgundy styling ── */
export function IntelligenceCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-5 relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{
        y: -2,
        borderColor: "var(--burg-700)",
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Trend pill (green/red) ── */
export function TrendPill({
  value,
  suffix = "%",
}: {
  value: number;
  suffix?: string;
}) {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        isPositive
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-red-500/15 text-red-400 border border-red-500/30"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {isPositive ? (
          <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
        ) : (
          <path d="M5 8L2 4H8L5 8Z" fill="currentColor" />
        )}
      </svg>
      {isPositive ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

/* ── Floating tooltip ── */
export function Tooltip({
  children,
  visible,
}: {
  children: React.ReactNode;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <motion.div
      className="absolute z-50 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-3 py-2 shadow-xl pointer-events-none"
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
