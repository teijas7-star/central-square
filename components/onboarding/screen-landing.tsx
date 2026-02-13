"use client";

import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Users, Building2, ArrowRight } from "lucide-react";
import { AnimatedRootsLogo } from "../CSLogos/animated-logos";

interface ScreenLandingProps {
  onSelectRole: (role: "operator" | "member") => void;
}

/* Community photo cards — these simulate real community snapshots.
   On iOS these will respond to device tilt via DeviceMotion API;
   on web they track the cursor for a parallax effect. */
const communityPhotos = [
  {
    id: 1,
    emoji: "🎨",
    label: "Design Circle SF",
    members: "214 members",
    color: "from-rose-900/40 to-pink-900/30",
    rotate: -6,
    x: "8%",
    y: "5%",
  },
  {
    id: 2,
    emoji: "🏃",
    label: "SF Run Club",
    members: "1.2k members",
    color: "from-amber-900/40 to-orange-900/30",
    rotate: 4,
    x: "58%",
    y: "0%",
  },
  {
    id: 3,
    emoji: "📚",
    label: "Book Lovers NYC",
    members: "890 members",
    color: "from-emerald-900/40 to-teal-900/30",
    rotate: -3,
    x: "2%",
    y: "55%",
  },
  {
    id: 4,
    emoji: "🎵",
    label: "Indie Music LA",
    members: "3.4k members",
    color: "from-violet-900/40 to-purple-900/30",
    rotate: 7,
    x: "55%",
    y: "50%",
  },
];

export function ScreenLanding({ onSelectRole }: ScreenLandingProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Cursor-tracking parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural feel
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Parallax layers — each card moves differently
  const layer1X = useTransform(springX, [-200, 200], [-12, 12]);
  const layer1Y = useTransform(springY, [-200, 200], [-8, 8]);
  const layer2X = useTransform(springX, [-200, 200], [8, -8]);
  const layer2Y = useTransform(springY, [-200, 200], [6, -6]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-8">
      {/* Logo + Brand — BIGGER */}
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Large AnimatedRootsLogo */}
        <motion.div
          className="w-24 h-24 flex items-center justify-center mb-5 text-[var(--cream)]"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedRootsLogo size={80} />
        </motion.div>

        <h1 className="font-serif lowercase text-4xl text-[var(--cream)] tracking-tight">
          central square
        </h1>
        <p className="text-[var(--burg-300)] font-light text-base mt-2 tracking-wide">
          where communities come alive
        </p>
      </motion.div>

      {/* Interactive community photo grid — responds to cursor/touch */}
      <motion.div
        className="flex-1 flex items-center justify-center mb-8 relative cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="relative w-full max-w-sm h-52">
          {/* Community photo cards with parallax */}
          {communityPhotos.map((photo, i) => {
            const isOddLayer = i % 2 === 0;
            return (
              <motion.div
                key={photo.id}
                className={`absolute w-[42%] rounded-2xl overflow-hidden border border-[var(--burg-700)]/50 bg-gradient-to-br ${photo.color} backdrop-blur-sm cursor-pointer`}
                style={{
                  left: photo.x,
                  top: photo.y,
                  rotate: photo.rotate,
                  x: isOddLayer ? layer1X : layer2X,
                  y: isOddLayer ? layer1Y : layer2Y,
                  zIndex: hoveredCard === photo.id ? 20 : 10 - i,
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: 0,
                  zIndex: 30,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 1.05 }}
                onHoverStart={() => setHoveredCard(photo.id)}
                onHoverEnd={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.12 }}
              >
                {/* Card content */}
                <div className="p-3">
                  {/* Emoji avatar row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--burg-800)]/80 flex items-center justify-center">
                      <span className="text-lg">{photo.emoji}</span>
                    </div>
                    <div className="flex -space-x-1.5">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full border border-[var(--burg-800)] bg-[var(--burg-700)]"
                          style={{
                            opacity: 1 - j * 0.2,
                          }}
                        />
                      ))}
                      <div className="w-5 h-5 rounded-full border border-[var(--burg-800)] bg-[var(--burg-800)] flex items-center justify-center">
                        <span className="text-[7px] text-[var(--cream)]">+</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--cream)] block leading-tight">
                    {photo.label}
                  </span>
                  <span className="text-[10px] text-[var(--burg-300)] font-light">
                    {photo.members}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Center glowing roots logo */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15]"
            animate={{
              boxShadow: [
                "0 0 20px rgba(245, 237, 224, 0.1)",
                "0 0 40px rgba(245, 237, 224, 0.2)",
                "0 0 20px rgba(245, 237, 224, 0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--burg-deep)] border border-[var(--burg-700)] flex items-center justify-center text-[var(--cream)]">
              <AnimatedRootsLogo size={36} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Role Selection */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-center text-sm font-light text-[var(--burg-300)] mb-3">
          How would you like to get started?
        </p>

        {/* Operator CTA - Primary */}
        <button
          onClick={() => onSelectRole("operator")}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] hover:border-[var(--burg-700)] hover:shadow-lg hover:shadow-[var(--burg-900)]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-[var(--burg-deep)]" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-serif lowercase text-base text-[var(--cream)] block">
              build a community
            </span>
            <span className="text-sm text-[var(--burg-300)] font-light">
              I want to create or manage a community
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--burg-400)] group-hover:text-[var(--cream)] transition-colors" />
        </button>

        {/* Member CTA - Secondary */}
        <button
          onClick={() => onSelectRole("member")}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[var(--burg-800)] bg-[var(--burg-900)] hover:border-[var(--burg-700)] hover:shadow-lg hover:shadow-[var(--burg-900)]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[var(--burg-deep)]" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-serif lowercase text-base text-[var(--cream)] block">
              join a community
            </span>
            <span className="text-sm text-[var(--burg-300)] font-light">
              I have an invite or want to explore
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--burg-400)] group-hover:text-[var(--cream)] transition-colors" />
        </button>
      </motion.div>

      {/* Terms */}
      <p className="text-center text-xs text-[var(--burg-400)] mt-5">
        By continuing, you agree to our{" "}
        <span className="underline">Terms</span> and{" "}
        <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}
