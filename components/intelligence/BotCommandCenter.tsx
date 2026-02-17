"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  MessageSquare,
  BarChart3,
  Activity,
  Send,
  ChevronDown,
  ChevronUp,
  UserPlus,
  X,
  Sparkles,
} from "lucide-react";
import { botCommandData } from "./mock-data";
import type { BotPoll, BotMemberIntelligence } from "./mock-data";
import { SectionHeader, IntelligenceCard, TrendPill, useAnimatedNumber } from "./shared";
import { MetricCard } from "./charts/MetricCard";
import { VerticalBarChart } from "./charts/AnimatedBarChart";

/* ── Platform emoji helper ── */
function platformIcon(p: string) {
  if (p === "whatsapp") return "💬";
  if (p === "instagram") return "📸";
  if (p === "eventbrite") return "🎟️";
  return "🌐";
}

function platformLabel(p: string) {
  if (p === "whatsapp") return "WhatsApp";
  if (p === "instagram") return "Instagram";
  if (p === "eventbrite") return "Eventbrite";
  return "All Platforms";
}

/* ── Platform status card ── */
function PlatformStatusCard({
  platform,
  index,
}: {
  platform: (typeof botCommandData.platformStatus)[number];
  index: number;
}) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl bg-[var(--burg-800)] border border-[var(--burg-800)]"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.06 }}
      whileHover={{ x: 4, borderColor: "var(--burg-700)" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{platformIcon(platform.platform)}</span>
        <div>
          <span className="text-sm font-medium text-[var(--cream)] block">
            {platform.name}
          </span>
          <span className="text-[11px] text-[var(--burg-400)]">
            {platform.membersReached.toLocaleString()} members reached
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[var(--burg-500)]">
          {platform.lastActivity}
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <div className="relative w-1.5 h-1.5">
            <div className="absolute inset-0 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs font-semibold text-emerald-400">Live</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Poll result card (expandable) ── */
function PollResultCard({ poll, index }: { poll: BotPoll; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="rounded-xl bg-[var(--burg-800)] border border-[var(--burg-800)] overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      whileHover={{ borderColor: "var(--burg-700)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{platformIcon(poll.platform)}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--burg-700)] text-[var(--burg-300)]">
              {platformLabel(poll.platform)}
            </span>
            <span className="text-[10px] text-[var(--burg-500)]">
              {poll.sentAt}
            </span>
          </div>
          <p className="text-sm font-medium text-[var(--cream)] truncate">
            {poll.question}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[var(--burg-400)]">
              {poll.responseCount} responses
            </span>
            <TrendPill value={poll.responseRate} suffix="% rate" />
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--burg-500)] shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <VerticalBarChart
                data={poll.results.map((r) => ({
                  label: r.option,
                  value: r.count,
                  color:
                    ["var(--cream)", "var(--gold)", "var(--burg-400)", "var(--burg-600)"][
                      poll.results.indexOf(r) % 4
                    ],
                  detail: {
                    Responses: r.count,
                    Share: `${r.percentage}%`,
                  },
                }))}
                height={120}
                delay={0}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Member intelligence card with drag-to-dismiss ── */
