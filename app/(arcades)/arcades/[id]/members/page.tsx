"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  User,
  Award,
  MessageSquare,
} from "lucide-react";
import ArcadeDashboardLayout from "@/components/ArcadeDashboardLayout";
import { SequentialBloomLogo } from "@/components/CSLogos/animated-logos";

interface Member {
  id: string;
  name: string;
  role: "host" | "member";
  avatarUrl?: string;
  activity: string;
  contributionCount: number;
}

export default function ArcadeDashboardMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [arcadeId, setArcadeId] = useState<string>("");
  const [arcadeName, setArcadeName] = useState<string>("Central Square Arcade");
  const [city, setCity] = useState<string>("Boston, MA");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      role: "host",
      activity: "Hosted 3 events this month",
      contributionCount: 45,
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "member",
      activity: "Top contributor in discussions",
      contributionCount: 32,
    },
    {
      id: "3",
      name: "Jordan Taylor",
      role: "member",
      activity: "New member, high engagement",
      contributionCount: 12,
    },
  ]);

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
          setCity(arcadeData.arcade.city || "Boston, MA");
        }
      } catch (error) {
        console.error("Failed to load arcade:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const filteredMembers = members.filter((member) =>
    searchQuery === "" || member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Members
          </h2>
          <p className="text-neutral-600">Manage your community members</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Search members..."
            />
          </div>
        </div>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-neutral-50">
            <p className="text-neutral-600">No members found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white border border-neutral-200 rounded-lg p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
                      {member.role === "host" && (
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Host
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">{member.activity}</p>
                    <div className="flex items-center mt-2 text-sm text-neutral-500">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{member.contributionCount} contributions</span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-200 transition-colors flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ArcadeDashboardLayout>
  );
}



