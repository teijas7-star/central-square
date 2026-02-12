"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, MicOff, Pause } from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenVoiceProps {
  onBack: () => void;
  onComplete: () => void;
}

const transcriptLines = [
  {
    speaker: "ai",
    text: "Tell me about your community. What do you do, and who's it for?",
  },
  {
    speaker: "user",
    text: "I run Design Circle SF — it's a design community with about 200 members. We do monthly meetups, portfolio reviews, and mentorship.",
  },
  {
    speaker: "ai",
    text: "Love it! A design community with events, feedback sessions, and mentorship. How do you currently manage everything?",
  },
  {
    speaker: "user",
    text: "Honestly it's a mess — WhatsApp for comms, Eventbrite for events, Instagram for reach, Google Sheets for tracking everything.",
  },
  {
    speaker: "ai",
    text: "Got it. That's exactly what we're here to fix. One more question...",
  },
];

export function ScreenVoice({ onBack, onComplete }: ScreenVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<"idle" | "ai-speaking" | "user-speaking" | "done">("idle");

  // Simulate the conversation flow
  useEffect(() => {
    if (phase === "idle") {
      const timer = setTimeout(() => {
        setPhase("ai-speaking");
        setCurrentLine(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Typing effect
  useEffect(() => {
    if (currentLine >= transcriptLines.length) {
      setPhase("done");
      return;
    }

    const line = transcriptLines[currentLine];
    const fullText = line.text;
    let charIndex = 0;

    if (line.speaker === "ai") {
      setPhase("ai-speaking");
    } else {
      setPhase("user-speaking");
      setIsListening(true);
    }

    setDisplayedText("");

    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        if (line.speaker === "user") {
          setIsListening(false);
        }
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
        }, 1200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentLine]);

  const visibleLines = transcriptLines.slice(0, currentLine + 1);

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
        </button>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cs-gray-100)]">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                phase === "user-speaking"
                  ? "var(--cs-error)"
                  : "var(--cs-success)",
              animation:
                phase === "user-speaking"
                  ? "ai-pulse 1s ease-in-out infinite"
                  : "none",
            }}
          />
          <span className="text-xs font-medium text-[var(--cs-gray-600)]">
            {phase === "done" ? "Done" : "Recording"}
          </span>
        </div>

        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* AI Avatar - smaller during conversation */}
      <div className="flex justify-center mb-6">
        <AIHostAvatar
          size="lg"
          speaking={phase === "ai-speaking"}
          listening={phase === "user-speaking"}
        />
      </div>

      {/* Transcript area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        <AnimatePresence mode="popLayout">
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${line.speaker === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  line.speaker === "ai"
                    ? "bg-white border border-[var(--cs-gray-100)] rounded-tl-sm"
                    : "rounded-tr-sm text-white"
                }`}
                style={
                  line.speaker === "user"
                    ? { background: "linear-gradient(135deg, #FF6B35, #EA580C)" }
                    : {}
                }
              >
                {/* Label */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider block mb-1 ${
                    line.speaker === "ai"
                      ? "text-[var(--cs-orange-500)]"
                      : "text-orange-200"
                  }`}
                >
                  {line.speaker === "ai" ? "AI Host" : "You"}
                </span>
                <p
                  className={`text-sm leading-relaxed ${
                    line.speaker === "ai"
                      ? "text-[var(--cs-gray-700)]"
                      : "text-white"
                  }`}
                >
                  {i === currentLine ? displayedText : line.text}
                  {i === currentLine && (
                    <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {phase === "ai-speaking" && currentLine < transcriptLines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 px-4"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--cs-gray-300)]"
                style={{
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-3">
        {phase !== "done" ? (
          <>
            {/* Mic button */}
            <motion.button
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                isListening ? "bg-red-500" : "bg-[var(--cs-orange-500)]"
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </motion.button>
            <span className="text-xs text-[var(--cs-gray-400)]">
              {isListening ? "Listening..." : "Tap to speak"}
            </span>
          </>
        ) : (
          <motion.button
            onClick={onComplete}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base"
            style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}
