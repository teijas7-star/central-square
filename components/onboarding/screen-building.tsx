"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Palette,
  Link2,
  Star,
  Sparkles,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenBuildingProps {
  onComplete: () => void;
}

const buildSteps = [
  {
    icon: Palette,
    label: "Setting up Design Circle SF",
    detail: "Creating your community identity",
  },
  {
    icon: MessageSquare,
    label: "Adding Communication module",
    detail: "Announcements, threads, DMs",
  },
  {
    icon: Calendar,
    label: "Adding Events module",
    detail: "Monthly meetups, portfolio reviews",
  },
  {
    icon: Users,
    label: "Configuring member roles",
    detail: "Mentors, reviewers, members",
  },
  {
    icon: Link2,
    label: "Connecting integrations",
    detail: "WhatsApp, Instagram, Eventbrite",
  },
  {
    icon: BarChart3,
    label: "Enabling insights engine",
    detail: "Cross-module engagement scoring",
  },
  {
    icon: Star,
    label: "Setting up discovery page",
    detail: "Help new members find you",
  },
  {
    icon: Sparkles,
    label: "Finishing touches",
    detail: "Your Arcade is almost ready!",
  },
];

export function ScreenBuilding({ onComplete }: ScreenBuildingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 900;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= buildSteps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    setProgress(((currentStep + 1) / buildSteps.length) * 100);
  }, [currentStep]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      {/* AI Avatar with glow */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AIHostAvatar size="xl" speaking />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-serif lowercase text-xl text-[var(--cream)] text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        building your arcade
      </motion.h2>
      <motion.p
        className="text-sm text-[var(--burg-300)] text-center mb-8 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Configuring everything based on our conversation
      </motion.p>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-2 rounded-full bg-[var(--burg-800)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--cream)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[var(--burg-500)]">
            {Math.round(progress)}%
          </span>
          <span className="text-xs text-[var(--burg-500)]">
            {currentStep + 1}/{buildSteps.length}
          </span>
        </div>
      </div>

      {/* Current step display */}
      <div className="w-full max-w-xs space-y-2">
        <AnimatePresence mode="popLayout">
          {buildSteps.slice(0, currentStep + 1).map((step, i) => {
            const isCurrent = i === currentStep;
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{
                  opacity: isCurrent ? 1 : 0.5,
                  y: 0,
                  height: "auto",
                }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent ? "bg-[var(--burg-800)]" : "bg-[var(--burg-900)]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? "text-[var(--cream)]"
                        : "text-[var(--burg-600)]"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm block truncate ${
                      isCurrent
                        ? "font-semibold text-[var(--cream)]"
                        : "text-[var(--burg-600)]"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-[var(--burg-400)]"
                    >
                      {step.detail}
                    </motion.span>
                  )}
                </div>
                {!isCurrent && i < currentStep && (
                  <div className="w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="white"
                    >
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
