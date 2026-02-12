"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Image,
  BookOpen,
  BarChart3,
  Users,
  Compass,
  ShoppingBag,
  Link2,
  Sparkles,
  Check,
  Plus,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenModulesProps {
  onBack: () => void;
  onContinue: () => void;
}

interface Module {
  id: string;
  icon: typeof MessageSquare;
  name: string;
  desc: string;
  recommended: boolean;
  category: "core" | "growth" | "integration";
}

const modules: Module[] = [
  {
    id: "comms",
    icon: MessageSquare,
    name: "Communication",
    desc: "Announcements, threads, DMs",
    recommended: true,
    category: "core",
  },
  {
    id: "events",
    icon: Calendar,
    name: "Events",
    desc: "Meetups, RSVPs, reminders",
    recommended: true,
    category: "core",
  },
  {
    id: "content",
    icon: Image,
    name: "Content",
    desc: "Portfolio showcases, galleries",
    recommended: true,
    category: "core",
  },
  {
    id: "learning",
    icon: BookOpen,
    name: "Learning",
    desc: "Workshops, resources, mentorship",
    recommended: true,
    category: "core",
  },
  {
    id: "members",
    icon: Users,
    name: "Member Directory",
    desc: "Profiles, skills, connections",
    recommended: true,
    category: "core",
  },
  {
    id: "insights",
    icon: BarChart3,
    name: "Insights",
    desc: "Engagement analytics, health scores",
    recommended: true,
    category: "growth",
  },
  {
    id: "discovery",
    icon: Compass,
    name: "Discovery",
    desc: "Public page, member acquisition",
    recommended: false,
    category: "growth",
  },
  {
    id: "commerce",
    icon: ShoppingBag,
    name: "Commerce",
    desc: "Tickets, merch, sponsorships",
    recommended: false,
    category: "growth",
  },
];

const integrations = [
  { name: "WhatsApp", connected: true },
  { name: "Instagram", connected: true },
  { name: "Eventbrite", connected: true },
  { name: "Google Sheets", connected: false },
  { name: "Slack", connected: false },
  { name: "Figma", connected: false },
];

export function ScreenModules({ onBack, onContinue }: ScreenModulesProps) {
  const [activeModules, setActiveModules] = useState<string[]>(
    modules.filter((m) => m.recommended).map((m) => m.id)
  );

  const toggleModule = (id: string) => {
    setActiveModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
        </button>
        <span className="text-sm font-medium text-[var(--cs-gray-400)]">
          Modules
        </span>
        <div className="w-9" />
      </div>

      {/* AI recommendation */}
      <div className="flex items-start gap-3 mb-6 mt-2">
        <AIHostAvatar size="sm" />
        <div className="bg-white rounded-2xl rounded-tl-sm border border-[var(--cs-gray-100)] px-4 py-3 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--cs-orange-500)]" />
            <span className="text-xs font-semibold text-[var(--cs-orange-500)]">
              AI Recommended
            </span>
          </div>
          <p className="text-sm text-[var(--cs-gray-600)]">
            Based on design communities like yours, I&apos;ve pre-selected the modules
            that work best. You can customize anytime.
          </p>
        </div>
      </div>

      {/* Modules grid */}
      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-gray-400)] mb-3">
          Core Modules
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {modules
            .filter((m) => m.category === "core")
            .map((mod, i) => {
              const isActive = activeModules.includes(mod.id);
              const Icon = mod.icon;
              return (
                <motion.button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                    isActive
                      ? "border-[var(--cs-orange-300)] bg-[var(--cs-orange-50)]"
                      : "border-[var(--cs-gray-100)] bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Toggle indicator */}
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center ${
                      isActive
                        ? "bg-[var(--cs-orange-500)]"
                        : "border border-[var(--cs-gray-300)]"
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <Icon
                    className={`w-5 h-5 mb-2 ${
                      isActive
                        ? "text-[var(--cs-orange-500)]"
                        : "text-[var(--cs-gray-400)]"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold block ${
                      isActive
                        ? "text-[var(--cs-gray-900)]"
                        : "text-[var(--cs-gray-500)]"
                    }`}
                  >
                    {mod.name}
                  </span>
                  <span className="text-[11px] text-[var(--cs-gray-400)] leading-tight block mt-0.5">
                    {mod.desc}
                  </span>
                </motion.button>
              );
            })}
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-gray-400)] mb-3">
          Growth Modules
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {modules
            .filter((m) => m.category === "growth")
            .map((mod, i) => {
              const isActive = activeModules.includes(mod.id);
              const Icon = mod.icon;
              return (
                <motion.button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                    isActive
                      ? "border-[var(--cs-blue-300)] bg-[var(--cs-blue-50)]"
                      : "border-[var(--cs-gray-100)] bg-white"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center ${
                      isActive
                        ? "bg-[var(--cs-blue-500)]"
                        : "border border-[var(--cs-gray-300)]"
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <Icon
                    className={`w-5 h-5 mb-2 ${
                      isActive
                        ? "text-[var(--cs-blue-500)]"
                        : "text-[var(--cs-gray-400)]"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold block ${
                      isActive
                        ? "text-[var(--cs-gray-900)]"
                        : "text-[var(--cs-gray-500)]"
                    }`}
                  >
                    {mod.name}
                  </span>
                  <span className="text-[11px] text-[var(--cs-gray-400)] leading-tight block mt-0.5">
                    {mod.desc}
                  </span>
                </motion.button>
              );
            })}
        </div>

        {/* Integrations */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-gray-400)] mb-3">
          Connected Integrations
        </h3>
        <div className="space-y-2 mb-4">
          {integrations.map((int) => (
            <div
              key={int.name}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--cs-gray-100)]"
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-[var(--cs-gray-400)]" />
                <span className="text-sm font-medium text-[var(--cs-gray-700)]">
                  {int.name}
                </span>
              </div>
              {int.connected ? (
                <span className="text-xs font-medium text-[var(--cs-success)] bg-green-50 px-2 py-1 rounded-full">
                  Connected
                </span>
              ) : (
                <button className="text-xs font-medium text-[var(--cs-blue-500)] bg-[var(--cs-blue-50)] px-2 py-1 rounded-full flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue */}
      <motion.button
        onClick={onContinue}
        className="w-full mt-4 py-4 rounded-2xl font-semibold text-white text-base"
        style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
        whileTap={{ scale: 0.98 }}
      >
        Continue with {activeModules.length} modules
      </motion.button>
    </div>
  );
}
