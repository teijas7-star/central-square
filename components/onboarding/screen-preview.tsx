"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Home,
  LayoutGrid,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Calendar,
  Bell,
  Plus,
  Sparkles,
} from "lucide-react";
import { AIHostAvatar } from "./ai-host-avatar";

interface ScreenPreviewProps {
  onBack: () => void;
  onContinue: () => void;
}

export function ScreenPreview({ onBack, onContinue }: ScreenPreviewProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header section */}
      <div className="px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-[var(--cs-gray-100)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--cs-gray-600)]" />
          </button>
          <span className="text-sm font-medium text-[var(--cs-gray-400)]">
            Preview
          </span>
          <div className="w-9" />
        </div>

        {/* AI celebration */}
        <motion.div
          className="flex items-start gap-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AIHostAvatar size="sm" />
          <div className="bg-white rounded-2xl rounded-tl-sm border border-[var(--cs-gray-100)] px-4 py-3 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--cs-orange-500)]" />
              <span className="text-xs font-semibold text-[var(--cs-orange-500)]">
                Your Arcade is ready!
              </span>
            </div>
            <p className="text-sm text-[var(--cs-gray-600)]">
              Here&apos;s a preview of Design Circle SF. You can customize
              everything from your dashboard.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mock Arcade preview */}
      <motion.div
        className="flex-1 mx-4 rounded-t-2xl border border-[var(--cs-gray-200)] border-b-0 bg-white overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Mini app bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--cs-gray-100)]">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #4A90E2)",
              }}
            >
              <span className="text-xs font-bold text-white">DC</span>
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--cs-gray-900)] block leading-tight">
                Design Circle SF
              </span>
              <span className="text-[10px] text-[var(--cs-gray-400)]">
                214 members
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-[var(--cs-gray-400)]" />
            <Settings className="w-4.5 h-4.5 text-[var(--cs-gray-400)]" />
          </div>
        </div>

        {/* Content preview */}
        <div className="p-4 space-y-3">
          {/* Welcome banner */}
          <div
            className="p-4 rounded-xl text-white"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #EA580C)",
            }}
          >
            <span className="text-xs font-medium opacity-80">
              Welcome to your Arcade
            </span>
            <p className="text-sm font-semibold mt-1">
              Get started by inviting your first members
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: MessageSquare, label: "Post" },
              { icon: Calendar, label: "Event" },
              { icon: Users, label: "Invite" },
              { icon: Plus, label: "More" },
            ].map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[var(--cs-gray-50)]"
              >
                <action.icon className="w-5 h-5 text-[var(--cs-gray-500)]" />
                <span className="text-[10px] text-[var(--cs-gray-500)]">
                  {action.label}
                </span>
              </div>
            ))}
          </div>

          {/* Module cards */}
          <div className="space-y-2">
            {/* Upcoming events */}
            <div className="p-3 rounded-xl border border-[var(--cs-gray-100)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--cs-gray-500)] uppercase tracking-wider">
                  Upcoming Events
                </span>
                <Calendar className="w-3.5 h-3.5 text-[var(--cs-gray-400)]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--cs-orange-100)] flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-[var(--cs-orange-600)]">
                    FEB
                  </span>
                  <span className="text-sm font-bold text-[var(--cs-orange-600)] leading-none">
                    15
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-[var(--cs-gray-800)] block">
                    Portfolio Review Night
                  </span>
                  <span className="text-xs text-[var(--cs-gray-400)]">
                    7:00 PM · 24 RSVPs
                  </span>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="p-3 rounded-xl border border-[var(--cs-gray-100)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--cs-gray-500)] uppercase tracking-wider">
                  Community Health
                </span>
                <BarChart3 className="w-3.5 h-3.5 text-[var(--cs-gray-400)]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-end gap-1 mb-1">
                    {[40, 55, 35, 65, 50, 75, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          background:
                            i === 6
                              ? "var(--cs-orange-500)"
                              : "var(--cs-gray-200)",
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: h * 0.4 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--cs-gray-400)]">
                    Last 7 days
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--cs-gray-900)]">
                    92
                  </span>
                  <span className="text-xs text-[var(--cs-success)] block">
                    +12% this week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tab bar preview */}
        <div className="border-t border-[var(--cs-gray-100)] px-4 py-2 flex items-center justify-around mt-auto">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: LayoutGrid, label: "Modules", active: false },
            { icon: Users, label: "Members", active: false },
            { icon: BarChart3, label: "Insights", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((tab) => (
            <div
              key={tab.label}
              className="flex flex-col items-center gap-0.5"
            >
              <tab.icon
                className={`w-5 h-5 ${
                  tab.active
                    ? "text-[var(--cs-orange-500)]"
                    : "text-[var(--cs-gray-400)]"
                }`}
              />
              <span
                className={`text-[9px] ${
                  tab.active
                    ? "text-[var(--cs-orange-500)] font-semibold"
                    : "text-[var(--cs-gray-400)]"
                }`}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA - overlaid at bottom */}
      <div className="px-6 py-4 bg-[var(--cs-gray-50)]">
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base"
          style={{ background: "linear-gradient(135deg, #FF6B35, #EA580C)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Looks great — let&apos;s invite people!
        </motion.button>
      </div>
    </div>
  );
}
