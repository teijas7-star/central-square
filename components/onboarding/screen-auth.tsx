"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";

interface ScreenAuthProps {
  onBack: () => void;
  onAuth: () => void;
}

export function ScreenAuth({ onBack, onAuth }: ScreenAuthProps) {
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
      </button>

      {/* Header */}
      <motion.div
        className="mt-8 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[var(--cs-gray-900)] tracking-tight">
          Let&apos;s get you started
        </h2>
        <p className="text-[var(--cs-gray-500)] mt-2 text-base">
          Quick sign in so we can save your community.
        </p>
      </motion.div>

      {/* Auth Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Google */}
        <button
          onClick={onAuth}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--cs-gray-200)] bg-white hover:border-[var(--cs-gray-300)] hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[var(--cs-gray-200)] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="text-base font-medium text-[var(--cs-gray-800)]">
            Continue with Google
          </span>
        </button>

        {/* Apple */}
        <button
          onClick={onAuth}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--cs-gray-200)] bg-white hover:border-[var(--cs-gray-300)] hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="white">
              <path d="M13.37 10.58c-.01-1.96 1.6-2.9 1.67-2.95-. 91-1.33-2.33-1.51-2.83-1.53-.2-.01-1.33-.02-2.07.69-.48.46-.9 1.18-.9 1.18s-.46-.08-.97-.08c-.52 0-1.37.08-2.24.75-.87.67-1.46 1.79-1.46 3.14 0 2.1 1.43 4.85 2.64 6.35.55.68 1.21 1.44 2.09 1.41.84-.03 1.15-.54 2.16-.54s1.29.54 2.17.52c.9-.02 1.47-.69 2.02-1.37.64-.78.9-1.54.92-1.58-.02-.01-1.77-.68-1.78-2.71zM11.73 4.34c.46-.56.77-1.33.68-2.11-.66.03-1.46.44-1.93 1-.42.49-.79 1.27-.69 2.03.74.06 1.49-.38 1.94-.92z" />
            </svg>
          </div>
          <span className="text-base font-medium text-[var(--cs-gray-800)]">
            Continue with Apple
          </span>
        </button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--cs-gray-200)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[var(--cs-gray-50)] text-[var(--cs-gray-400)]">
              or
            </span>
          </div>
        </div>

        {/* Email */}
        {!showEmailInput ? (
          <button
            onClick={() => setShowEmailInput(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--cs-gray-200)] bg-white hover:border-[var(--cs-gray-300)] hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--cs-gray-100)] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[var(--cs-gray-600)]" />
            </div>
            <span className="text-base font-medium text-[var(--cs-gray-800)]">
              Continue with Email
            </span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cs-gray-400)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@designcircle.co"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[var(--cs-gray-200)] bg-white text-base focus:outline-none focus:border-[var(--cs-orange-400)] transition-colors placeholder:text-[var(--cs-gray-300)]"
                autoFocus
              />
            </div>
            <button
              onClick={onAuth}
              disabled={!email.includes("@")}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
            >
              Send Magic Link
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom text */}
      <div className="mt-auto pt-8">
        <p className="text-center text-sm text-[var(--cs-gray-400)]">
          We&apos;ll never post without your permission.
          <br />
          Your data stays yours.
        </p>
      </div>
    </div>
  );
}
