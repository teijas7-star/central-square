"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Activity, FileText, Zap, AlertTriangle, X } from "lucide-react";
import { operatorData } from "./mock-data";
import { SectionHeader, IntelligenceCard, TrendPill } from "./shared";
import { MetricCard } from "./charts/MetricCard";
import { AnimatedRadialScore } from "./charts/AnimatedRadialScore";
import { EngagementHeatmap } from "./charts/EngagementHeatmap";
import { AnimatedAreaChart } from "./charts/AnimatedAreaChart";
import { HorizontalBarChart } from "./charts/AnimatedBarChart";
import type { AtRiskMember, BenchmarkMetric } from "./mock-data";

/* ── At-risk member card with drag-to-dismiss ── */
function AtRiskCard({
  member,
  index,
  onDismiss,
}: {
  member: AtRiskMember;
  index: number;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.5 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDismiss();
      }}
      style={{ touchAction: "pan-y" }}
      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--burg-800)] border border-[var(--burg-800)] cursor-grab active:cursor-grabbing"
      whileDrag={{ opacity: 0.7, scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[var(--burg-700)] flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-[var(--cream)]">
          {member.avatar}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--cream)] truncate">
            {member.name}
          </span>
          <span className="text-[10px] text-[var(--burg-500)]">
            {member.role}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-[var(--burg-400)]">
            {member.lastActive}
          </span>
          {member.riskFactors.slice(0, 1).map((f) => (
            <span
              key={f}
              className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Churn probability */}
      <div className="flex flex-col items-end shrink-0">
        <span
          className={`text-sm font-bold ${
            member.churnProbability >= 70
              ? "text-red-400"
              : member.churnProbability >= 50
              ? "text-amber-400"
              : "text-[var(--burg-300)]"
          }`}
        >
          {member.churnProbability}%
        </span>
        <span className="text-[9px] text-[var(--burg-500)]">churn risk</span>
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-[var(--burg-700)] shrink-0"
      >
        <X className="w-3.5 h-3.5 text-[var(--burg-500)]" />
      </button>
    </motion.div>
  );
}

/* ── Format benchmark data for HorizontalBarChart ── */
function formatBenchmarks(benchmarks: BenchmarkMetric[]) {
  return benchmarks.map((b) => {
    const maxVal = Math.max(b.yourValue, b.avgValue, b.topValue);
    return {
      label: b.label,
      unit: b.unit,
      bars: [
        { value: b.yourValue, maxValue: maxVal, label: "You", color: "var(--cream)" },
        { value: b.avgValue, maxValue: maxVal, label: "Avg", color: "var(--burg-600)" },
        { value: b.topValue, maxValue: maxVal, label: "Top 10%", color: "var(--gold)" },
      ],
    };
  });
}

export function OperatorIntelligence() {
  const [atRiskMembers, setAtRiskMembers] = useState(operatorData.atRiskMembers);
  const stats = operatorData.summaryStats;

  const dismissMember = (id: string) => {
    setAtRiskMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label={stats.totalMembers.label}
          value={stats.totalMembers.value}
          trend={stats.totalMembers.trend}
          icon={Users}
          index={0}
        />
        <MetricCard
          label={stats.weeklyActive.label}
          value={stats.weeklyActive.value}
          trend={stats.weeklyActive.trend}
          icon={Activity}
          index={1}
        />
        <MetricCard
          label={stats.totalPosts.label}
          value={stats.totalPosts.value}
          trend={stats.totalPosts.trend}
          icon={FileText}
          index={2}
        />
        <MetricCard
          label={stats.engagementRate.label}
          value={stats.engagementRate.value}
          trend={stats.engagementRate.trend}
          suffix="%"
          icon={Zap}
          index={3}
        />
      </div>

      {/* Row 2: Health Score + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelligenceCard delay={0.2}>
          <SectionHeader title="Community Health Score" delay={0.25} />
          <div className="flex justify-center py-2">
            <AnimatedRadialScore
              score={operatorData.healthScore}
              trend={operatorData.healthTrend}
              breakdown={operatorData.healthBreakdown}
            />
          </div>
        </IntelligenceCard>

        <IntelligenceCard delay={0.3}>
          <SectionHeader title="Engagement Heatmap" subtitle="Last 4 weeks" delay={0.35} />
          <EngagementHeatmap data={operatorData.engagementGrid} />
        </IntelligenceCard>
      </div>

      {/* Row 3: Activity Trend */}
      <IntelligenceCard delay={0.4}>
        <SectionHeader title="Activity Trend" subtitle="6 month overview" delay={0.45} />
        <AnimatedAreaChart
          series={[
            {
              label: "Members",
              data: operatorData.activityTrend.map((d) => d.members),
              color: "var(--cream)",
            },
            {
              label: "Posts",
              data: operatorData.activityTrend.map((d) => d.posts),
              color: "var(--gold)",
            },
            {
              label: "Events",
              data: operatorData.activityTrend.map((d) => d.events * 25),
              color: "var(--burg-400)",
            },
          ]}
          labels={operatorData.activityTrend.map((d) => d.month)}
          delay={0.5}
        />
      </IntelligenceCard>

      {/* Row 4: At-Risk Members + Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelligenceCard delay={0.5}>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader title="At-Risk Members" delay={0.55} />
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] text-red-400 font-medium">
                {atRiskMembers.length} flagged
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {atRiskMembers.map((member, i) => (
                <AtRiskCard
                  key={member.id}
                  member={member}
                  index={i}
                  onDismiss={() => dismissMember(member.id)}
                />
              ))}
            </AnimatePresence>
            {atRiskMembers.length === 0 && (
              <motion.p
                className="text-sm text-[var(--burg-400)] text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                All clear! No members at risk.
              </motion.p>
            )}
          </div>
          <p className="text-[9px] text-[var(--burg-500)] mt-2 text-center">
            Swipe right to dismiss
          </p>
        </IntelligenceCard>

        <IntelligenceCard delay={0.6}>
          <SectionHeader
            title="Benchmark Comparison"
            subtitle="vs. similar design communities"
            delay={0.65}
          />
          <HorizontalBarChart
            data={formatBenchmarks(operatorData.benchmarks)}
            delay={0.7}
          />
        </IntelligenceCard>
      </div>
    </div>
  );
}
