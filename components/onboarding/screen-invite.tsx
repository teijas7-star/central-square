"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationControls } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Share2,
  Link2,
  UserPlus,
  X,
  Check,
  Crown,
  Shield,
  User,
  QrCode,
} from "lucide-react";

interface ScreenInviteProps {
  onBack: () => void;
  onComplete: () => void;
}

interface InvitedMember {
  email: string;
  role: "admin" | "moderator" | "member";
}

const roleOptions = [
  { value: "admin" as const, label: "Admin", icon: Crown, desc: "Full access to manage" },
  { value: "moderator" as const, label: "Moderator", icon: Shield, desc: "Can moderate content" },
  { value: "member" as const, label: "Member", icon: User, desc: "Standard access" },
];

/* Shimmer / marquee for the invite link text */
function LinkShimmer() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(90deg, transparent 30%, rgba(245, 237, 224, 0.06) 50%, transparent 70%)",
      }}
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
    />
  );
}

export function ScreenInvite({ onBack, onComplete }: ScreenInviteProps) {
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<InvitedMember[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "member">("member");

  // Track pill positions for sliding indicator
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillMetrics, setPillMetrics] = useState<{ left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update pill indicator position
  useLayoutEffect(() => {
    const el = pillRefs.current[selectedRole];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillMetrics({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [selectedRole]);

  const addInvite = () => {
    if (email.includes("@")) {
      setInvited([...invited, { email, role: selectedRole }]);
      setEmail("");
    }
  };

  const removeInvite = (index: number) => {
    setInvited(invited.filter((_, i) => i !== index));
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--burg-900)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-[var(--burg-400)]" />
        </motion.button>
        <span className="text-sm font-medium text-[var(--cream)]">
          Invite
        </span>
        <button
          onClick={onComplete}
          className="text-sm font-medium text-[var(--burg-400)] hover:text-[var(--cream)]"
        >
          Skip
        </button>
      </div>

      {/* Title */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-serif lowercase text-2xl text-[var(--cream)] tracking-tight">
          invite your team
        </h2>
        <p className="text-[var(--burg-300)] mt-1 text-sm font-light">
          Add your core team first — you can invite the wider community later.
        </p>
      </motion.div>

      {/* Share link */}
      <motion.div
        className="bg-[var(--burg-900)] rounded-2xl border border-[var(--burg-800)] p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider block mb-3">
          Share invite link
        </span>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--burg-800)] border border-[var(--burg-800)] overflow-hidden">
            <Link2 className="w-4 h-4 text-[var(--burg-400)] shrink-0" />
            <span className="text-sm text-[var(--burg-300)] truncate">
              csq.app/join/design-circle-sf
            </span>
            <LinkShimmer />
          </div>
          {/* Copy button with satisfying animation */}
          <motion.button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-xl transition-all shrink-0 ${
              copied
                ? "bg-[var(--gold)] text-[var(--burg-deep)]"
                : "bg-[var(--burg-800)] text-[var(--cream)] hover:bg-[var(--burg-700)]"
            }`}
            whileTap={{ scale: 0.85 }}
            animate={copied ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Share options with hover lift and glow */}
        <div className="flex gap-2 mt-3">
          {[
            { icon: Share2, label: "Share" },
            { icon: QrCode, label: "QR Code" },
          ].map((opt) => (
            <motion.button
              key={opt.label}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--burg-800)] transition-colors"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(245, 237, 224, 0.08)",
                borderColor: "var(--burg-700)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <opt.icon className="w-4 h-4 text-[var(--burg-400)]" />
              <span className="text-xs font-medium text-[var(--burg-300)]">
                {opt.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Email invite */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider block mb-3">
          Invite by email
        </span>

        {/* Role selector with sliding indicator */}
        <div ref={containerRef} className="flex gap-1.5 mb-3 relative">
          {/* Sliding background pill */}
          {pillMetrics && (
            <motion.div
              className="absolute top-0 bottom-0 rounded-full bg-[var(--cream)] z-0"
              animate={{
                left: pillMetrics.left,
                width: pillMetrics.width,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {roleOptions.map((role) => (
            <button
              key={role.value}
              ref={(el) => { pillRefs.current[role.value] = el; }}
              onClick={() => setSelectedRole(role.value)}
              className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedRole === role.value
                  ? "text-[var(--burg-deep)]"
                  : "bg-transparent text-[var(--burg-300)]"
              }`}
            >
              <role.icon className="w-3 h-3" />
              {role.label}
            </button>
          ))}
        </div>

        {/* Email input */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--burg-800)] bg-[var(--burg-900)] text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--cream)] transition-colors placeholder:text-[var(--burg-600)]"
            onKeyDown={(e) => e.key === "Enter" && addInvite()}
          />
          <motion.button
            onClick={addInvite}
            disabled={!email.includes("@")}
            className="px-4 rounded-xl bg-[var(--cream)] text-[var(--burg-deep)] disabled:opacity-30 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Invited list with drag-to-dismiss */}
        {invited.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence>
              {invited.map((member, i) => (
                <motion.div
                  key={`${member.email}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={{ left: 0, right: 0.5 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 120) {
                      removeInvite(i);
                    }
                  }}
                  style={{ touchAction: "pan-y" }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--burg-900)] border border-[var(--burg-800)] cursor-grab active:cursor-grabbing"
                  whileDrag={{
                    opacity: 0.7,
                    scale: 0.98,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--burg-800)] flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--cream)]">
                        {member.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[var(--burg-300)] block">
                        {member.email}
                      </span>
                      <span className="text-[10px] text-[var(--burg-400)] capitalize">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeInvite(i)}
                    className="p-1 rounded-lg hover:bg-[var(--burg-800)]"
                  >
                    <X className="w-4 h-4 text-[var(--burg-500)]" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Bottom CTAs */}
      <div className="space-y-2 mt-6">
        <motion.button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl font-semibold text-[var(--burg-deep)] text-base bg-[var(--cream)] hover:bg-[var(--cream-dark)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={invited.length > 0 ? "send" : "enter"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {invited.length > 0
                ? `Send ${invited.length} invite${invited.length > 1 ? "s" : ""} & Enter Arcade`
                : "Enter My Arcade"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
