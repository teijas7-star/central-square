"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Target,
  Globe,
  Bot,
  MessageSquare,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  Smartphone,
  Radio,
  Calendar,
  Heart,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Shield,
  Cpu,
  Sparkles,
  MessageCircle,
  Mail,
} from "lucide-react";
// Inline placeholders to avoid cross-module hydration issues
function BreathingNetworkLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      <path d="M32 26 Q32 18 32 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 32 Q46 32 54 32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 38 Q32 46 32 54" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 32 Q18 32 10 32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AnimatedRootsLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      <path d="M32 26 Q32 18 32 10 Q30 8 28 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 32 Q46 32 54 32 Q56 30 58 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 38 Q32 46 32 54 Q34 56 36 58" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 32 Q18 32 10 32 Q8 34 6 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AIHostAvatar({ size = "md", speaking, listening }: { size?: string; speaking?: boolean; listening?: boolean }) {
  const dim = size === "xl" ? 128 : size === "lg" ? 96 : size === "sm" ? 40 : 64;
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: dim,
        height: dim,
        background: "linear-gradient(135deg, var(--gold), var(--gold-muted))",
      }}
    >
      <BreathingNetworkLogo size={dim * 0.6} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INLINE SVG MICRO-COMPONENTS
   ═══════════════════════════════════════════════════ */

function MiniProgressRing({
  percent,
  size = 64,
  color = "var(--gold)",
  delay = 0,
}: {
  percent: number;
  size?: number;
  color?: string;
  delay?: number;
}) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--burg-800)"
        strokeWidth="4"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
      />
    </svg>
  );
}

function MiniAreaChart({
  data,
  width = 320,
  height = 80,
  color = "var(--gold)",
  delay = 0,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const id = `area-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <motion.svg
      width={width}
      height={height}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={areaPoints}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.2, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED SLIDE BUILDING BLOCKS
   ═══════════════════════════════════════════════════ */

function SlideLabel({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] mb-4 block"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.span>
  );
}

function SlideTitle({ children, delay = 0.1 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.h1
      className="font-serif lowercase text-3xl md:text-5xl lg:text-6xl text-[var(--cream)] tracking-tight leading-[1.1] mb-6 max-w-4xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.h1>
  );
}

function SlideSubtitle({ children, delay = 0.2 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      className="text-base md:text-lg text-[var(--burg-300)] font-light leading-relaxed max-w-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.p>
  );
}

function PitchCard({
  children,
  className = "",
  borderColor,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-5 relative overflow-hidden ${className}`}
      style={borderColor ? { borderTopColor: borderColor, borderTopWidth: "2px" } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

function NumberBadge({ n, color = "var(--gold)" }: { n: number; color?: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[var(--burg-deep)] shrink-0"
      style={{ backgroundColor: color }}
    >
      {n}
    </div>
  );
}

function StatCard({
  value,
  label,
  trend,
  delay = 0,
}: {
  value: string;
  label: string;
  trend?: string;
  delay?: number;
}) {
  return (
    <PitchCard delay={delay}>
      <div className="text-2xl md:text-3xl font-bold text-[var(--cream)] mb-1">{value}</div>
      {trend && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
          </svg>
          {trend}
        </span>
      )}
      <div className="text-sm text-[var(--burg-400)] font-light">{label}</div>
    </PitchCard>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE DEFINITIONS
   ═══════════════════════════════════════════════════ */

function Slide0_Title() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 text-[var(--cream)]"
      >
        <BreathingNetworkLogo size={120} />
      </motion.div>
      <SlideTitle delay={0.3}>central square</SlideTitle>
      <SlideSubtitle delay={0.5}>the community intelligence platform</SlideSubtitle>
      <motion.div
        className="mt-12 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--gold)]">
          Seed Round
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--burg-600)]" />
        <span className="text-sm font-semibold text-[var(--cream)]">$3M</span>
      </motion.div>
    </div>
  );
}

