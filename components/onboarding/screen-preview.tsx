"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenPreviewProps {
  onBack: () => void;
  onContinue: () => void;
}

/* Parallax tilt card for the entire preview */
function ParallaxCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof motion.div>, "style">) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* Shimmer sweep effect */
function ShimmerSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
      }}
      animate={{ x: ["-150%", "150%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
    />
  );
}

/* Empty-state radial health ring (Whoop-inspired) */
function EmptyHealthRing() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progressPct = 12;
  const dashOffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-2">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background dashed ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--burg-800)"
            strokeWidth="6"
            strokeDasharray="6 4"
          />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--cream)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-lg font-bold text-[var(--burg-500)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            —
          </motion.span>
          <span className="text-[9px] text-[var(--burg-500)]">/ 100</span>
        </div>
      </div>
    </div>
  );
}

export function ScreenPreview({ onBack, onContinue }: ScreenPreviewProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = [
    { icon: Activity, label: "Health", active: true },
    { icon: Bot, label: "Bots", active: false },
    { icon: BarChart3, label: "Insights", active: false },
    { icon: MessageSquare, label: "Outreach", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header section */}
      <div className="px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
          </motion.button>
          <span className="text-sm font-medium text-[var(--cream)]">
            Control Center
          </span>
          <div className="w-9" />
        </div>

        {/* AI celebration */}
        <motion.div
          className="flex items-start gap-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AIHostAvatar size="sm" />
          <div className="bg-[var(--burg-900)] rounded-2xl rounded-tl-sm border border-[var(--burg-800)] px-4 py-3 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span className="text-xs font-semibold text-[var(--gold)]">
                Your intelligence engine is ready!
              </span>
            </div>
            <p className="text-sm text-[var(--burg-300)] font-light">
              Here&apos;s your Control Center. Once bots deploy, data flows in
              and these charts come alive.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Control Center preview with parallax tilt */}
      <ParallaxCard
        className="flex-1 mx-4 rounded-t-2xl border border-[var(--burg-800)] border-b-0 bg-[var(--burg-900)] overflow-hidden shadow-xl flex flex-col"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Mini app bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--burg-800)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--burg-800)]">
              <span className="text-xs font-bold text-[var(--cream)]">DC</span>
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--cream)] block leading-tight">
                Design Circle SF
              </span>
              <span className="text-[10px] text-[var(--burg-400)]">
                AI Intelligence Hub
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--burg-400)]" />
            <Settings className="w-4 h-4 text-[var(--burg-400)]" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1">
          {/* Welcome banner */}
          <div className="relative p-4 rounded-xl bg-[var(--cream)] text-[var(--burg-deep)] overflow-hidden">
            <ShimmerSweep />
            <span className="text-xs font-medium opacity-70">
              Your AI partner is ready
            </span>
            <p className="text-sm font-semibold mt-1">
              Deploy bots to start gathering intelligence
            </p>
          </div>

          {/* Quick actions — bot-oriented */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Bot, label: "Deploy" },
              { icon: BarChart3, label: "Poll" },
              { icon: MessageSquare, label: "Message" },
              { icon: Activity, label: "Health" },
            ].map((action) => (
              <motion.div
                key={action.label}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[var(--burg-800)] cursor-pointer"
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 0 12px rgba(245, 237, 224, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="w-5 h-5 text-[var(--cream)]" />
                <span className="text-[10px] text-[var(--burg-300)]">
                  {action.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Community Health Ring (empty state, Whoop-inspired) */}
          <div className="p-3 rounded-xl border border-[var(--burg-800)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
                Community Health
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-400 font-medium">
                  Ready
                </span>
              </div>
            </div>
            <EmptyHealthRing />
            <p className="text-[10px] text-[var(--burg-500)] text-center">
              Deploy bots to start scoring
            </p>
          </div>

          {/* Bot Activity (empty state) */}
          <div className="p-3 rounded-xl border border-[var(--burg-800)] overflow-hidden relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
                Bot Activity
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] text-amber-400 font-medium">
                  Ready
                </span>
              </div>
            </div>
            <div className="flex items-end gap-4">
              {/* Muted placeholder bars */}
              <div className="flex-1">
                <div className="flex items-end gap-[3px] mb-1.5 h-9">
                  {[15, 20, 10, 25, 18, 30, 8].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm bg-[var(--burg-700)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: 0.5 + i * 0.08,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-[var(--burg-500)]">Mon</span>
                  <span className="text-[9px] text-[var(--burg-500)]">Today</span>
                </div>
              </div>
              {/* Empty score */}
              <div className="text-right pb-1">
                <motion.span
                  className="text-2xl font-bold text-[var(--burg-500)] block leading-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  —
                </motion.span>
                <span className="text-[10px] text-[var(--burg-600)] mt-0.5 block">
                  awaiting data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tab bar with sliding dot indicator */}
        <div className="border-t border-[var(--burg-800)] px-4 py-2 flex items-center justify-around mt-auto relative">
          {tabs.map((tab) => {
            const isActiveOrHovered = hoveredTab ? tab.label === hoveredTab : tab.active;
            return (
              <motion.div
                key={tab.label}
                className="flex flex-col items-center gap-0.5 relative cursor-pointer z-10"
                onHoverStart={() => setHoveredTab(tab.label)}
                onHoverEnd={() => setHoveredTab(null)}
                whileHover={{ scale: 1.1 }}
              >
                <tab.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActiveOrHovered
                      ? "text-[var(--cream)]"
                      : "text-[var(--burg-400)]"
                  }`}
                />
                <span
                  className={`text-[9px] transition-colors duration-200 ${
                    isActiveOrHovered
                      ? "text-[var(--cream)] font-semibold"
                      : "text-[var(--burg-400)]"
                  }`}
                >
                  {tab.label}
                </span>
                {/* Dot indicator */}
                {isActiveOrHovered && (
                  <motion.div
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--cream)]"
                    layoutId="tab-dot"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </ParallaxCard>

      {/* CTA - overlaid at bottom */}
      <div className="px-6 py-4 bg-[var(--burg-deep)]">
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Looks great — let&apos;s deploy your bots!
        </motion.button>
      </div>
    </div>
  );
}
