"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Mic, MessageSquare, BarChart3 } from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenAIIntroProps {
  onBack: () => void;
  onContinue: () => void;
}

export function ScreenAIIntro({ onBack, onContinue }: ScreenAIIntroProps) {
  const capabilities = [
    {
      icon: Mic,
      title: "Voice-first setup",
      desc: "Just talk — I'll build your community from our conversation",
    },
    {
      icon: MessageSquare,
      title: "Smart suggestions",
      desc: "I'll recommend modules based on what communities like yours need",
    },
    {
      icon: BarChart3,
      title: "Ongoing insights",
      desc: "I'll surface what's working and flag what needs attention",
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
      </button>

      {/* AI Avatar + Greeting */}
      <motion.div
        className="flex flex-col items-center mt-10 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AIHostAvatar size="xl" />
        <div className="mt-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--cs-orange-500)]" />
          <span className="text-sm font-medium text-[var(--cs-orange-500)]">
            AI Community Host
          </span>
        </div>
      </motion.div>

      {/* Greeting text */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-[var(--cs-gray-900)] tracking-tight">
          Hey! I&apos;m your AI Host
        </h2>
        <p className="text-[var(--cs-gray-500)] mt-2 text-base leading-relaxed">
          I&apos;ll help you build your community in about 90 seconds.
          Just tell me about it — I&apos;ll handle the rest.
        </p>
      </motion.div>

      {/* Capabilities */}
      <motion.div
        className="space-y-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[var(--cs-gray-100)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(74,144,226,0.1))",
              }}
            >
              <cap.icon className="w-5 h-5 text-[var(--cs-orange-500)]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[var(--cs-gray-800)] block">
                {cap.title}
              </span>
              <span className="text-xs text-[var(--cs-gray-500)] leading-relaxed">
                {cap.desc}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="mt-auto">
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mic className="w-5 h-5" />
          Start Talking
        </motion.button>

        <button
          onClick={onContinue}
          className="w-full mt-3 py-3 text-sm font-medium text-[var(--cs-gray-500)] hover:text-[var(--cs-gray-700)] transition-colors"
        >
          I&apos;d rather type instead
        </button>
      </div>
    </div>
  );
}
