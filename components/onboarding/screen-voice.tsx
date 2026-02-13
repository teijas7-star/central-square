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
    text: "I run Design Circle SF \u2014 it's a design community with about 200 members. We do monthly meetups, portfolio reviews, and mentorship.",
  },
  {
    speaker: "ai",
    text: "Love it! A design community with events, feedback sessions, and mentorship. How do you currently manage everything?",
  },
  {
    speaker: "user",
    text: "Honestly it's a mess \u2014 WhatsApp for comms, Eventbrite for events, Instagram for reach, Google Sheets for tracking everything.",
  },
  {
    speaker: "ai",
    text: "Got it. That's exactly what we're here to fix. One more question...",
  },
];

/* Expanding ring animation for mic listening state */
function PulseRings() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-red-400/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6 + i * 0.3, opacity: 0 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

/* Floating particle dots when recording */
function MicParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-red-400/60"
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [-10, -40 - Math.random() * 20],
            x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 50],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 0.5,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

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
        <motion.button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
        </motion.button>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--burg-900)]">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                phase === "user-speaking"
                  ? "#ef4444"
                  : "#22c55e",
              animation:
                phase === "user-speaking"
                  ? "ai-pulse 1s ease-in-out infinite"
                  : "none",
            }}
          />
          <span className="text-xs font-medium text-[var(--burg-300)]">
            {phase === "done" ? "Done" : "Recording"}
          </span>
        </div>

        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* AI Avatar - tilts/leans based on speaker */}
      <div className="flex justify-center mb-6">
        <motion.div
          animate={
            phase === "ai-speaking"
              ? { rotate: [0, -2, 0, 2, 0], scale: 1.02 }
              : phase === "user-speaking"
                ? { rotate: 3, scale: 0.97 }
                : { rotate: 0, scale: 1 }
          }
          transition={{ duration: 1.5, repeat: phase === "ai-speaking" ? Infinity : 0, ease: "easeInOut" }}
        >
          <AIHostAvatar
            size="lg"
            speaking={phase === "ai-speaking"}
            listening={phase === "user-speaking"}
          />
        </motion.div>
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
              drag="x"
              dragConstraints={{ left: -8, right: 8 }}
              dragElastic={0.1}
              whileDrag={{ scale: 1.01 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  line.speaker === "ai"
                    ? "bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-tl-sm"
                    : "rounded-tr-sm bg-[var(--cream)]"
                }`}
              >
                {/* Label */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider block mb-1 ${
                    line.speaker === "ai"
                      ? "text-[var(--gold)]"
                      : "text-[var(--burg-700)]"
                  }`}
                >
                  {line.speaker === "ai" ? "AI Host" : "You"}
                </span>
                <p
                  className={`text-sm leading-relaxed font-light ${
                    line.speaker === "ai"
                      ? "text-[var(--burg-300)]"
                      : "text-[var(--burg-deep)]"
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
                className="w-2 h-2 rounded-full bg-[var(--burg-600)]"
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
            {/* Mic button with pulse rings and particles */}
            <div className="relative">
              {isListening && <PulseRings />}
              {isListening && <MicParticles />}
              <motion.button
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  isListening ? "bg-red-500" : "bg-[var(--cream)]"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsListening(!isListening)}
                animate={isListening ? {
                  boxShadow: [
                    "0 0 0px 0px rgba(239, 68, 68, 0.3)",
                    "0 0 20px 4px rgba(239, 68, 68, 0.15)",
                    "0 0 0px 0px rgba(239, 68, 68, 0.3)",
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isListening ? (
                  <Pause className="w-7 h-7 text-white" />
                ) : (
                  <Mic className="w-7 h-7 text-[var(--burg-deep)]" />
                )}
              </motion.button>
            </div>
            <span className="text-xs text-[var(--burg-300)]">
              {isListening ? "Listening..." : "Tap to speak"}
            </span>
          </>
        ) : (
          <motion.button
            onClick={onComplete}
            className="w-full py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}
