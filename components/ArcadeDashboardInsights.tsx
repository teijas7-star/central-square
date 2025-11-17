"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import ArcadeDashboardLayout from "./ArcadeDashboardLayout";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

export default function ArcadeDashboardInsightsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [arcadeId, setArcadeId] = useState<string>("");
  const [arcadeName, setArcadeName] = useState<string>("Central Square Arcade");
  const [city, setCity] = useState<string>("Boston, MA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setArcadeId(id);

      try {
        const arcadeRes = await fetch(`/api/arcades/${id}`, { cache: "no-store" });
        if (arcadeRes.ok) {
          const arcadeData = await arcadeRes.json();
          setArcadeName(arcadeData.arcade.name);
          setCity("Boston, MA"); // City not available in Arcade model
        }
      } catch (error) {
        console.error("Failed to load arcade:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ArcadeDashboardLayout arcadeId={arcadeId} arcadeName={arcadeName} city={city}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Insights
          </h2>
          <p className="text-neutral-600">Analytics and engagement metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-neutral-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-neutral-800 mb-1">124</p>
            <p className="text-sm text-neutral-600">Total Members</p>
            <p className="text-xs text-green-600 mt-1">+18% this month</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-neutral-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-neutral-800 mb-1">342</p>
            <p className="text-sm text-neutral-600">Total Posts</p>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neutral-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-neutral-800 mb-1">23</p>
            <p className="text-sm text-neutral-600">Total Events</p>
            <p className="text-xs text-green-600 mt-1">+5 this month</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-neutral-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-neutral-800 mb-1">87%</p>
            <p className="text-sm text-neutral-600">Engagement Rate</p>
            <p className="text-xs text-green-600 mt-1">+3% this month</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Activity Over Time</h3>
          <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center">
            <p className="text-neutral-500">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </ArcadeDashboardLayout>
  );
}

