"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Image,
  BarChart3,
  Users,
  Link2,
  Sparkles,
  Check,
  Plus,
  ChevronRight,
  Activity,
  Heart,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";
import { AnimatedRootsLogo } from "../CSLogos/animated-logos";

interface ScreenModulesProps {
  onBack: () => void;
  onContinue: () => void;
}

interface Module {
  id: string;
  icon: typeof MessageSquare;
  name: string;
  desc: string;
  recommended: boolean;
  category: "core" | "outreach" | "intelligence";
}

const modules: Module[] = [
  {
    id: "health",
    icon: Activity,
    name: "Community Health",
    desc: "Health scoring, retention signals",
    recommended: true,
    category: "core",
  },
  {
    id: "sentiment",
    icon: Heart,
    name: "Sentiment Analysis",
    desc: "Conversation tone, satisfaction",
    recommended: true,
    category: "core",
  },
  {
    id: "polls",
    icon: BarChart3,
    name: "Bot Outreach",
    desc: "Polls, surveys, Q&A across platforms",
    recommended: true,
    category: "outreach",
  },
  {
    id: "dms",
    icon: MessageSquare,
    name: "Personalized Messaging",
    desc: "DMs based on member profiles",
    recommended: true,
    category: "outreach",
  },
  {
    id: "events",
    icon: Calendar,
    name: "Event Intelligence",
    desc: "Preferences, optimal timing, RSVPs",
    recommended: true,
    category: "intelligence",
  },
  {
    id: "content",
    icon: Image,
    name: "Content Analysis",
    desc: "What resonates, engagement patterns",
    recommended: true,
    category: "intelligence",
  },
  {
    id: "sync",
    icon: Link2,
    name: "Cross-Platform Sync",
    desc: "Unified view across all channels",
    recommended: false,
    category: "intelligence",
  },
  {
    id: "member-intel",
    icon: Users,
    name: "Member Profiles",
    desc: "Auto-built profiles from bot data",
    recommended: false,
    category: "intelligence",
  },
];

const integrations = [
  { name: "WhatsApp", connected: true },
  { name: "Instagram", connected: true },
  { name: "Eventbrite", connected: true },
  { name: "Google Sheets", connected: false },
  { name: "Slack", connected: false },
  { name: "Figma", connected: false },
];

