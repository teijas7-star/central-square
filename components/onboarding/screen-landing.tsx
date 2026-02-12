"use client";

import { motion } from "framer-motion";
import { Users, Building2, ArrowRight } from "lucide-react";

interface ScreenLandingProps {
  onSelectRole: (role: "operator" | "member") => void;
}

export function ScreenLanding({ onSelectRole }: ScreenLandingProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
      {/* Logo + Brand */}
      <motion.div
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo mark */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #FF6B35, #4A90E2)" }}
        >
          <svg
            viewBox="0 0 40 40"
            className="w-10 h-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="6" width="12" height="12" rx="3" fill="white" opacity="0.95" />
            <rect x="22" y="6" width="12" height="12" rx="3" fill="white" opacity="0.75" />
            <rect x="6" y="22" width="12" height="12" rx="3" fill="white" opacity="0.75" />
            <rect x="22" y="22" width="12" height="12" rx="3" fill="white" opacity="0.55" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--cs-gray-900)] tracking-tight">
          Central Square
        </h1>
        <p className="text-[var(--cs-gray-500)] text-sm mt-1">
          Where communities come alive
        </p>
      </motion.div>

      {/* Hero illustration area */}
      <motion.div
        className="flex-1 flex items-center justify-center mb-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-64 h-48">
          {/* Abstract community illustration */}
          <div className="absolute top-4 left-8 w-14 h-14 rounded-2xl bg-[var(--cs-orange-100)] flex items-center justify-center animate-float">
            <span className="text-2xl">🎨</span>
          </div>
          <div
            className="absolute top-0 right-8 w-12 h-12 rounded-2xl bg-[var(--cs-blue-100)] flex items-center justify-center animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="text-xl">🏃</span>
          </div>
          <div
            className="absolute bottom-8 left-4 w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center animate-float"
            style={{ animationDelay: "1s" }}
          >
            <span className="text-xl">📚</span>
          </div>
          <div
            className="absolute bottom-4 right-12 w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <span className="text-2xl">🎵</span>
          </div>
          {/* Center connecting element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[var(--cs-orange-50)] border-2 border-[var(--cs-orange-200)] flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(74,144,226,0.15))",
              }}
            >
              <Users className="w-6 h-6 text-[var(--cs-orange-500)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role Selection */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-center text-sm font-medium text-[var(--cs-gray-500)] mb-4">
          How would you like to get started?
        </p>

        {/* Operator CTA - Primary */}
        <button
          onClick={() => onSelectRole("operator")}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--cs-orange-200)] bg-[var(--cs-orange-50)] hover:border-[var(--cs-orange-400)] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--cs-orange-500)] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-base font-semibold text-[var(--cs-gray-900)] block">
              Build a Community
            </span>
            <span className="text-sm text-[var(--cs-gray-500)]">
              I want to create or manage a community
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--cs-gray-400)] group-hover:text-[var(--cs-orange-500)] transition-colors" />
        </button>

        {/* Member CTA - Secondary */}
        <button
          onClick={() => onSelectRole("member")}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--cs-gray-200)] bg-white hover:border-[var(--cs-blue-300)] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--cs-blue-500)] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-base font-semibold text-[var(--cs-gray-900)] block">
              Join a Community
            </span>
            <span className="text-sm text-[var(--cs-gray-500)]">
              I have an invite or want to explore
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--cs-gray-400)] group-hover:text-[var(--cs-blue-500)] transition-colors" />
        </button>
      </motion.div>

      {/* Terms */}
      <p className="text-center text-xs text-[var(--cs-gray-400)] mt-6">
        By continuing, you agree to our{" "}
        <span className="underline">Terms</span> and{" "}
        <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}
