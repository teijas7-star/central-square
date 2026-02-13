"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FunnelStep } from "../mock-data";

interface AnimatedFunnelProps {
  steps: FunnelStep[];
  delay?: number;
}

export function AnimatedFunnel({ steps, delay = 0 }: AnimatedFunnelProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const widthPct = 40 + (step.percentage / 100) * 60;
        const isHovered = hovered === i;
        const prevStep = i > 0 ? steps[i - 1] : null;
        const conversionRate = prevStep
          ? ((step.value / prevStep.value) * 100).toFixed(1)
          : null;

        return (
          <motion.div
            key={step.label}
            className="relative flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.12, duration: 0.4 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
          >
            {/* Step label */}
            <div className="w-24 shrink-0 text-right pr-3">
              <span className="text-[11px] text-[var(--burg-300)] font-medium">
                {step.label}
              </span>
            </div>

            {/* Bar */}
            <div className="flex-1 relative">
              <motion.div
                className="h-10 rounded-lg relative overflow-hidden cursor-pointer"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: step.color,
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${widthPct}%`,
                  y: isHovered ? -2 : 0,
                }}
                transition={{
                  width: { delay: delay + i * 0.12, duration: 0.6, ease: "easeOut" },
                  y: { duration: 0.15 },
                }}
                whileHover={{
                  boxShadow: "0 4px 16px rgba(245, 237, 224, 0.1)",
                }}
              >
                {/* Value inside bar */}
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-bold text-[var(--burg-deep)]">
                    {step.value.toLocaleString()}
                  </span>
                </div>
              </motion.div>

              {/* Conversion rate arrow */}
              <AnimatePresence>
                {isHovered && conversionRate && (
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-lg px-2 py-1 shadow-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.12 }}
                  >
                    <span className="text-[10px] text-[var(--gold)] font-semibold">
                      {conversionRate}% conversion
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Percentage */}
            <div className="w-14 shrink-0 text-right">
              <span className="text-[11px] text-[var(--burg-400)] font-medium">
                {step.percentage}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
