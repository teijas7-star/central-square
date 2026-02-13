"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock } from "lucide-react";

interface ScreenAuthProps {
  onBack: () => void;
  onAuth: () => void;
}

export function ScreenAuth({ onBack, onAuth }: ScreenAuthProps) {
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Google icon hover state
  const [googleHovered, setGoogleHovered] = useState(false);
  // Apple icon hover state
  const [appleHovered, setAppleHovered] = useState(false);

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-10">
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="self-start p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
      </motion.button>

      {/* Header */}
      <motion.div
        className="mt-8 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-serif lowercase text-2xl text-[var(--cream)] tracking-tight">
          let&apos;s get you started
        </h2>
        <p className="text-[var(--burg-300)] mt-2 text-base font-light">
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
        <motion.button
          onClick={onAuth}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] transition-all"
          whileHover={{ scale: 1.02, borderColor: "var(--burg-600)" }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setGoogleHovered(true)}
          onHoverEnd={() => setGoogleHovered(false)}
        >
          <motion.div
            className="w-10 h-10 rounded-xl bg-[var(--burg-800)] flex items-center justify-center shrink-0"
            animate={googleHovered ? { rotate: [0, -10, 10, -5, 5, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
          <span className="text-base font-medium text-[var(--cream)]">
            Continue with Google
          </span>
        </motion.button>

        {/* Apple */}
        <motion.button
          onClick={onAuth}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] transition-all"
          whileHover={{ scale: 1.02, borderColor: "var(--burg-600)" }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setAppleHovered(true)}
          onHoverEnd={() => setAppleHovered(false)}
        >
          <motion.div
            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0"
            animate={appleHovered ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="white">
              <path d="M13.37 10.58c-.01-1.96 1.6-2.9 1.67-2.95-. 91-1.33-2.33-1.51-2.83-1.53-.2-.01-1.33-.02-2.07.69-.48.46-.9 1.18-.9 1.18s-.46-.08-.97-.08c-.52 0-1.37.08-2.24.75-.87.67-1.46 1.79-1.46 3.14 0 2.1 1.43 4.85 2.64 6.35.55.68 1.21 1.44 2.09 1.41.84-.03 1.15-.54 2.16-.54s1.29.54 2.17.52c.9-.02 1.47-.69 2.02-1.37.64-.78.9-1.54.92-1.58-.02-.01-1.77-.68-1.78-2.71zM11.73 4.34c.46-.56.77-1.33.68-2.11-.66.03-1.46.44-1.93 1-.42.49-.79 1.27-.69 2.03.74.06 1.49-.38 1.94-.92z" />
            </svg>
          </motion.div>
          <span className="text-base font-medium text-[var(--cream)]">
            Continue with Apple
          </span>
        </motion.button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--burg-800)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[var(--burg-deep)] text-[var(--burg-400)]">
              or
            </span>
          </div>
        </div>

        {/* Email */}
        {!showEmailInput ? (
          <motion.button
            onClick={() => setShowEmailInput(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] transition-all"
            whileHover={{ scale: 1.02, borderColor: "var(--burg-600)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--burg-800)] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[var(--cream)]" />
            </div>
            <span className="text-base font-medium text-[var(--cream)]">
              Continue with Email
            </span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--burg-400)]" />
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={isFocused ? {
                  boxShadow: [
                    "0 0 0px 0px rgba(245, 237, 224, 0)",
                    "0 0 12px 2px rgba(245, 237, 224, 0.15)",
                    "0 0 6px 1px rgba(245, 237, 224, 0.08)",
                  ],
                } : {
                  boxShadow: "0 0 0px 0px rgba(245, 237, 224, 0)",
                }}
                transition={isFocused ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="maya@designcircle.co"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] text-[var(--cream)] text-base focus:outline-none focus:border-[var(--cream)] transition-colors placeholder:text-[var(--burg-600)]"
                autoFocus
              />
            </div>
            <motion.button
              onClick={onAuth}
              disabled={!email.includes("@")}
              className="relative w-full py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base disabled:opacity-40 transition-all bg-[var(--cream)] hover:bg-[var(--cream-dark)] overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                }}
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}
              />
              <span className="relative z-10">Send Magic Link</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom text with animated lock */}
      <div className="mt-auto pt-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lock className="w-3.5 h-3.5 text-[var(--burg-500)]" />
          </motion.div>
        </div>
        <p className="text-center text-sm text-[var(--burg-400)]">
          We&apos;ll never post without your permission.
          <br />
          Your data stays yours.
        </p>
      </div>
    </div>
  );
}