/* Confetti burst from the checkbox when toggling ON */
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 14 + Math.random() * 8;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
            style={{
              backgroundColor: ["var(--cream)", "var(--gold)", "var(--burg-300)", "var(--burg-500)"][i % 4],
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function ScreenModules({ onBack, onContinue }: ScreenModulesProps) {
  const [activeModules, setActiveModules] = useState<string[]>(
    modules.filter((m) => m.recommended).map((m) => m.id)
  );
  const [justToggled, setJustToggled] = useState<string | null>(null);
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    const wasActive = activeModules.includes(id);
    setActiveModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
    if (!wasActive) {
      setJustToggled(id);
      setTimeout(() => setJustToggled(null), 600);
    }
  };

  const renderModuleCard = (mod: Module, i: number, delayBase: number) => {
    const isActive = activeModules.includes(mod.id);
    const Icon = mod.icon;
    return (
      <motion.button
        key={mod.id}
        onClick={() => toggleModule(mod.id)}
        className={`relative p-3 rounded-xl border text-left transition-all ${
          isActive
            ? "border-[var(--cream)] bg-[var(--burg-800)]"
            : "border-[var(--burg-800)] bg-[var(--burg-900)]"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayBase + i * 0.05 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Toggle indicator with confetti */}
        <div className="relative">
          <motion.div
            className={`absolute top-0 right-0 w-5 h-5 rounded-md flex items-center justify-center ${
              isActive
                ? "bg-[var(--cream)]"
                : "border border-[var(--burg-500)]"
            }`}
            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {isActive && <Check className="w-3 h-3 text-[var(--burg-deep)]" />}
          </motion.div>
          <ConfettiBurst active={justToggled === mod.id} />
        </div>

        <Icon
          className={`w-5 h-5 mb-2 ${
            isActive
              ? "text-[var(--cream)]"
              : "text-[var(--burg-400)]"
          }`}
        />
        <span
          className={`text-sm font-semibold block ${
            isActive
              ? "text-[var(--cream)]"
              : "text-[var(--burg-300)]"
          }`}
        >
          {mod.name}
        </span>
        <span className="text-[11px] text-[var(--burg-400)] leading-tight block mt-0.5">
          {mod.desc}
        </span>
      </motion.button>
    );
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <motion.button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
        </motion.button>
        <span className="text-sm font-medium text-[var(--cream)]">
          Your Modules
        </span>
        <div className="w-9" />
      </div>

      {/* AI recommendation with breathing border */}
      <div className="flex items-start gap-3 mb-6 mt-2">
        <AIHostAvatar size="sm" />
        <motion.div
          className="bg-[var(--burg-900)] rounded-2xl rounded-tl-sm border px-4 py-3 flex-1"
          animate={{
            borderColor: [
              "var(--burg-800)",
              "var(--burg-600)",
              "var(--burg-800)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="text-xs font-semibold text-[var(--gold)]">
              AI Recommended
            </span>
          </div>
          <p className="text-sm text-[var(--burg-300)] font-light">
            Based on communities like yours, I&apos;ve pre-selected the modules
            that will have the most impact. You can customize anytime.
          </p>
        </motion.div>
      </div>

      {/* Modules grid */}
      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-3">
          Intelligence Core
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {modules
            .filter((m) => m.category === "core")
            .map((mod, i) => renderModuleCard(mod, i, 0))}
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-3">
          Bot Capabilities
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {modules
            .filter((m) => m.category === "outreach")
            .map((mod, i) => renderModuleCard(mod, i, 0.2))}
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-3">
          Data &amp; Analysis
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {modules
            .filter((m) => m.category === "intelligence")
            .map((mod, i) => renderModuleCard(mod, i, 0.4))}
        </div>

        {/* Integrations with hover slide-right */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-3">
          Bot Channels &amp; Integrations
        </h3>
        <div className="space-y-2 mb-4">
          {integrations.map((int) => (
            <motion.div
              key={int.name}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                int.connected
                  ? "bg-[var(--burg-900)] border-[var(--burg-700)]"
                  : "bg-[var(--burg-900)] border-[var(--burg-800)]"
              }`}
              whileHover={{ x: 4 }}
              onHoverStart={() => setHoveredIntegration(int.name)}
              onHoverEnd={() => setHoveredIntegration(null)}
            >
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <div className="relative">
                  <Link2 className={`w-4 h-4 ${int.connected ? "text-[var(--cream)]" : "text-[var(--burg-500)]"}`} />
                  {int.connected && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400">
                      <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    </div>
                  )}
                </div>
                <span className={`text-sm font-medium ${int.connected ? "text-[var(--cream)]" : "text-[var(--burg-400)]"}`}>
                  {int.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {int.connected ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Live
                    </span>
                  </div>
                ) : (
                  <button className="text-xs font-medium text-[var(--cream)] bg-[var(--burg-800)] hover:bg-[var(--burg-700)] px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <Plus className="w-3 h-3" /> Connect
                  </button>
                )}
                {/* Reveal arrow on hover */}
                <AnimatePresence>
                  {hoveredIntegration === int.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronRight className="w-4 h-4 text-[var(--burg-400)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue button with animated count */}
      <motion.button
        onClick={onContinue}
        className="w-full mt-4 py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Continue with </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={activeModules.length}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-block"
          >
            {activeModules.length}
          </motion.span>
        </AnimatePresence>
        <span> capabilities</span>
      </motion.button>
    </div>
  );
}
