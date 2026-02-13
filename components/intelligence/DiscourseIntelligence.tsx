"use client";

import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Hash, TrendingUp } from "lucide-react";
import { discourseData } from "./mock-data";
import { SectionHeader, IntelligenceCard, TrendPill } from "./shared";
import { MetricCard } from "./charts/MetricCard";
import { TrendingTopics } from "./charts/TrendingTopics";
import { SentimentTimeline } from "./charts/SentimentTimeline";
import type { CrossCommunityTrend, TopicCluster } from "./mock-data";

/* ── Cross-community trend card ── */
function CrossCommunityCard({
  trend,
  index,
}: {
  trend: CrossCommunityTrend;
  index: number;
}) {
  const maxVolume = Math.max(...trend.communities.map((c) => c.volume));

  return (
    <motion.div
      className="bg-[var(--burg-800)] border border-[var(--burg-800)] rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      whileHover={{
        y: -2,
        borderColor: "var(--burg-700)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Hash className="w-4 h-4 text-[var(--gold)]" />
        <span className="text-sm font-semibold text-[var(--cream)]">
          {trend.topic}
        </span>
      </div>
      <div className="space-y-2">
        {trend.communities.map((comm, ci) => (
          <div key={comm.name} className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--burg-400)] w-28 truncate shrink-0">
              {comm.name}
            </span>
            <div className="flex-1 h-2 rounded-full bg-[var(--burg-700)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    comm.sentiment >= 0.5
                      ? "var(--cs-success)"
                      : comm.sentiment >= 0
                      ? "var(--gold)"
                      : "var(--cs-error)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(comm.volume / maxVolume) * 100}%` }}
                transition={{
                  delay: 0.5 + index * 0.1 + ci * 0.05,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            </div>
            <span className="text-[10px] text-[var(--burg-300)] w-8 text-right shrink-0">
              {comm.volume}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Topic cluster map ── */
function TopicClusterMap({
  clusters,
  delay,
}: {
  clusters: TopicCluster[];
  delay: number;
}) {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl bg-[var(--burg-800)]">
      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full">
        {clusters.map((cluster) =>
          cluster.connections.map((connId) => {
            const target = clusters.find((c) => c.id === connId);
            if (!target) return null;
            return (
              <motion.line
                key={`${cluster.id}-${connId}`}
                x1={`${cluster.x}%`}
                y1={`${cluster.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="var(--burg-700)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: delay + 0.5, duration: 0.5 }}
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {clusters.map((cluster, i) => {
        const nodeSize = 24 + cluster.size * 4;
        return (
          <motion.div
            key={cluster.id}
            className="absolute flex items-center justify-center rounded-full bg-[var(--burg-700)] border border-[var(--burg-600)] cursor-pointer"
            style={{
              width: nodeSize,
              height: nodeSize,
              left: `${cluster.x}%`,
              top: `${cluster.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: delay + i * 0.06,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{
              scale: 1.3,
              zIndex: 10,
              backgroundColor: "var(--burg-600)",
              borderColor: "var(--cream)",
              boxShadow: "0 0 16px rgba(245, 237, 224, 0.15)",
            }}
          >
            <span
              className="text-[var(--cream)] font-medium whitespace-nowrap"
              style={{ fontSize: Math.max(8, cluster.size + 1) }}
            >
              {cluster.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function DiscourseIntelligence() {
  const stats = discourseData.summaryStats;

  return (
    <div className="space-y-6">
      {/* Row 1: Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label={stats.totalConversations.label}
          value={stats.totalConversations.value}
          trend={stats.totalConversations.trend}
          suffix="K"
          icon={MessageCircle}
          index={0}
        />
        <MetricCard
          label={stats.avgSentiment.label}
          value={stats.avgSentiment.value}
          trend={stats.avgSentiment.trend}
          trendSuffix=""
          icon={ThumbsUp}
          index={1}
        />
        <MetricCard
          label={stats.activeTopics.label}
          value={stats.activeTopics.value}
          trend={stats.activeTopics.trend}
          icon={Hash}
          index={2}
        />
      </div>

      {/* Row 2: Trending Topics + Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelligenceCard delay={0.2}>
          <SectionHeader title="Trending Topics" subtitle="By volume & sentiment" delay={0.25} />
          <TrendingTopics topics={discourseData.trendingTopics} delay={0.3} />
        </IntelligenceCard>

        <IntelligenceCard delay={0.3}>
          <SectionHeader title="Sentiment Timeline" subtitle="Last 30 days" delay={0.35} />
          <SentimentTimeline data={discourseData.sentimentTimeline} delay={0.4} />
        </IntelligenceCard>
      </div>

      {/* Row 3: Cross-Community Trends */}
      <div>
        <SectionHeader
          title="Cross-Community Trends"
          subtitle="How topics trend across communities"
          delay={0.4}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {discourseData.crossCommunityTrends.map((trend, i) => (
            <CrossCommunityCard key={trend.topic} trend={trend} index={i} />
          ))}
        </div>
      </div>

      {/* Row 4: Topic Cluster Map */}
      <IntelligenceCard delay={0.6}>
        <SectionHeader
          title="Topic Cluster Map"
          subtitle="Interconnected conversation themes"
          delay={0.65}
        />
        <TopicClusterMap clusters={discourseData.topicClusters} delay={0.7} />
      </IntelligenceCard>
    </div>
  );
}
