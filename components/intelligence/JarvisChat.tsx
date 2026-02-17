"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Heart,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";
import { AISparkle, IntelligenceCard, TrendPill } from "./shared";
import { AIHostAvatar } from "../onboarding/ai-host-avatar";
import {
  jarvisData,
  JarvisMessage,
  JarvisDataCard,
  SuggestedQuestion,
} from "./mock-data";

/* ── Category icon mapping ── */
const categoryIcons: Record<string, typeof Heart> = {
  health: Heart,
  engagement: TrendingUp,
  members: Users,
  events: Calendar,
  growth: BarChart3,
};

/* ── Typing indicator (3 bouncing dots) ── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)] block mb-1">
            Ellie
          </span>
        </div>
        <div className="flex gap-1 pt-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--burg-600)]"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Inline mini sparkline (SVG) ── */
function MiniSparkline({
  values,
  color = "var(--cream)",
  width = 60,
  height = 24,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── MetricDataCard ── */
function MetricDataCard({ card }: { card: JarvisDataCard }) {
  const { value, trend, label } = card.data;
  return (
    <motion.div
      className="bg-[var(--burg-800)]/50 border border-[var(--burg-700)] rounded-xl p-3 mt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--burg-400)] block mb-1">
        {card.title}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-[var(--cream)]">{value}</span>
        <TrendPill value={trend} />
      </div>
      <span className="text-xs text-[var(--burg-400)]">{label}</span>
    </motion.div>
  );
}

/* ── MembersDataCard ── */
function MembersDataCard({ card }: { card: JarvisDataCard }) {
  const { members } = card.data;
  return (
    <motion.div
      className="bg-[var(--burg-800)]/50 border border-[var(--burg-700)] rounded-xl p-3 mt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--burg-400)] block mb-2">
        {card.title}
      </span>
      <div className="space-y-2">
        {(members as any[]).map((m: any, i: number) => (
          <motion.div
            key={m.name}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            {/* Avatar circle */}
            <div className="w-7 h-7 rounded-full bg-[var(--burg-700)] flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-[var(--cream)]">
                {m.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-[var(--cream)] block truncate">
                {m.name}
              </span>
              <span className="text-[10px] text-[var(--burg-400)] block truncate">
                {m.stat || ""}
              </span>
            </div>
            {/* Sparkline or risk indicator */}
            {m.before && m.after && (
              <div className="flex items-center gap-1">
                <MiniSparkline
                  values={m.before}
                  color="rgba(52, 211, 153, 0.7)"
                  width={40}
                  height={18}
                />
                <span className="text-[9px] text-[var(--burg-500)]">&rarr;</span>
                <MiniSparkline
                  values={m.after}
                  color="rgba(239, 68, 68, 0.7)"
                  width={40}
                  height={18}
                />
              </div>
            )}
            {typeof m.risk === "number" && m.risk > 0 && (
              <span className="text-[10px] font-semibold text-red-400 bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                {m.risk}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── TrendDataCard ── */
function TrendDataCard({ card }: { card: JarvisDataCard }) {
  const { values, labels, direction } = card.data;
  const color =
    direction === "up" ? "rgba(52, 211, 153, 0.8)" : "rgba(239, 68, 68, 0.8)";

  return (
    <motion.div
      className="bg-[var(--burg-800)]/50 border border-[var(--burg-700)] rounded-xl p-3 mt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--burg-400)] block mb-2">
        {card.title}
      </span>
      <div className="flex items-end gap-2">
        <MiniSparkline
          values={values as number[]}
          color={color}
          width={200}
          height={48}
        />
      </div>
      {labels && (
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-[var(--burg-500)]">
            {(labels as string[])[0]}
          </span>
          <span className="text-[9px] text-[var(--burg-500)]">
            {(labels as string[])[(labels as string[]).length - 1]}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ── ComparisonDataCard ── */
function ComparisonDataCard({ card }: { card: JarvisDataCard }) {
  const { items } = card.data;
  return (
    <motion.div
      className="bg-[var(--burg-800)]/50 border border-[var(--burg-700)] rounded-xl p-3 mt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--burg-400)] block mb-2">
        {card.title}
      </span>
      <div className="space-y-2">
        {(items as any[]).map((item: any, i: number) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-[var(--burg-300)]">
                {item.label}
              </span>
              {/* If "yours" and "avg" exist → comparison bars */}
              {item.yours !== undefined && (
                <span className="text-[10px] text-[var(--burg-400)]">
                  You: {item.yours}
                  {item.unit} vs Avg: {item.avg}
                  {item.unit}
                </span>
              )}
              {/* If just "value" → single bar */}
              {item.value !== undefined && item.yours === undefined && (
                <span className="text-[10px] font-semibold text-[var(--cream)]">
                  {item.value}%
                </span>
              )}
            </div>
            {/* Bar visualization */}
            {item.yours !== undefined ? (
              <div className="flex gap-1 items-center">
                <div className="flex-1 h-2 rounded-full bg-[var(--burg-700)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[var(--cream)]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((item.yours / Math.max(item.yours, item.avg, 1)) * 100, 100)}%`,
                    }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <div className="flex-1 h-2 rounded-full bg-[var(--burg-700)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[var(--burg-500)]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((item.avg / Math.max(item.yours, item.avg, 1)) * 100, 100)}%`,
                    }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-2 rounded-full bg-[var(--burg-700)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color || "var(--cream)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── DataCard router ── */
function DataCardRenderer({ card }: { card: JarvisDataCard }) {
  switch (card.type) {
    case "metric":
      return <MetricDataCard card={card} />;
    case "members":
      return <MembersDataCard card={card} />;
    case "trend":
      return <TrendDataCard card={card} />;
    case "comparison":
      return <ComparisonDataCard card={card} />;
    default:
      return null;
  }
}

/* ── Chat message bubble ── */
function MessageBubble({ message }: { message: JarvisMessage }) {
  const isJarvis = message.role === "jarvis";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isJarvis ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 ${
          isJarvis
            ? "bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-tl-sm"
            : "rounded-tr-sm bg-[var(--cream)]"
        }`}
      >
        {/* Speaker label */}
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider block mb-1 ${
            isJarvis ? "text-[var(--gold)]" : "text-[var(--burg-700)]"
          }`}
        >
          {isJarvis ? "Ellie" : "You"}
        </span>

        {/* Message text */}
        <p
          className={`text-sm leading-relaxed font-light ${
            isJarvis ? "text-[var(--burg-300)]" : "text-[var(--burg-deep)]"
          }`}
        >
          {message.content}
        </p>

        {/* Inline data cards */}
        {message.dataCards && message.dataCards.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.dataCards.map((card, i) => (
              <DataCardRenderer key={`${message.id}-card-${i}`} card={card} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Suggested question pill ── */
function QuestionPill({
  question,
  onTap,
  index,
}: {
  question: SuggestedQuestion;
  onTap: (q: SuggestedQuestion) => void;
  index: number;
}) {
  const Icon = categoryIcons[question.category] || Sparkles;

  return (
    <motion.button
      onClick={() => onTap(question)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--burg-900)] border border-[var(--burg-800)] text-sm text-[var(--burg-300)] hover:border-[var(--burg-600)] hover:text-[var(--cream)] transition-colors whitespace-nowrap shrink-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Icon className="w-3.5 h-3.5 text-[var(--gold)]" />
      <span className="text-xs font-medium">{question.text}</span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT: EllieChat
   ══════════════════════════════════════════════════ */

export function JarvisChat() {
  const [messages, setMessages] = useState<JarvisMessage[]>(
    jarvisData.welcomeThread
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Find the response for a given question
  const getResponse = useCallback(
    (text: string): { content: string; dataCards?: JarvisDataCard[] } => {
      // Check if it matches a suggested question
      const match = jarvisData.suggestedQuestions.find(
        (q) => q.text.toLowerCase() === text.toLowerCase()
      );
      if (match && jarvisData.mockResponses[match.id]) {
        return jarvisData.mockResponses[match.id];
      }

      // Fuzzy match: check if input contains key words from any suggestion
      for (const q of jarvisData.suggestedQuestions) {
        const words = q.text.toLowerCase().split(" ");
        const inputWords = text.toLowerCase().split(" ");
        const overlap = words.filter((w) =>
          inputWords.some(
            (iw) => iw.includes(w) || w.includes(iw)
          )
        );
        if (overlap.length >= 3 && jarvisData.mockResponses[q.id]) {
          return jarvisData.mockResponses[q.id];
        }
      }

      return jarvisData.genericResponse;
    },
    []
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: JarvisMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI thinking
      const delay = 1200 + Math.random() * 800;
      setTimeout(() => {
        const response = getResponse(text);
        const jarvisMsg: JarvisMessage = {
          id: `jarvis-${Date.now()}`,
          role: "jarvis",
          content: response.content,
          timestamp: "Just now",
          dataCards: response.dataCards,
        };
        setMessages((prev) => [...prev, jarvisMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping, getResponse]
  );

  const handleSuggestedQuestion = useCallback(
    (q: SuggestedQuestion) => {
      setUsedQuestions((prev) => new Set([...prev, q.id]));
      sendMessage(q.text);
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const availableQuestions = jarvisData.suggestedQuestions.filter(
    (q) => !usedQuestions.has(q.id)
  );

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
      {/* Ellie Header */}
      <motion.div
        className="flex items-center gap-3 pb-4 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AIHostAvatar size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[var(--cream)]">
              Jarvis
            </span>
            <AISparkle text="AI Community Coach" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="text-[11px] text-[var(--burg-400)]">
              Analyzing your community
            </span>
          </div>
        </div>
      </motion.div>

      {/* Message Thread */}
      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4 -mx-6 px-6"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      {/* Suggested Questions */}
      {availableQuestions.length > 0 && (
        <motion.div
          className="py-3 -mx-6 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {availableQuestions.map((q, i) => (
              <QuestionPill
                key={q.id}
                question={q}
                onTap={handleSuggestedQuestion}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Input */}
      <motion.div
        className="pt-2 pb-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your community..."
            disabled={isTyping}
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--burg-600)] transition-colors placeholder:text-[var(--burg-600)] disabled:opacity-50"
          />
          <AnimatePresence>
            {inputValue.trim() && !isTyping && (
              <motion.button
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[var(--cream)] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="w-4 h-4 text-[var(--burg-deep)]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
