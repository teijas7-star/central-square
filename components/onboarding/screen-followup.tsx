"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function ScreenFollowup({ onBack, onComplete }: ScreenFollowupProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

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

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => (currentQ > 0 ? setCurrentQ(currentQ - 1) : onBack())}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
        </button>
        <span className="text-sm font-medium text-[var(--cs-gray-400)]">
          {currentQ + 1} of {questions.length}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-[var(--cs-gray-100)] mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #FF6B35, #4A90E2)" }}
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* AI Avatar + Question */}
      <div className="flex items-start gap-3 mb-8">
        <AIHostAvatar size="sm" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl rounded-tl-sm border border-[var(--cs-gray-100)] px-4 py-3 flex-1"
          >
            <p className="text-base font-semibold text-[var(--cs-gray-900)]">
              {question.question}
            </p>
            {question.multi && (
              <p className="text-xs text-[var(--cs-gray-400)] mt-1">
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
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-[var(--cs-orange-400)] bg-[var(--cs-orange-50)]"
                    : "border-[var(--cs-gray-100)] bg-white hover:border-[var(--cs-gray-200)]"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "border-[var(--cs-orange-500)] bg-[var(--cs-orange-500)]"
                      : "border-[var(--cs-gray-300)]"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-[var(--cs-gray-900)]"
                      : "text-[var(--cs-gray-600)]"
                  }`}
                >
                  {option}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Continue button */}
      <motion.button
        onClick={handleNext}
        disabled={!canProceed}
        className="w-full mt-6 py-4 rounded-2xl font-semibold text-white text-base disabled:opacity-40 transition-all"
        style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
        whileTap={{ scale: 0.98 }}
      >
        {currentQ < questions.length - 1 ? "Next" : "Build My Arcade"}
      </motion.button>
    </div>
  );
}
