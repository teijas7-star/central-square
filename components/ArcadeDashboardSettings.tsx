"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  UserPlus,
  Users,
  Save,
} from "lucide-react";
import ArcadeDashboardLayout from "@/components/ArcadeDashboardLayout";
import { SequentialBloomLogo } from "@/components/CSLogos/animated-logos";

export default function ArcadeDashboardSettingsPage({
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
            Settings
          </h2>
          <p className="text-neutral-600">Manage your arcade settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Arcade Name
                </label>
                <input
                  type="text"
                  defaultValue={arcadeName}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="Describe your arcade..."
                />
              </div>
              <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Member Management */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Member Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Invite Members</p>
                  <p className="text-sm text-neutral-600">Generate an invite link for new members</p>
                </div>
                <button className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Generate Invite
                </button>
              </div>
              <Link
                href={`/arcades/${arcadeId}/members`}
                className="block text-sm text-neutral-600 hover:text-neutral-900"
              >
                View all members →
              </Link>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">Arcade Visibility</p>
                  <p className="text-sm text-neutral-600">Control who can find and join your arcade</p>
                </div>
                <select className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option>Public</option>
                  <option>Invite Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArcadeDashboardLayout>
  );
}

