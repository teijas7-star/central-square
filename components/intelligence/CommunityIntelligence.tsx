"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Target, Globe, Sparkles, Bot, MessageSquare } from "lucide-react";
import { ShimmerSweep } from "./shared";
import { OperatorIntelligence } from "./OperatorIntelligence";
import { SponsorIntelligence } from "./SponsorIntelligence";
import { DiscourseIntelligence } from "./DiscourseIntelligence";
import { BotCommandCenter } from "./BotCommandCenter";
import { JarvisChat } from "./JarvisChat";

const tabs = [
  { id: "operator", label: "Operator", icon: Activity },
  { id: "sponsor", label: "Sponsor", icon: Target },
  { id: "discourse", label: "Discourse", icon: Globe },
  { id: "bots", label: "Bots", icon: Bot },
  { id: "william", label: "William", icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CommunityIntelligence() {
  const [activeTab, setActiveTab] = useState<TabId>("operator");

  // Sliding pill metrics
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillMetrics, setPillMetrics] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const el = pillRefs.current[activeTab];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillMetrics({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div className="intel-constellation-bg intel-dot-grid intel-scan-line min-h-screen bg-[var(--burg-deep)] relative">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        {/* Title with shimmer */}
        <div className="relative mb-1">
          <motion.h1
            className="font-serif lowercase text-3xl text-[var(--cream)] tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            community intelligence
          </motion.h1>
        </div>

        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span className="text-sm text-[var(--burg-300)] font-light">
            the data layer no one else has
          </span>
        </motion.div>

        {/* Tab navigation — sliding pill */}
        <motion.div
          ref={containerRef}
          className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--burg-900)] border border-[var(--burg-800)] relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Sliding background pill */}
          {pillMetrics && (
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-[var(--cream)] z-0"
              animate={{
                left: pillMetrics.left,
                width: pillMetrics.width,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  pillRefs.current[tab.id] = el;
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--burg-deep)]"
                    : "text-[var(--burg-400)] hover:text-[var(--burg-300)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Tab content */}
      <div className="px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "operator" && <OperatorIntelligence />}
            {activeTab === "sponsor" && <SponsorIntelligence />}
            {activeTab === "discourse" && <DiscourseIntelligence />}
            {activeTab === "bots" && <BotCommandCenter />}
            {activeTab === "william" && <JarvisChat />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
