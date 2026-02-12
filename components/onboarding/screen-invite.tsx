"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export function ScreenInvite({ onBack, onComplete }: ScreenInviteProps) {
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<InvitedMember[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "member">("member");

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
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
        </button>
        <span className="text-sm font-medium text-[var(--cs-gray-400)]">
          Invite
        </span>
        <button
          onClick={onComplete}
          className="text-sm font-medium text-[var(--cs-gray-400)] hover:text-[var(--cs-gray-600)]"
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
        <h2 className="text-2xl font-bold text-[var(--cs-gray-900)] tracking-tight">
          Invite your team
        </h2>
        <p className="text-[var(--cs-gray-500)] mt-1 text-sm">
          Add your core team first — you can invite the wider community later.
        </p>
      </motion.div>

      {/* Share link */}
      <motion.div
        className="bg-white rounded-2xl border border-[var(--cs-gray-100)] p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-xs font-semibold text-[var(--cs-gray-500)] uppercase tracking-wider block mb-3">
          Share invite link
        </span>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--cs-gray-50)] border border-[var(--cs-gray-100)]">
            <Link2 className="w-4 h-4 text-[var(--cs-gray-400)] shrink-0" />
            <span className="text-sm text-[var(--cs-gray-500)] truncate">
              csq.app/join/design-circle-sf
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-xl transition-all shrink-0 ${
              copied
                ? "bg-[var(--cs-success)] text-white"
                : "bg-[var(--cs-gray-100)] text-[var(--cs-gray-600)] hover:bg-[var(--cs-gray-200)]"
            }`}
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Share options */}
        <div className="flex gap-2 mt-3">
          {[
            { icon: Share2, label: "Share" },
            { icon: QrCode, label: "QR Code" },
          ].map((opt) => (
            <button
              key={opt.label}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--cs-gray-200)] hover:bg-[var(--cs-gray-50)] transition-colors"
            >
              <opt.icon className="w-4 h-4 text-[var(--cs-gray-500)]" />
              <span className="text-xs font-medium text-[var(--cs-gray-600)]">
                {opt.label}
              </span>
            </button>
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
        <span className="text-xs font-semibold text-[var(--cs-gray-500)] uppercase tracking-wider block mb-3">
          Invite by email
        </span>

        {/* Role selector */}
        <div className="flex gap-1.5 mb-3">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedRole === role.value
                  ? "bg-[var(--cs-orange-500)] text-white"
                  : "bg-[var(--cs-gray-100)] text-[var(--cs-gray-500)]"
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
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--cs-gray-200)] bg-white text-sm focus:outline-none focus:border-[var(--cs-orange-400)] transition-colors placeholder:text-[var(--cs-gray-300)]"
            onKeyDown={(e) => e.key === "Enter" && addInvite()}
          />
          <button
            onClick={addInvite}
            disabled={!email.includes("@")}
            className="px-4 rounded-xl bg-[var(--cs-orange-500)] text-white disabled:opacity-30 transition-opacity"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        {/* Invited list */}
        {invited.length > 0 && (
          <div className="space-y-2">
            {invited.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--cs-gray-100)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--cs-orange-100)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--cs-orange-600)]">
                      {member.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--cs-gray-800)] block">
                      {member.email}
                    </span>
                    <span className="text-[10px] text-[var(--cs-gray-400)] capitalize">
                      {member.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeInvite(i)}
                  className="p-1 rounded-lg hover:bg-[var(--cs-gray-100)]"
                >
                  <X className="w-4 h-4 text-[var(--cs-gray-400)]" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom CTAs */}
      <div className="space-y-2 mt-6">
        <motion.button
          onClick={onComplete}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base"
          style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
          whileTap={{ scale: 0.98 }}
        >
          {invited.length > 0
            ? `Send ${invited.length} invite${invited.length > 1 ? "s" : ""} & Enter Arcade`
            : "Enter My Arcade"}
        </motion.button>
      </div>
    </div>
  );
}
