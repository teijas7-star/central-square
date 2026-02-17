"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenBotPollDemoProps {
  onBack: () => void;
  onComplete: () => void;
}

type DemoPhase = "ask" | "deploying" | "responses" | "analyze";

const suggestedQuestions = [
  "What events do you want?",
  "Best day for meetups?",
  "What tools do you use?",
];

const mockResponses = [
  { name: "Sarah C.", avatar: "SC", text: "Workshop on AI tools" },
  { name: "Marcus R.", avatar: "MR", text: "Portfolio review night" },
  { name: "Priya P.", avatar: "PP", text: "Networking mixer" },
  { name: "James W.", avatar: "JW", text: "Design systems talk" },
];

const mockResults = [
  { label: "AI tools", count: 34, percentage: 38, color: "var(--cream)" },
  { label: "Portfolio", count: 28, percentage: 31, color: "var(--gold)" },
  { label: "Mixer", count: 18, percentage: 20, color: "var(--burg-400)" },
  { label: "Systems", count: 9, percentage: 10, color: "var(--burg-600)" },
];

/* ── Animated number display ── */
function AnimatedCount({ target }: { target: number }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  return <motion.span>{display}</motion.span>;
}

/* ── Typing dots animation ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--burg-400)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/* ── Chat bubble ── */
function ChatBubble({
  name,
  avatar,
  text,
  isBot,
  index,
}: {
  name: string;
  avatar: string;
  text: string;
  isBot?: boolean;
  index: number;
}) {
  return (
    <motion.div
      className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"}`}
      initial={{ opacity: 0, x: isBot ? -20 : 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1,
      }}
    >
      <div className="w-7 h-7 rounded-full bg-[var(--burg-700)] flex items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-[var(--cream)]">
          {avatar}
        </span>
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
          isBot
            ? "bg-[var(--burg-700)] rounded-tl-sm"
            : "bg-[var(--burg-800)] rounded-tr-sm"
        }`}
      >
        {!isBot && (
          <span className="text-[9px] text-[var(--burg-400)] font-medium block mb-0.5">
            {name}
          </span>
        )}
        <span className="text-xs text-[var(--cream)]">{text}</span>
      </div>
    </motion.div>
  );
}

/* ── Mini vertical bar ── */
function MiniBar({
  label,
  percentage,
  color,
  count,
  index,
}: {
  label: string;
  percentage: number;
  color: string;
  count: number;
  index: number;
}) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full h-20 flex items-end">
        <motion.div
          className="w-full rounded-t-md"
          style={{ backgroundColor: color }}
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-[8px] text-[var(--burg-400)] mt-1 truncate w-full text-center">
        {label}
      </span>
      <span className="text-[10px] font-semibold text-[var(--cream)]">{count}</span>
    </div>
  );
}

/* ── Data flow particles ── */
function DataFlowParticles() {
  return (
    <div className="relative h-10 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: ["var(--cream)", "var(--gold)", "var(--burg-300)"][i % 3],
            left: `${15 + i * 14}%`,
          }}
          initial={{ y: -4, opacity: 0 }}
          animate={{
            y: 44,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN BOT POLL DEMO (main export)
   ══════════════════════════════════════════ */

export function ScreenBotPollDemo({
  onBack,
  onComplete,
}: ScreenBotPollDemoProps) {
  const [phase, setPhase] = useState<DemoPhase>("ask");
  const [question, setQuestion] = useState("");
  const [visibleResponses, setVisibleResponses] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSend = useCallback(() => {
    if (!question.trim()) return;
    setPhase("deploying");

    // Auto-advance to responses after 1.5s
    const t1 = setTimeout(() => {
      setPhase("responses");

      // Stagger response appearance
      mockResponses.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleResponses((prev) => prev + 1);
        }, 800 * (i + 1));
        timeoutsRef.current.push(t);
      });

      // Advance to analyze after all responses
      const t2 = setTimeout(() => {
        setShowAnalysis(true);
        setPhase("analyze");
      }, 800 * (mockResponses.length + 1) + 500);
      timeoutsRef.current.push(t2);
    }, 1500);
    timeoutsRef.current.push(t1);
  }, [question]);

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
          Bot Demo
        </span>
        <motion.button
          onClick={onComplete}
          className="text-sm text-[var(--burg-400)] hover:text-[var(--cream)] transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          Skip
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        <AnimatePresence mode="wait">
          {/* ── Phase 1: ASK ── */}
          {phase === "ask" && (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* AI Host prompt */}
              <div className="flex items-start gap-3 mt-2">
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
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span className="text-xs font-semibold text-[var(--gold)]">
                      Try It Live
                    </span>
                  </div>
                  <p className="text-sm text-[var(--burg-300)] font-light">
                    Ask your community a question! Watch the bot gather
                    responses and turn them into intelligence.
                  </p>
                </motion.div>
              </div>

              {/* Question input */}
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type a question for your community..."
                  className="w-full bg-[var(--burg-900)] border border-[var(--burg-700)] rounded-xl px-4 py-3 pr-12 text-sm text-[var(--cream)] placeholder:text-[var(--burg-500)] focus:outline-none focus:border-[var(--cream)] transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    question.trim()
                      ? "bg-[var(--cream)] text-[var(--burg-deep)]"
                      : "bg-[var(--burg-800)] text-[var(--burg-500)]"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Suggested questions */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--burg-500)] font-semibold">
                  Suggestions
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button
                      key={q}
                      onClick={() => setQuestion(q)}
                      className="px-3 py-1.5 rounded-full border border-[var(--burg-700)] bg-[var(--burg-900)] text-xs text-[var(--burg-300)] hover:border-[var(--cream)] hover:text-[var(--cream)] transition-colors"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Phase 2-3: DEPLOYING + RESPONSES ── */}
          {(phase === "deploying" ||
            phase === "responses" ||
            phase === "analyze") && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Question banner */}
              <motion.div
                className="text-center py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-[10px] uppercase tracking-wider text-[var(--gold)] font-semibold">
                  Polling via WhatsApp
                </span>
              </motion.div>

              {/* Chat mock */}
              <div className="bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-4 space-y-3 min-h-[200px]">
                {/* Bot message */}
                <ChatBubble
                  name="CS Bot"
                  avatar="🤖"
                  text={`📊 Poll from Design Circle SF:\n"${question}"\n\nReply with your preference!`}
                  isBot
                  index={0}
                />

                {/* Typing dots while deploying */}
                {phase === "deploying" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-9"
                  >
                    <TypingDots />
                  </motion.div>
                )}

                {/* Member responses */}
                {(phase === "responses" || phase === "analyze") &&
                  mockResponses.slice(0, visibleResponses).map((resp, i) => (
                    <ChatBubble
                      key={resp.name}
                      name={resp.name}
                      avatar={resp.avatar}
                      text={resp.text}
                      index={i}
                    />
                  ))}
              </div>

              {/* Response counter */}
              {(phase === "responses" || phase === "analyze") && (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span className="text-xs text-[var(--burg-300)]">
                    <AnimatedCount target={visibleResponses * 22} /> responses
                    collected
                  </span>
                </motion.div>
              )}

              {/* ── Phase 3: ANALYZE ── */}
              {phase === "analyze" && showAnalysis && (
                <>
                  {/* Data flow particles */}
                  <DataFlowParticles />

                  {/* Mini intelligence viz */}
                  <motion.div
                    className="bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl p-4"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span className="text-xs font-semibold text-[var(--gold)]">
                        Intelligence Generated
                      </span>
                    </div>

                    {/* Mini bar chart */}
                    <div className="flex gap-2 mb-3">
                      {mockResults.map((r, i) => (
                        <MiniBar
                          key={r.label}
                          label={r.label}
                          percentage={r.percentage * 2.5}
                          color={r.color}
                          count={r.count}
                          index={i}
                        />
                      ))}
                    </div>

                    {/* AI insight */}
                    <motion.div
                      className="flex items-start gap-2 p-3 rounded-xl bg-[var(--burg-800)] border border-[var(--burg-700)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <AIHostAvatar size="sm" />
                      <div>
                        <p className="text-xs text-[var(--cream)] font-medium">
                          Based on responses, your community wants hands-on
                          workshops!
                        </p>
                        <p className="text-[10px] text-[var(--burg-400)] mt-0.5">
                          87% response rate · strongest signal: AI tools
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <motion.button
        onClick={onComplete}
        className={`w-full mt-4 py-4 rounded-2xl font-semibold text-base transition-colors ${
          phase === "analyze"
            ? "bg-[var(--cream)] text-[var(--burg-deep)] hover:bg-[var(--cream-dark)]"
            : "bg-[var(--burg-800)] text-[var(--burg-400)]"
        }`}
        whileHover={phase === "analyze" ? { scale: 1.02 } : {}}
        whileTap={phase === "analyze" ? { scale: 0.98 } : {}}
        animate={
          phase === "analyze"
            ? { opacity: 1, y: 0 }
            : { opacity: 0.6, y: 0 }
        }
      >
        {phase === "analyze"
          ? "Launch Intelligence Dashboard"
          : "Complete demo to continue"}
      </motion.button>
    </div>
  );
}