function Slide1_Problem() {
  const stats = [
    { pct: 60, label: "of adults report feeling lonely", color: "var(--gold)" },
    { pct: 87, label: "of companies invest in community", color: "#4A9EDE" },
    { pct: 40, label: "YoY growth in IRL communities", color: "#22C55E" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>the problem</SlideLabel>
      <SlideTitle>more connected than ever — and lonelier than ever</SlideTitle>
      <div className="grid grid-cols-3 gap-6 mt-10 max-w-3xl w-full">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
          >
            <div className="relative mb-3">
              <MiniProgressRing percent={s.pct} size={80} color={s.color} delay={0.5 + i * 0.15} />
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[var(--cream)]">
                {s.pct}%
              </span>
            </div>
            <span className="text-sm text-[var(--burg-400)] font-light">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Slide2_PlatformsFail() {
  const cards = [
    { title: "Algorithmic Feeds", desc: "Designed to maximize screen time, not genuine connection" },
    { title: "Creator Dependency", desc: "Platforms own the audience — communities own nothing" },
    { title: "No Economic Model", desc: "Communities generate enormous value but capture none of it" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>why platforms fail</SlideLabel>
      <SlideTitle>social media optimizes for attention, not belonging</SlideTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-4xl w-full">
        {cards.map((c, i) => (
          <PitchCard key={i} borderColor="var(--cs-error)" delay={0.4 + i * 0.12}>
            <h3 className="text-lg font-semibold text-[var(--cream)] mb-2">{c.title}</h3>
            <p className="text-sm text-[var(--burg-400)] font-light">{c.desc}</p>
          </PitchCard>
        ))}
      </div>
    </div>
  );
}

function Slide3_Opportunity() {
  const communities = [
    { emoji: "🎨", name: "Design Circles" },
    { emoji: "🏃", name: "Run Clubs" },
    { emoji: "📚", name: "Book Clubs" },
    { emoji: "🎵", name: "Music Collectives" },
    { emoji: "💼", name: "Professional Networks" },
    { emoji: "🏛️", name: "Civic Groups" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>the opportunity</SlideLabel>
      <SlideTitle>communities are thriving everywhere — without infrastructure</SlideTitle>
      <div className="flex flex-wrap justify-center gap-3 mt-10 max-w-2xl">
        {communities.map((c, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--burg-900)] border border-[var(--burg-800)] text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-lg">{c.emoji}</span>
            <span className="text-[var(--burg-300)] font-medium">{c.name}</span>
          </motion.div>
        ))}
      </div>
      <SlideSubtitle delay={0.9}>
        87% of companies now invest in community. None have the right tools.
      </SlideSubtitle>
    </div>
  );
}

function Slide4_Solution() {
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>central square</SlideLabel>
      <SlideTitle>the operating system for real-world communities</SlideTitle>
      <div className="flex flex-col items-center gap-4 mt-8 max-w-xl w-full">
        <PitchCard borderColor="#4A9EDE" delay={0.4} className="w-full text-left">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#4A9EDE]" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--cream)]">The Square</h3>
              <p className="text-xs text-[var(--burg-400)]">Public discovery layer — find and join communities</p>
            </div>
          </div>
        </PitchCard>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring" }}
          className="my-2"
        >
          <AIHostAvatar size="lg" speaking />
        </motion.div>
        <motion.span
          className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Ellie — AI Community Intelligence
        </motion.span>
        <PitchCard borderColor="var(--gold)" delay={0.7} className="w-full text-left">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[var(--gold)]" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--cream)]">The Arcades</h3>
              <p className="text-xs text-[var(--burg-400)]">Private community homes — events, content, intelligence</p>
            </div>
          </div>
        </PitchCard>
      </div>
    </div>
  );
}

function Slide5_Pain() {
  const pains = [
    { icon: Layers, text: "Juggling 6+ fragmented tools with zero integration" },
    { icon: Shield, text: "No ownership — platforms own the audience, not the operator" },
    { icon: DollarSign, text: "No revenue model beyond donations and ticket sales" },
    { icon: Cpu, text: "Manual everything — no intelligence, no automation" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>operator pain</SlideLabel>
      <SlideTitle>community builders are burning out</SlideTitle>
      <div className="flex flex-col gap-3 mt-8 max-w-lg w-full">
        {pains.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-4 bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-xl px-5 py-4 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Icon className="w-5 h-5 text-[var(--gold)] shrink-0" />
              <span className="text-sm text-[var(--burg-300)] font-light">{p.text}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Slide6_StackProblem() {
  const tools = ["WhatsApp", "Discord", "Notion", "Eventbrite", "Stripe", "Sheets", "Mailchimp"];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>the stack problem</SlideLabel>
      <SlideTitle>one community, seven tools, zero integration</SlideTitle>
      <div className="grid grid-cols-2 gap-12 mt-10 max-w-3xl w-full items-center">
        {/* Before */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-error)] mb-4">Before</span>
          <div className="flex flex-wrap justify-center gap-2">
            {tools.map((t, i) => (
              <motion.div
                key={i}
                className="px-3 py-1.5 rounded-lg bg-[var(--burg-900)] border border-[var(--burg-800)] text-xs text-[var(--burg-400)]"
                initial={{ opacity: 0, rotate: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, rotate: Math.random() * 6 - 3 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                {t}
              </motion.div>
            ))}
          </div>
          <span className="text-xs text-[var(--burg-500)] mt-3">Disconnected. Manual. Fragile.</span>
        </motion.div>

        {/* After */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">With Central Square</span>
          <div className="relative flex items-center justify-center">
            <div className="text-[var(--cream)]">
              <BreathingNetworkLogo size={80} />
            </div>
          </div>
          <span className="text-xs text-[var(--burg-300)] mt-3">One hub. Unified. Intelligent.</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Product Demo Slides (7-10) ── */

function Slide7_Onboarding() {
  const msgs = [
    { role: "ai", text: "Tell me about your community. What do you do, and who\u2019s it for?" },
    { role: "user", text: "I run Design Circle SF \u2014 200 members. Monthly meetups, portfolio reviews, mentorship." },
    { role: "ai", text: "Love it. I\u2019ll deploy AI agents to your WhatsApp, Instagram, and Eventbrite \u2014 and start building your intelligence dashboard. Ready in 60 seconds." },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>product</SlideLabel>
      <SlideTitle>conversational AI onboarding</SlideTitle>
      <motion.div
        className="my-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AIHostAvatar size="lg" listening />
      </motion.div>
      <div className="flex flex-col gap-3 max-w-md w-full">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.25 }}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm text-left leading-relaxed ${
                m.role === "ai"
                  ? "bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl rounded-tl-sm text-[var(--burg-300)]"
                  : "bg-[var(--cream)] rounded-2xl rounded-tr-sm text-[var(--burg-deep)]"
              }`}
            >
              {m.role === "ai" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)] block mb-1">Ellie</span>
              )}
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-xs text-[var(--burg-500)] mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        60-second setup. Talk, don&apos;t fill forms.
      </motion.p>
    </div>
  );
}

function Slide8_BotDeploy() {
  const platforms = [
    { name: "WhatsApp", group: "Design Circle SF Group", members: "156 members", icon: MessageCircle, color: "#25D366" },
    { name: "Instagram", group: "@designcirclesf", members: "2,400 followers", icon: Radio, color: "#E1306C" },
    { name: "Eventbrite", group: "Design Circle SF Events", members: "890 attendees", icon: Calendar, color: "#F05537" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>product</SlideLabel>
      <SlideTitle>AI agents deploy across your channels</SlideTitle>
      <div className="flex flex-col gap-4 mt-8 max-w-md w-full">
        {platforms.map((p, i) => {
          const Icon = p.icon;
          return (
            <PitchCard key={i} delay={0.4 + i * 0.15} className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--cream)]">{p.name}</h3>
                    <p className="text-xs text-[var(--burg-400)]">{p.group}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <motion.div
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400">LIVE</span>
                  </motion.div>
                  <span className="text-[10px] text-[var(--burg-500)] mt-0.5">{p.members}</span>
                </div>
              </div>
            </PitchCard>
          );
        })}
      </div>
      <motion.p
        className="text-sm text-[var(--burg-400)] font-light mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        Zero migration. Bots meet members where they already are.
      </motion.p>
    </div>
  );
}

function Slide9_Dashboard() {
  const metrics = [
    { value: "87", label: "Health Score", trend: "+12%" },
    { value: "214", label: "Total Members", trend: "+18%" },
    { value: "87%", label: "Engagement", trend: "+3%" },
    { value: "$107K", label: "Sponsor Revenue", trend: "+34%" },
  ];
  const growthData = [82, 98, 115, 140, 178, 214];

  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>product</SlideLabel>
      <SlideTitle>the data layer no one else has</SlideTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-3xl w-full">
        {metrics.map((m, i) => (
          <StatCard key={i} value={m.value} label={m.label} trend={m.trend} delay={0.3 + i * 0.1} />
        ))}
      </div>
      <motion.div
        className="mt-6 max-w-xl w-full bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">6-Month Growth</span>
          <span className="text-xs text-[var(--burg-400)]">Members</span>
        </div>
        <MiniAreaChart data={growthData} width={480} height={80} delay={1.0} />
      </motion.div>
    </div>
  );
}

function Slide10_Ellie() {
  const msgs = [
    { role: "ai", text: "Your engagement dipped 12% since last Tuesday, but event RSVPs are actually up 18%. Want me to dig into what\u2019s happening?" },
    { role: "user", text: "Yeah, why did engagement drop?" },
    { role: "ai", text: "Looks like a posting gap \u2014 your top 3 contributors went quiet after the portfolio review event. That event generated 47 posts in 48 hours, then crickets. Classic \u2018event hangover.\u2019" },
    { role: "ai", text: "My recommendation: Drop a casual prompt in WhatsApp \u2014 something low-stakes like \u2018Show us your desk setup.\u2019 I\u2019ve seen this work in 73% of similar communities." },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>product</SlideLabel>
      <SlideTitle>ellie — your AI community coach</SlideTitle>
      <div className="flex flex-col gap-2.5 max-w-md w-full mt-6">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm text-left leading-relaxed ${
                m.role === "ai"
                  ? "bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl rounded-tl-sm text-[var(--burg-300)]"
                  : "bg-[var(--cream)] rounded-2xl rounded-tr-sm text-[var(--burg-deep)]"
              }`}
            >
              {m.role === "ai" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)] block mb-1">Ellie</span>
              )}
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-xs text-[var(--burg-500)] mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        Tells you what to do — not just what happened.
      </motion.p>
    </div>
  );
}

/* ── AI Strategy Slides (11-13) ── */

function Slide11_ColdStart() {
  const phases = [
    { time: "Day 1", title: "Deploy", desc: "AI bots deploy to WhatsApp, Instagram, Eventbrite. Zero migration. Zero friction.", color: "var(--gold)" },
    { time: "Week 1", title: "Collect", desc: "Agents gather conversation data, poll responses, sentiment. 312 data points. 87% response rate.", color: "var(--gold)" },
    { time: "Month 1", title: "Intelligence", desc: "Community health scores, at-risk member detection, trending topics emerge.", color: "#4A9EDE" },
    { time: "Month 3+", title: "Flywheel", desc: "Full intelligence active. AI recommends actions, sponsors see ROI, operators have complete visibility.", color: "#8B5CF6" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>cold start</SlideLabel>
      <SlideTitle>AI agents solve the cold start problem</SlideTitle>
      <div className="flex flex-col gap-0 mt-8 max-w-lg w-full">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            className="flex gap-4 text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: p.color, backgroundColor: i === 0 ? p.color : "transparent" }} />
              {i < phases.length - 1 && <div className="w-px flex-1 bg-[var(--burg-700)]" />}
            </div>
            {/* Content */}
            <div className="pb-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: p.color }}>{p.time}</span>
              <h3 className="text-base font-semibold text-[var(--cream)] mt-0.5">{p.title}</h3>
              <p className="text-sm text-[var(--burg-400)] font-light mt-1">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Slide12_Flywheel() {
  const steps = [
    { label: "Bots Collect Data", color: "var(--gold)" },
    { label: "AI Generates Insights", color: "#4A9EDE" },
    { label: "Operators Take Action", color: "#22C55E" },
    { label: "Better Outcomes", color: "#8B5CF6" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>compounding intelligence</SlideLabel>
      <SlideTitle>every interaction makes the platform smarter</SlideTitle>
      <div className="relative mt-10">
        {/* Circular layout */}
        <div className="grid grid-cols-2 gap-6 max-w-md">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-xl px-4 py-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
            >
              <NumberBadge n={i + 1} color={s.color} />
              <span className="text-sm font-medium text-[var(--cream)]">{s.label}</span>
            </motion.div>
          ))}
        </div>
        {/* Center arrow indicators */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-[var(--burg-600)] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <ArrowRight className="w-4 h-4 text-[var(--burg-500)]" />
            </motion.div>
          </div>
        </motion.div>
      </div>
      <SlideSubtitle delay={0.9}>
        Traditional platforms start empty. Central Square starts intelligent.
      </SlideSubtitle>
    </div>
  );
}

function Slide13_Pillars() {
  const pillars = [
    { n: 1, icon: Activity, name: "Operator Intelligence", desc: "Health scores, engagement heatmaps, at-risk detection", color: "var(--gold)" },
    { n: 2, icon: Target, name: "Sponsor Intelligence", desc: "ROI tracking, conversion funnels, revenue attribution", color: "#4A9EDE" },
    { n: 3, icon: Globe, name: "Discourse Intelligence", desc: "Sentiment analysis, trending topics, cross-community trends", color: "#22C55E" },
    { n: 4, icon: Bot, name: "Bot Command Center", desc: "Multi-platform AI agents, poll deployment, member intelligence", color: "#8B5CF6" },
    { n: 5, icon: MessageSquare, name: "Ellie AI Coach", desc: "Conversational AI that tells operators what to do, not just what happened", color: "var(--gold)" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>proprietary technology</SlideLabel>
      <SlideTitle>five intelligence pillars</SlideTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 max-w-4xl w-full">
        {pillars.slice(0, 3).map((p, i) => {
          const Icon = p.icon;
          return (
            <PitchCard key={i} borderColor={p.color} delay={0.3 + i * 0.1}>
              <div className="flex items-center gap-3 mb-2">
                <NumberBadge n={p.n} color={p.color} />
                <Icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--cream)] mb-1">{p.name}</h3>
              <p className="text-xs text-[var(--burg-400)] font-light">{p.desc}</p>
            </PitchCard>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-w-2xl w-full">
        {pillars.slice(3).map((p, i) => {
          const Icon = p.icon;
          return (
            <PitchCard key={i} borderColor={p.color} delay={0.6 + i * 0.1}>
              <div className="flex items-center gap-3 mb-2">
                <NumberBadge n={p.n} color={p.color} />
                <Icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--cream)] mb-1">{p.name}</h3>
              <p className="text-xs text-[var(--burg-400)] font-light">{p.desc}</p>
            </PitchCard>
          );
        })}
      </div>
    </div>
  );
}

/* ── Business Slides (14-18) ── */

function Slide14_GTM() {
  const segments = [
    { label: "Enterprise", price: "$5K–30K/mo", desc: "Adobe, Aspen Institute, Microsoft — white-label community hosting at scale", color: "var(--gold)" },
    { label: "SMB", price: "$50–500/mo", desc: "Design communities, professional networks, universities — replacing 7 fragmented tools", color: "#4A9EDE" },
    { label: "Marketplace", price: "15–20% take", desc: "Sponsorship facilitation — brands reach engaged, high-intent communities", color: "#8B5CF6" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>go-to-market</SlideLabel>
      <SlideTitle>start where communities already exist</SlideTitle>
      <div className="flex flex-col gap-4 mt-8 max-w-lg w-full">
        {segments.map((s, i) => (
          <PitchCard key={i} borderColor={s.color} delay={0.3 + i * 0.12} className="text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-[var(--cream)]">{s.label}</h3>
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.price}</span>
            </div>
            <p className="text-sm text-[var(--burg-400)] font-light">{s.desc}</p>
          </PitchCard>
        ))}
      </div>
    </div>
  );
}

function Slide15_Market() {
  const circles = [
    { label: "TAM", value: "$12B", r: 100, color: "var(--burg-700)" },
    { label: "SAM", value: "$2.4B", r: 68, color: "var(--burg-600)" },
    { label: "SOM", value: "$240M", r: 36, color: "var(--gold)" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>market</SlideLabel>
      <SlideTitle>the community platform market</SlideTitle>
      <div className="relative mt-10" style={{ width: 220, height: 220 }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          {circles.map((c, i) => (
            <motion.circle
              key={i}
              cx="110"
              cy="110"
              r={c.r}
              fill="none"
              stroke={c.color}
              strokeWidth={i === 2 ? "3" : "1.5"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
              style={{ transformOrigin: "110px 110px" }}
            />
          ))}
        </svg>
      </div>
      <div className="flex gap-8 mt-8">
        {circles.map((c, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            <span className="text-xl font-bold text-[var(--cream)]">{c.value}</span>
            <span className="text-xs text-[var(--burg-400)]">{c.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Slide16_Revenue() {
  const streams = [
    { name: "Communities", price: "$50–500/mo", desc: "Professional infrastructure replacing 7 fragmented tools", color: "var(--gold)" },
    { name: "Enterprises", price: "$5K–30K/mo", desc: "White-label community hosting + intelligence at scale", color: "#4A9EDE" },
    { name: "Marketplace", price: "15–20% take", desc: "Sponsorship facilitation — brands pay to reach engaged communities", color: "#8B5CF6" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>revenue</SlideLabel>
      <SlideTitle>three revenue streams</SlideTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl w-full">
        {streams.map((s, i) => (
          <PitchCard key={i} borderColor={s.color} delay={0.3 + i * 0.12}>
            <h3 className="text-base font-semibold text-[var(--cream)] mb-1">{s.name}</h3>
            <div className="text-2xl font-bold mb-2" style={{ color: s.color }}>{s.price}</div>
            <p className="text-sm text-[var(--burg-400)] font-light">{s.desc}</p>
          </PitchCard>
        ))}
      </div>
    </div>
  );
}

function Slide17_Traction() {
  const customers = [
    { name: "Adobe", detail: "2.4M community members", status: "Pilot discussions" },
    { name: "Aspen Institute Spain", detail: "Leadership programs", status: "Pilot customer" },
    { name: "Wakelet", detail: "Education platform", status: "Pilot customer" },
    { name: "Aspen Institute UK", detail: "Civic leadership", status: "In conversation" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>traction</SlideLabel>
      <SlideTitle>early momentum</SlideTitle>
      <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg w-full">
        {customers.map((c, i) => (
          <PitchCard key={i} delay={0.3 + i * 0.1} className="text-left">
            <h3 className="text-sm font-semibold text-[var(--cream)]">{c.name}</h3>
            <p className="text-xs text-[var(--burg-400)] mt-0.5">{c.detail}</p>
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">{c.status}</span>
          </PitchCard>
        ))}
      </div>
      <motion.div
        className="mt-8 text-sm text-[var(--burg-400)] font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-[var(--burg-300)] font-medium">Advisors:</span>{" "}
        Jeremy Rishel (CTO, SoFi) &bull; Chester Chipperfield (ex-Tesla/Apple)
      </motion.div>
    </div>
  );
}

function Slide18_Forecast() {
  const phases = [
    { label: "Phase 1", period: "Mo 1–8", arr: "$200K", users: "20K", customers: "3", pct: 7 },
    { label: "Phase 2", period: "Mo 9–16", arr: "$1.2M", users: "100K", customers: "28", pct: 40 },
    { label: "Phase 3", period: "Mo 17–24", arr: "$3M+", users: "300K", customers: "65", pct: 100 },
  ];
  const colors = ["var(--gold)", "#4A9EDE", "#8B5CF6"];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>forecast</SlideLabel>
      <SlideTitle>path to $3M ARR</SlideTitle>
      <div className="flex flex-col gap-4 mt-8 max-w-lg w-full">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            className="text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors[i] }}>{p.label}</span>
                <span className="text-xs text-[var(--burg-500)]">{p.period}</span>
              </div>
              <span className="text-lg font-bold text-[var(--cream)]">{p.arr}</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--burg-800)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colors[i] }}
                initial={{ width: 0 }}
                animate={{ width: `${p.pct}%` }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex gap-4 mt-1">
              <span className="text-[10px] text-[var(--burg-500)]">{p.users} users</span>
              <span className="text-[10px] text-[var(--burg-500)]">{p.customers} customers</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Closing Slides (19-24) ── */

function Slide19_Team() {
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>team</SlideLabel>
      <SlideTitle>the builders</SlideTitle>
      <div className="grid grid-cols-2 gap-6 mt-8 max-w-lg w-full">
        <PitchCard delay={0.3}>
          <div className="w-14 h-14 rounded-full bg-[var(--gold)] flex items-center justify-center text-xl font-bold text-[var(--burg-deep)] mx-auto mb-3">TK</div>
          <h3 className="text-base font-semibold text-[var(--cream)]">Teijas</h3>
          <span className="text-xs text-[var(--gold)] font-semibold uppercase tracking-wider">CEO</span>
          <p className="text-xs text-[var(--burg-400)] font-light mt-2">Product, execution, customer relationships</p>
        </PitchCard>
        <PitchCard delay={0.45}>
          <div className="w-14 h-14 rounded-full bg-[#4A9EDE] flex items-center justify-center text-xl font-bold text-[var(--burg-deep)] mx-auto mb-3">WP</div>
          <h3 className="text-base font-semibold text-[var(--cream)]">William Powers</h3>
          <span className="text-xs text-[#4A9EDE] font-semibold uppercase tracking-wider">Co-founder</span>
          <p className="text-xs text-[var(--burg-400)] font-light mt-2">Vision, institutional partnerships</p>
        </PitchCard>
      </div>
      <motion.div
        className="mt-8 text-sm text-[var(--burg-400)] font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="text-[var(--burg-300)] font-medium">Advisors:</span>{" "}
        Jeremy Rishel (CTO, SoFi) &bull; Chester Chipperfield (ex-Tesla/Apple)
      </motion.div>
    </div>
  );
}

function Slide20_Vision() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <SlideLabel>vision</SlideLabel>
      <motion.div
        className="mb-8 text-[var(--cream)]"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <AnimatedRootsLogo size={160} />
      </motion.div>
      <SlideTitle delay={0.5}>the civic layer of the internet</SlideTitle>
      <SlideSubtitle delay={0.7}>
        A world where every community has professional infrastructure, economic opportunity, and
        AI-powered intelligence — without algorithmic manipulation.
      </SlideSubtitle>
    </div>
  );
}

function Slide21_Roadmap() {
  const milestones = [
    { phase: "Phase 1", period: "Mo 1–8", label: "Foundation", items: ["3 enterprise pilots", "Intelligence platform live", "AI bot deployment"], color: "var(--gold)" },
    { phase: "Phase 2", period: "Mo 9–16", label: "Validation", items: ["Sponsorship marketplace", "100K users", "$1.2M ARR"], color: "#4A9EDE" },
    { phase: "Phase 3", period: "Mo 17–24", label: "Scale", items: ["Series A position", "300K users", "$3M ARR"], color: "#8B5CF6" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>roadmap</SlideLabel>
      <SlideTitle>24-month plan</SlideTitle>
      <div className="grid grid-cols-3 gap-4 mt-8 max-w-3xl w-full">
        {milestones.map((m, i) => (
          <PitchCard key={i} borderColor={m.color} delay={0.3 + i * 0.15} className="text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: m.color }}>{m.phase} &middot; {m.period}</span>
            <h3 className="text-base font-semibold text-[var(--cream)] mt-1 mb-2">{m.label}</h3>
            <ul className="space-y-1">
              {m.items.map((item, j) => (
                <li key={j} className="text-xs text-[var(--burg-400)] font-light flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </PitchCard>
        ))}
      </div>
    </div>
  );
}

function Slide22_Funds() {
  const allocations = [
    { label: "Engineering", pct: 45, amount: "$1.35M", color: "var(--gold)" },
    { label: "Sales & Community", pct: 25, amount: "$750K", color: "#4A9EDE" },
    { label: "Operations", pct: 15, amount: "$450K", color: "#8B5CF6" },
    { label: "Marketing", pct: 15, amount: "$450K", color: "#22C55E" },
  ];
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <SlideLabel>use of funds</SlideLabel>
      <SlideTitle>$3M seed allocation</SlideTitle>
      <div className="flex flex-col gap-4 mt-8 max-w-md w-full">
        {allocations.map((a, i) => (
          <motion.div
            key={i}
            className="text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[var(--cream)]">{a.label}</span>
              <span className="text-sm font-bold" style={{ color: a.color }}>{a.amount}</span>
            </div>
            <div className="h-2.5 rounded-full bg-[var(--burg-800)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: a.color }}
                initial={{ width: 0 }}
                animate={{ width: `${a.pct}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-sm text-[var(--burg-400)] font-light mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        24-month runway to Series A
      </motion.p>
    </div>
  );
}

function Slide23_Ask() {
  const terms = [
    { label: "Raising", value: "$3M" },
    { label: "Equity", value: "8%" },
    { label: "Post-Money", value: "$37.5M" },
    { label: "Runway", value: "24 months" },
  ];
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <SlideLabel>the ask</SlideLabel>
      <SlideTitle>$3M seed round</SlideTitle>
      <PitchCard delay={0.3} className="mt-8 max-w-sm w-full">
        <div className="grid grid-cols-2 gap-4">
          {terms.map((t, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="text-xl font-bold text-[var(--cream)]">{t.value}</div>
              <div className="text-xs text-[var(--burg-400)] mt-0.5">{t.label}</div>
            </motion.div>
          ))}
        </div>
      </PitchCard>
      <motion.div
        className="mt-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <span className="text-sm text-[var(--burg-300)]">Target: $3M ARR &bull; 300K users &rarr; Series A</span>
        <div className="flex items-center gap-2 mt-4">
          <Mail className="w-4 h-4 text-[var(--gold)]" />
          <span className="text-sm text-[var(--gold)]">teijas@centralsquare.com</span>
        </div>
      </motion.div>
    </div>
  );
}

function Slide24_Thanks() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <motion.div
        className="mb-8 text-[var(--cream)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <BreathingNetworkLogo size={100} />
      </motion.div>
      <motion.h1
        className="font-serif lowercase text-5xl md:text-7xl text-[var(--cream)] tracking-tight"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        thank you
      </motion.h1>
      <motion.div
        className="mt-8 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-sm text-[var(--burg-300)]">centralsquare.com</span>
        <span className="text-sm text-[var(--gold)]">teijas@centralsquare.com</span>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE REGISTRY
   ═══════════════════════════════════════════════════ */

const slides = [
  Slide0_Title,
  Slide1_Problem,
  Slide2_PlatformsFail,
  Slide3_Opportunity,
  Slide4_Solution,
  Slide5_Pain,
  Slide6_StackProblem,
  Slide7_Onboarding,
  Slide8_BotDeploy,
  Slide9_Dashboard,
  Slide10_Ellie,
  Slide11_ColdStart,
  Slide12_Flywheel,
  Slide13_Pillars,
  Slide14_GTM,
  Slide15_Market,
  Slide16_Revenue,
  Slide17_Traction,
  Slide18_Forecast,
  Slide19_Team,
  Slide20_Vision,
  Slide21_Roadmap,
  Slide22_Funds,
  Slide23_Ask,
  Slide24_Thanks,
];

/* ═══════════════════════════════════════════════════
   MAIN DECK COMPONENT
   ═══════════════════════════════════════════════════ */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "6%" : "-6%",
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-6%" : "6%",
    opacity: 0,
    scale: 0.98,
  }),
};

export function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= slides.length || idx === current) return;
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const SlideComponent = slides[current];

  return (
    <div className="fixed inset-0 bg-[var(--burg-deep)] intel-constellation-bg overflow-hidden select-none">
      {/* Slide content */}
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-24"
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Click zones for navigation */}
      <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer z-10" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer z-10" onClick={next} />

      {/* Navigation arrows (visible on hover) */}
      {current > 0 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-[var(--burg-800)] flex items-center justify-center text-[var(--burg-400)] hover:text-[var(--cream)] hover:border-[var(--burg-700)] transition-all opacity-0 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-[var(--burg-800)] flex items-center justify-center text-[var(--burg-400)] hover:text-[var(--cream)] hover:border-[var(--burg-700)] transition-all opacity-0 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-[var(--gold)]"
                : "w-2 h-2 bg-[var(--burg-700)] hover:bg-[var(--burg-600)]"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-20 text-xs text-[var(--burg-600)]">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
