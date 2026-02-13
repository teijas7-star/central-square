"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DollarSign, TrendingUp, Users, Target, Crown, Award, Medal } from "lucide-react";
import { sponsorData } from "./mock-data";
import { SectionHeader, IntelligenceCard, TrendPill } from "./shared";
import { MetricCard } from "./charts/MetricCard";
import { AnimatedFunnel } from "./charts/AnimatedFunnel";
import { AnimatedDonut } from "./charts/AnimatedDonut";
import { VerticalBarChart } from "./charts/AnimatedBarChart";
import type { SponsorBrand } from "./mock-data";

/* ── Parallax tilt card for sponsors (from screen-preview.tsx pattern) ── */
function SponsorParallaxCard({
  brand,
  index,
}: {
  brand: SponsorBrand;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const TierIcon = brand.tier === "platinum" ? Crown : brand.tier === "gold" ? Award : Medal;
  const tierColors = {
    platinum: "text-[var(--cream)] bg-[var(--cream)]/10 border-[var(--cream)]/20",
    gold: "text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/20",
    silver: "text-[var(--burg-300)] bg-[var(--burg-300)]/10 border-[var(--burg-300)]/20",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="bg-[var(--burg-800)] border border-[var(--burg-700)] rounded-2xl p-4 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{
        borderColor: "var(--burg-600)",
        boxShadow: "0 8px 32px rgba(245, 237, 224, 0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{brand.emoji}</span>
          <div>
            <span className="text-sm font-semibold text-[var(--cream)] block">
              {brand.name}
            </span>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium mt-0.5 ${tierColors[brand.tier]}`}
            >
              <TierIcon className="w-3 h-3" />
              {brand.tier.charAt(0).toUpperCase() + brand.tier.slice(1)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-[var(--cream)]">
            {brand.totalROI}x
          </span>
          <span className="text-[10px] text-[var(--burg-400)] block">ROI</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Impressions", value: brand.impressions.toLocaleString() },
          { label: "Engagements", value: brand.engagements.toLocaleString() },
          { label: "Conversions", value: brand.conversions.toLocaleString() },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <span className="text-sm font-semibold text-[var(--cream)] block">
              {m.value}
            </span>
            <span className="text-[9px] text-[var(--burg-500)]">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Revenue bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[var(--burg-400)]">Revenue</span>
          <span className="text-[10px] font-semibold text-[var(--gold)]">
            ${brand.revenue.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--burg-700)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--gold)]"
            initial={{ width: 0 }}
            animate={{
              width: `${(brand.revenue / Math.max(...sponsorData.brands.map((b) => b.revenue))) * 100}%`,
            }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function SponsorIntelligence() {
  const stats = sponsorData.summaryStats;

  const campaignChartData = sponsorData.campaigns.map((c) => ({
    label: c.name.split(" ").slice(0, 2).join(" "),
    value: c.revenue,
    color: c.status === "active" ? "var(--gold)" : "var(--cream)",
    detail: {
      Sponsor: c.sponsor,
      Impressions: c.impressions,
      Clicks: c.clicks,
      Conversions: c.conversions,
      Revenue: `$${c.revenue.toLocaleString()}`,
    },
  }));

  return (
    <div className="space-y-6">
      {/* Row 1: Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label={stats.totalRevenue.label}
          value={stats.totalRevenue.value}
          trend={stats.totalRevenue.trend}
          prefix="$"
          suffix="K"
          icon={DollarSign}
          index={0}
        />
        <MetricCard
          label={stats.avgROI.label}
          value={stats.avgROI.value}
          trend={stats.avgROI.trend}
          suffix="x"
          trendSuffix=""
          icon={TrendingUp}
          index={1}
        />
        <MetricCard
          label={stats.activeSponsors.label}
          value={stats.activeSponsors.value}
          trend={stats.activeSponsors.trend}
          trendSuffix=""
          icon={Users}
          index={2}
        />
        <MetricCard
          label={stats.conversionRate.label}
          value={stats.conversionRate.value}
          trend={stats.conversionRate.trend}
          suffix="%"
          icon={Target}
          index={3}
        />
      </div>

      {/* Row 2: Funnel + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntelligenceCard delay={0.2}>
          <SectionHeader
            title="Conversion Funnel"
            subtitle="Awareness to Purchase"
            delay={0.25}
          />
          <AnimatedFunnel steps={sponsorData.funnel} delay={0.3} />
        </IntelligenceCard>

        <IntelligenceCard delay={0.3}>
          <SectionHeader title="Revenue Breakdown" delay={0.35} />
          <div className="flex justify-center">
            <AnimatedDonut
              segments={sponsorData.revenueBreakdown}
              total={107000}
              delay={0.4}
            />
          </div>
        </IntelligenceCard>
      </div>

      {/* Row 3: Brand Attribution Cards */}
      <div>
        <SectionHeader
          title="Brand Attribution"
          subtitle="Sponsor performance & ROI tracking"
          delay={0.4}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sponsorData.brands.map((brand, i) => (
            <SponsorParallaxCard key={brand.id} brand={brand} index={i} />
          ))}
        </div>
      </div>

      {/* Row 4: Campaign Performance */}
      <IntelligenceCard delay={0.6}>
        <SectionHeader
          title="Campaign Performance"
          subtitle="Revenue by campaign"
          delay={0.65}
        />
        <VerticalBarChart
          data={campaignChartData}
          delay={0.7}
          height={180}
        />
      </IntelligenceCard>
    </div>
  );
}