function MemberCard({
  member,
  index,
  onDismiss,
}: {
  member: BotMemberIntelligence;
  index: number;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.5 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDismiss();
      }}
      style={{ touchAction: "pan-y" }}
      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--burg-800)] border border-[var(--burg-800)] cursor-grab active:cursor-grabbing"
      whileDrag={{ opacity: 0.7, scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[var(--burg-700)] flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-[var(--cream)]">
          {member.avatar}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--cream)] truncate">
            {member.name}
          </span>
          <span className="text-[10px]">{platformIcon(member.source)}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {member.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--burg-700)] text-[var(--burg-300)]"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Engagement + onboard status */}
      <div className="flex flex-col items-end shrink-0 gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 rounded-full bg-[var(--burg-700)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--cream)]"
              initial={{ width: 0 }}
              animate={{ width: `${member.engagementScore}%` }}
              transition={{ delay: 0.3 + index * 0.06, duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-semibold text-[var(--cream)]">
            {member.engagementScore}
          </span>
        </div>
        {member.readyToOnboard && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Ready
          </span>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-[var(--burg-700)] shrink-0"
      >
        <X className="w-3.5 h-3.5 text-[var(--burg-500)]" />
      </button>
    </motion.div>
  );
}

/* ── Create Poll Panel ── */
function CreatePollPanel() {
  const [question, setQuestion] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("whatsapp");
  const [sent, setSent] = useState(false);

  const platforms = [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "instagram", label: "Instagram" },
    { id: "eventbrite", label: "Eventbrite" },
    { id: "all", label: "All" },
  ];

  // Sliding pill
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillMetrics, setPillMetrics] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const el = pillRefs.current[selectedPlatform];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillMetrics({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [selectedPlatform]);

  const handleSend = () => {
    if (!question.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setQuestion("");
    }, 2000);
  };

  return (
    <div className="space-y-3">
      {/* Question input */}
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your community a question..."
          className="w-full bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-xl px-4 py-3 pr-12 text-sm text-[var(--cream)] placeholder:text-[var(--burg-500)] focus:outline-none focus:border-[var(--cream)] transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
            question.trim()
              ? "bg-[var(--cream)] text-[var(--burg-deep)]"
              : "bg-[var(--burg-700)] text-[var(--burg-500)]"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Platform selector */}
      <div
        ref={containerRef}
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--burg-800)] border border-[var(--burg-700)] relative"
      >
        {pillMetrics && (
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-[var(--cream)] z-0"
            animate={{ left: pillMetrics.left, width: pillMetrics.width }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        {platforms.map((p) => (
          <button
            key={p.id}
            ref={(el) => {
              pillRefs.current[p.id] = el;
            }}
            onClick={() => setSelectedPlatform(p.id)}
            className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedPlatform === p.id
                ? "text-[var(--burg-deep)]"
                : "text-[var(--burg-400)] hover:text-[var(--burg-300)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Sent confirmation */}
      <AnimatePresence>
        {sent && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              Poll sent to {platformLabel(selectedPlatform)}!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════
   BOT COMMAND CENTER (main export)
   ══════════════════════════════════════════ */

export function BotCommandCenter() {
  const stats = botCommandData.summaryStats;
  const [members, setMembers] = useState(botCommandData.memberIntelligence);

  const readyCount = members.filter((m) => m.readyToOnboard).length;

  return (
    <div className="space-y-6">
      {/* Row 1: Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label={stats.activeBots.label}
          value={stats.activeBots.value}
          trend={stats.activeBots.trend}
          icon={Bot}
          trendSuffix=""
          index={0}
        />
        <MetricCard
          label={stats.questionsSent.label}
          value={stats.questionsSent.value}
          trend={stats.questionsSent.trend}
          icon={MessageSquare}
          index={1}
        />
        <MetricCard
          label={stats.responsesCollected.label}
          value={stats.responsesCollected.value}
          trend={stats.responsesCollected.trend}
          icon={BarChart3}
          index={2}
        />
        <MetricCard
          label={stats.avgResponseRate.label}
          value={stats.avgResponseRate.value}
          trend={stats.avgResponseRate.trend}
          suffix="%"
          icon={Activity}
          index={3}
        />
      </div>

      {/* Row 2: Platform Status */}
      <IntelligenceCard delay={0.15}>
        <SectionHeader title="Platform Status" subtitle="Connected bot channels" delay={0.2} />
        <div className="space-y-2">
          {botCommandData.platformStatus.map((p, i) => (
            <PlatformStatusCard key={p.id} platform={p} index={i} />
          ))}
        </div>
      </IntelligenceCard>

      {/* Row 3: Create Poll */}
      <IntelligenceCard delay={0.25}>
        <SectionHeader title="Create New Poll" subtitle="Ask your community anything" delay={0.3} />
        <CreatePollPanel />
      </IntelligenceCard>

      {/* Row 4: Recent Polls */}
      <IntelligenceCard delay={0.35}>
        <SectionHeader title="Recent Polls" subtitle="Latest responses from your community" delay={0.4} />
        <div className="space-y-2">
          {botCommandData.recentPolls.map((poll, i) => (
            <PollResultCard key={poll.id} poll={poll} index={i} />
          ))}
        </div>
      </IntelligenceCard>

      {/* Row 5: Member Intelligence + Onboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelligenceCard delay={0.45}>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader title="Member Intelligence" delay={0.5} />
            <span className="text-[11px] text-[var(--burg-400)]">
              {members.length} profiles
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {members.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  onDismiss={() =>
                    setMembers((prev) => prev.filter((m) => m.id !== member.id))
                  }
                />
              ))}
            </AnimatePresence>
          </div>
          <p className="text-[9px] text-[var(--burg-500)] mt-2 text-center">
            Swipe right to dismiss
          </p>
        </IntelligenceCard>

        <IntelligenceCard delay={0.55}>
          <SectionHeader
            title="High-Value Responders"
            subtitle="Participants with rich profile data"
            delay={0.6}
          />
          <div className="space-y-3">
            {members
              .filter((m) => m.readyToOnboard)
              .map((member, i) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--burg-800)] border border-emerald-500/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-400">
                        {member.avatar}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[var(--cream)] block">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-[var(--burg-400)]">
                        {member.responsesGiven} responses · score {member.engagementScore}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserPlus className="w-3 h-3" />
                    Invite
                  </motion.button>
                </motion.div>
              ))}

            {readyCount > 0 && (
              <motion.button
                className="w-full py-3 rounded-xl font-semibold text-sm text-[var(--burg-deep)] bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Invite All {readyCount} Members to Central Square
              </motion.button>
            )}
          </div>
        </IntelligenceCard>
      </div>
    </div>
  );
}
