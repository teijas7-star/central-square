"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, Sparkles, Mic, MessageSquare, BarChart3 } from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";
import { AnimatedRootsLogo } from "../CSLogos/animated-logos";

interface ScreenAIIntroProps {
  onBack: () => void;
  onContinue: () => void;
}

function TiltCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof motion.div>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function AudioWaveform() {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[var(--burg-deep)]"
          animate={{
            height: ["30%", "100%", "50%", "80%", "30%"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          style={{ opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

export function ScreenAIIntro({ onBack, onContinue }: ScreenAIIntroProps) {
  const capabilities = [
    {
      icon: Mic,
      title: "Voice-first setup",
      desc: "Just talk \u2014 I'll build your community from our conversation",
    },
    {
      icon: MessageSquare,
      title: "Smart suggestions",
      desc: "I'll recommend modules and set up integrations based on your community",
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
      <motion.button
        onClick={onBack}
        className="self-start p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
      </motion.button>

      {/* AI Avatar + Greeting */}
      <motion.div
        className="flex flex-col items-center mt-10 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating avatar */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <AIHostAvatar size="xl" />
        </motion.div>
        <div className="mt-6 flex items-center gap-2">
          {/* Sparkle with slow rotation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          </motion.div>
          <span className="text-sm font-medium text-[var(--gold)]">
            AI Community Partner
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
        <h2 className="font-serif lowercase text-2xl text-[var(--cream)] tracking-tight">
          hey! i&apos;m your ai host
        </h2>
        <p className="text-[var(--burg-300)] mt-2 text-base leading-relaxed font-light">
          I&apos;ll build your community home in about 90 seconds.
          Just tell me about it — I&apos;ll handle the rest.
        </p>
      </motion.div>

      {/* Capabilities with 3D tilt */}
      <motion.div
        className="space-y-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {capabilities.map((cap, i) => (
          <TiltCard
            key={cap.title}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--burg-900)] border border-[var(--burg-800)] cursor-default"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--burg-800)]">
              <cap.icon className="w-5 h-5 text-[var(--cream)]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[var(--cream)] block">
                {cap.title}
              </span>
              <span className="text-xs text-[var(--burg-300)] leading-relaxed font-light">
                {cap.desc}
              </span>
            </div>
          </TiltCard>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="mt-auto">
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base flex items-center justify-center gap-2 bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Pulsing mic icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mic className="w-5 h-5" />
          </motion.div>
          <span>Start Talking</span>
          {/* Audio waveform behind the button content */}
          <AudioWaveform />
        </motion.button>

        <button
          onClick={onContinue}
          className="w-full mt-3 py-3 text-sm font-medium text-[var(--burg-400)] hover:text-[var(--burg-300)] transition-colors"
        >
          I&apos;d rather type instead
        </button>
      </div>
    </div>
  );
}
