"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MobileShell } from "@/components/onboarding/mobile-shell";
import { ProgressDots } from "@/components/onboarding/progress-dots";
import { ScreenLanding } from "@/components/onboarding/screen-landing";
import { ScreenAuth } from "@/components/onboarding/screen-auth";
import { ScreenAIIntro } from "@/components/onboarding/screen-ai-intro";
import { ScreenVoice } from "@/components/onboarding/screen-voice";
import { ScreenFollowup } from "@/components/onboarding/screen-followup";
import { ScreenBuilding } from "@/components/onboarding/screen-building";
import { ScreenModules } from "@/components/onboarding/screen-modules";
import { ScreenPreview } from "@/components/onboarding/screen-preview";
import { ScreenBotConnect } from "@/components/onboarding/screen-bot-connect";
import { ScreenBotPollDemo } from "@/components/onboarding/screen-bot-poll-demo";

type Step =
  | "landing"
  | "auth"
  | "ai-intro"
  | "voice"
  | "followup"
  | "building"
  | "modules"
  | "preview"
  | "bot-connect"
  | "bot-poll-demo"
  | "complete";

const stepOrder: Step[] = [
  "landing",
  "auth",
  "ai-intro",
  "voice",
  "followup",
  "building",
  "modules",
  "preview",
  "bot-connect",
  "bot-poll-demo",
];

const stepIndex = (step: Step) => stepOrder.indexOf(step);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("landing");
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const goTo = useCallback(
    (next: Step) => {
      const currentIdx = stepIndex(step);
      const nextIdx = stepIndex(next);
      setDirection(nextIdx > currentIdx ? 1 : -1);
      setStep(next);
    },
    [step]
  );

  const goBack = useCallback(() => {
    const idx = stepIndex(step);
    if (idx > 0) {
      goTo(stepOrder[idx - 1]);
    }
  }, [step, goTo]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "30%" : "-30%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      opacity: 0,
    }),
  };

  // Don't show progress dots on landing, building, or complete
  const showProgress = !["landing", "building", "complete"].includes(step);
  const progressStep = Math.max(0, stepIndex(step) - 1); // offset by 1 since landing is step 0
  const totalSteps = stepOrder.length - 2; // exclude landing and building

  return (
    <MobileShell>
      {/* Progress dots */}
      {showProgress && (
        <div className="px-6 pt-2 pb-1">
          <ProgressDots total={totalSteps} current={progressStep} />
        </div>
      )}

      {/* Screen content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1 flex flex-col"
        >
          {step === "landing" && (
            <ScreenLanding
              onSelectRole={(role) => {
                if (role === "operator") goTo("auth");
                // member flow TBD
              }}
            />
          )}

          {step === "auth" && (
            <ScreenAuth
              onBack={goBack}
              onAuth={() => goTo("ai-intro")}
            />
          )}

          {step === "ai-intro" && (
            <ScreenAIIntro
              onBack={goBack}
              onContinue={() => goTo("voice")}
            />
          )}

          {step === "voice" && (
            <ScreenVoice
              onBack={goBack}
              onComplete={() => goTo("followup")}
            />
          )}

          {step === "followup" && (
            <ScreenFollowup
              onBack={goBack}
              onComplete={() => goTo("building")}
            />
          )}

          {step === "building" && (
            <ScreenBuilding onComplete={() => goTo("modules")} />
          )}

          {step === "modules" && (
            <ScreenModules
              onBack={goBack}
              onContinue={() => goTo("preview")}
            />
          )}

          {step === "preview" && (
            <ScreenPreview
              onBack={goBack}
              onContinue={() => goTo("bot-connect")}
            />
          )}

          {step === "bot-connect" && (
            <ScreenBotConnect
              onBack={goBack}
              onContinue={() => goTo("bot-poll-demo")}
            />
          )}

          {step === "bot-poll-demo" && (
            <ScreenBotPollDemo
              onBack={goBack}
              onComplete={() => setStep("complete")}
            />
          )}

          {step === "complete" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[var(--cream)]"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M12 20L18 26L28 14"
                    stroke="var(--burg-deep)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <motion.h2
                className="font-serif lowercase text-2xl text-[var(--cream)] text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                your community is live!
              </motion.h2>
              <motion.p
                className="text-[var(--burg-300)] text-center mt-2 text-sm font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your home is ready and integrations are gathering intelligence.
              </motion.p>
              <motion.button
                className="mt-8 px-8 py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/intelligence")}
              >
                Enter Your Community
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </MobileShell>
  );
}
