"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Camera,
  Ticket,
  Send,
  Check,
  Sparkles,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenBotConnectProps {
  onBack: () => void;
  onContinue: () => void;
}

interface Platform {
  id: string;
  name: string;
  icon: typeof MessageSquare;
  emoji: string;
  placeholder: string;
  actionLabel: string;
}

const platforms: Platform[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageSquare,
    emoji: "💬",
    placeholder: "Paste group invite link...",
    actionLabel: "Connect",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Camera,
    emoji: "📸",
    placeholder: "@youraccount",
    actionLabel: "Connect Account",
  },
  {
    id: "eventbrite",
    name: "Eventbrite",
    icon: Ticket,
    emoji: "🎟️",
    placeholder: "Organizer URL or email...",
    actionLabel: "Connect Events",
  },
];

type DeployPhase = "idle" | "connecting" | "deploying" | "live";

const deploySteps: Record<string, string> = {
  connecting: "Connecting...",
  deploying: "Setting up integration...",
  live: "Live!",
};

/* Confetti burst on deploy success */
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
              backgroundColor: [
                "var(--cream)",
                "var(--gold)",
                "var(--burg-300)",
                "var(--burg-500)",
              ][i % 4],
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

/* ── Platform deploy card ── */
function PlatformCard({
  platform,
  index,
  isDeployed,
  onDeploy,
}: {
  platform: Platform;
  index: number;
  isDeployed: boolean;
  onDeploy: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [phase, setPhase] = useState<DeployPhase>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const Icon = platform.icon;

  const handleDeploy = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("connecting");

    const timer1 = setTimeout(() => setPhase("deploying"), 800);
    const timer2 = setTimeout(() => {
      setPhase("live");
      setShowConfetti(true);
      onDeploy();
      setTimeout(() => setShowConfetti(false), 600);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [phase, onDeploy]);

  return (
    <motion.div
      className={`p-4 rounded-xl border transition-all ${
        isDeployed
          ? "bg-[var(--burg-900)] border-emerald-500/30"
          : "bg-[var(--burg-900)] border-[var(--burg-800)]"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
      whileHover={{ y: -2 }}
    >
      {/* Platform header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--burg-800)] flex items-center justify-center relative">
            <span className="text-lg">{platform.emoji}</span>
            {isDeployed && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-[var(--burg-deep)]" />
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--cream)] block">
              {platform.name}
            </span>
            {isDeployed && (
              <span className="text-[10px] text-emerald-400">Connected</span>
            )}
          </div>
        </div>

        {/* Status pill */}
        {isDeployed && (
          <div className="relative">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <div className="relative w-1.5 h-1.5">
                <div className="absolute inset-0 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                Live
              </span>
            </div>
            <ConfettiBurst active={showConfetti} />
          </div>
        )}
      </div>

      {/* Deploy interaction */}
      {!isDeployed && (
        <>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={platform.placeholder}
              className="flex-1 bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-lg px-3 py-2 text-sm text-[var(--cream)] placeholder:text-[var(--burg-500)] focus:outline-none focus:border-[var(--cream)] transition-colors"
            />
          </div>

          {/* Deploy button / progress */}
          {phase === "idle" ? (
            <motion.button
              onClick={handleDeploy}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[var(--burg-800)] text-[var(--cream)] hover:bg-[var(--burg-700)] border border-[var(--burg-700)] flex items-center justify-center gap-2 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-3.5 h-3.5" />
              {platform.actionLabel}
            </motion.button>
          ) : (
            <div className="space-y-2">
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[var(--burg-800)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[var(--cream)]"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      phase === "connecting"
                        ? "40%"
                        : phase === "deploying"
                        ? "75%"
                        : "100%",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <motion.p
                className="text-xs text-[var(--burg-300)] text-center"
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {deploySteps[phase]}
              </motion.p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   SCREEN BOT CONNECT (main export)
   ══════════════════════════════════════════ */

export function ScreenBotConnect({ onBack, onContinue }: ScreenBotConnectProps) {
  const [deployedPlatforms, setDeployedPlatforms] = useState<string[]>([]);

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
          Connect Channels
        </span>
        <motion.button
          onClick={onContinue}
          className="text-sm text-[var(--burg-400)] hover:text-[var(--cream)] transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          Skip
        </motion.button>
      </div>

      {/* AI Host recommendation */}
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
              Channel Intelligence
            </span>
          </div>
          <p className="text-sm text-[var(--burg-300)] font-light">
            Let&apos;s connect your community channels. They&apos;ll gather intelligence
            from your existing channels — no need for members to switch platforms.
          </p>
        </motion.div>
      </div>

      {/* Platform cards */}
      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-3">
          Connect Channels
        </h3>
        <div className="space-y-3">
          {platforms.map((platform, i) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              index={i}
              isDeployed={deployedPlatforms.includes(platform.id)}
              onDeploy={() =>
                setDeployedPlatforms((prev) => [...prev, platform.id])
              }
            />
          ))}
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        onClick={onContinue}
        className="w-full mt-4 py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Continue with </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={deployedPlatforms.length}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-block"
          >
            {deployedPlatforms.length}
          </motion.span>
        </AnimatePresence>
        <span> integrations</span>
      </motion.button>
    </div>
  );
}
