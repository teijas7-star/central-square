"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenFollowupProps {
  onBack: () => void;
  onComplete: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  multi?: boolean;
}

const questions: Question[] = [
  {
    id: "size",
    question: "How big is your community right now?",
    options: ["Just starting out", "Under 100", "100-500", "500-2,000", "2,000+"],
  },
  {
    id: "goals",
    question: "What matters most for your community?",
    options: [
      "Member engagement",
      "Event management",
      "Content sharing",
      "Revenue / monetization",
      "Member networking",
      "Learning & growth",
    ],
    multi: true,
  },
  {
    id: "tools",
    question: "Which tools are you currently using?",
    options: [
      "WhatsApp / Telegram",
      "Instagram / TikTok",
      "Eventbrite / Lu.ma",
      "Slack / Discord",
      "Google Sheets",
      "Notion",
    ],
    multi: true,
  },
];

/* Blinking cursor component for typewriter effect */
function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-0.5 h-4 bg-[var(--cream)] ml-1 align-middle"
      animate={{ opacity: [1, 1, 0, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.49, 0.5, 0.99, 1] }}
    />
  );
}

/* Progress bar shimmer effect */
function ProgressShimmer() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
      }}
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
    />
  );
}

export function ScreenFollowup({ onBack, onComplete }: ScreenFollowupProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [prevCanProceed, setPrevCanProceed] = useState(false);

  const question = questions[currentQ];
  const selectedAnswers = answers[question.id] || [];

  const toggleAnswer = (option: string) => {
    const current = answers[question.id] || [];
    if (question.multi) {
      setAnswers({
        ...answers,
        [question.id]: current.includes(option)
          ? current.filter((a) => a !== option)
          : [...current, option],
      });
    } else {
      setAnswers({ ...answers, [question.id]: [option] });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete();
    }
  };

  const canProceed = selectedAnswers.length > 0;

  // Detect when canProceed flips to true for bounce trigger
  const [shouldBounce, setShouldBounce] = useState(false);
  useEffect(() => {
    if (canProceed && !prevCanProceed) {
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCanProceed(canProceed);
  }, [canProceed, prevCanProceed]);

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <motion.button
          onClick={() => (currentQ > 0 ? setCurrentQ(currentQ - 1) : onBack())}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
        </motion.button>
        <span className="text-sm font-medium text-[var(--cream)]">
          {currentQ + 1} of {questions.length}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress bar with shimmer */}
      <div className="h-1 rounded-full bg-[var(--burg-800)] mb-8 overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-[var(--cream)] relative overflow-hidden"
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        >
          <ProgressShimmer />
        </motion.div>
      </div>

      {/* AI Avatar + Question with typewriter cursor */}
      <div className="flex items-start gap-3 mb-8">
        <AIHostAvatar size="sm" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--burg-900)] rounded-2xl rounded-tl-sm border border-[var(--burg-800)] px-4 py-3 flex-1"
          >
            <p className="font-serif text-base text-[var(--cream)]">
              {question.question}
              <BlinkingCursor />
            </p>
            {question.multi && (
              <p className="text-xs text-[var(--burg-400)] mt-1">
                Select all that apply
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="flex-1 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {question.options.map((option, i) => {
            const isSelected = selectedAnswers.includes(option);
            return (
              <motion.button
                key={option}
                onClick={() => toggleAnswer(option)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[var(--cream)] bg-[var(--burg-800)]"
                    : "border-[var(--burg-800)] bg-[var(--burg-900)]"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "inset 3px 0 0 0 var(--burg-600)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Checkbox with spring animation */}
                <motion.div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "border-[var(--cream)] bg-[var(--cream)]"
                      : "border-[var(--burg-500)]"
                  }`}
                  animate={isSelected ? {
                    scale: [1, 1.3, 0.9, 1.05, 1],
                  } : {
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <Check className="w-4 h-4 text-[var(--burg-deep)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span
                  className={`text-sm font-light ${
                    isSelected
                      ? "text-[var(--cream)]"
                      : "text-[var(--burg-300)]"
                  }`}
                >
                  {option}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Continue button with bounce when canProceed becomes true */}
      <motion.button
        onClick={handleNext}
        disabled={!canProceed}
        className="w-full mt-6 py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base disabled:opacity-40 transition-all bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
        whileHover={canProceed ? { scale: 1.02 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
        animate={shouldBounce ? {
          y: [0, -6, 0, -3, 0],
        } : {
          y: 0,
        }}
        transition={shouldBounce ? {
          duration: 0.5,
          ease: "easeOut",
        } : {}}
      >
        {currentQ < questions.length - 1 ? "Next" : "Build My Arcade"}
      </motion.button>
    </div>
  );
}
