"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  MessageSquare,
  Building2,
  Award,
  Share2,
  ThumbsUp,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface ProfileData {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string;
}

interface Conversation {
  id: string;
  tag: string;
  title: string;
  snippet: string;
  likes: number;
  replies: number;
  timeAgo: string;
}

interface ArcadeCard {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
}

interface Person {
  id: string;
  name: string;
  topics: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"hosted" | "member">("hosted");
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);

  // Filler data to showcase the design
  const conversations: Conversation[] = [
    {
      id: "1",
      tag: "#Climate",
      title: "Re: Boston's Green Infrastructure Initiative",
      snippet: "I think we need to consider the equity implications of where these green spaces are being developed. Many lower-income neighborhoods have been...",
      likes: 12,
      replies: 5,
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      tag: "#AI",
      title: "Re: AI Ethics in Local Government",
      snippet: "Transparency is key here. Citizens should have access to understand how AI systems are making decisions that affect their daily lives...",
      likes: 8,
      replies: 3,
      timeAgo: "5 hours ago",
    },
    {
      id: "3",
      tag: "#Democracy",
      title: "Re: Participatory Budgeting Proposal",
      snippet: "Love this initiative! We tried something similar in our neighborhood and saw 67% resident participation. Happy to share our lessons learned...",
      likes: 15,
      replies: 7,
      timeAgo: "1 day ago",
    },
  ];

  const hostedArcades: ArcadeCard[] = [
    {
      id: "1",
      name: "Sustainability Lab",
      description: "Collaborative space for environmental solutions and green technology discussions.",
      category: "Civic Tech",
      memberCount: 234,
    },
    {
      id: "2",
      name: "Boston Housing Forum",
      description: "Discussing affordable housing solutions and urban planning initiatives.",
      category: "Policy",
      memberCount: 156,
    },
  ];

  const memberArcades: ArcadeCard[] = [
    {
      id: "3",
      name: "Tech Ethics Circle",
      description: "Exploring responsible technology development in our communities.",
      category: "Technology",
      memberCount: 189,
    },
  ];

  const people: Person[] = [
    {
      id: "1",
      name: "Marcus Johnson",
      topics: "Climate Policy · Housing",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=marcus",
    },
    {
      id: "2",
      name: "Elena Rodriguez",
      topics: "Tech Ethics · Democracy",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=elena",
    },
    {
      id: "3",
      name: "David Park",
      topics: "Urban Planning · Sustainability",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=david",
    },
  ];

  useEffect(() => {
    loadProfile();
    loadDashboardUrl();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      // Set default profile for demo
      setProfile({
        id: "1",
        name: "Sarah Chen",
        handle: "sarahc",
        bio: "Exploring civic tech & community building through meaningful dialogue and local action.",
        city: "Boston",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardUrl = async () => {
    try {
      const res = await fetch("/api/users/hosted-arcades");
      if (res.ok) {
        const data = await res.json();
        if (data.arcades && data.arcades.length > 0) {
          // Use the first hosted arcade's dashboard
          setDashboardUrl(`/arcades/${data.arcades[0].id}/dashboard`);
        } else {
          // Fallback to the provided dashboard URL if no hosted arcades
          setDashboardUrl("/arcades/cmhelmt0y0001w0yd16mmoi0y/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard URL", error);
      // Fallback to the provided dashboard URL
      setDashboardUrl("/arcades/cmhelmt0y0001w0yd16mmoi0y/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayProfile = profile || {
    id: "1",
    name: "Sarah Chen",
    handle: "sarahc",
    bio: "Exploring civic tech & community building through meaningful dialogue and local action.",
    city: "Boston",
  };

  const avatarUrl =
    displayProfile.avatarUrl ||
    `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${displayProfile.id}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-neutral-100 to-neutral-200 border-b border-neutral-200 relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Top Right: Dashboard Icon */}
          {dashboardUrl && (
            <div className="absolute top-6 right-6">
              <Link
                href={dashboardUrl}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar and Info */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-neutral-200 overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt={displayProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
                  {displayProfile.name}
                </h1>
                <p className="text-base text-neutral-600 mb-2">
                  @{displayProfile.handle} · {displayProfile.city || "Boston"} Square Member
                </p>
                {displayProfile.bio && (
                  <p className="text-base text-neutral-700 mb-4 max-w-2xl">
                    {displayProfile.bio}
                  </p>
                )}
                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-neutral-900">127</span>
                    <span className="text-neutral-600 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">89</span>
                    <span className="text-neutral-600 ml-1">Replies</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">5</span>
                    <span className="text-neutral-600 ml-1">Communities</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">342</span>
                    <span className="text-neutral-600 ml-1">Followers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                Follow
              </button>
              <button className="px-6 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            {/* Conversations Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <SequentialBloomLogo size={32} />
                  </div>
                  Conversations You've Joined
                </h2>
                {/* Filter Tags */}
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-sm rounded-full">
                    #Climate
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-sm rounded-full">
                    #AI
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-sm rounded-full">
                    #Democracy
                  </span>
                </div>
              </div>

              {/* Conversation Cards */}
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                            {conv.tag}
                          </span>
                          <span className="text-sm text-neutral-500">{conv.timeAgo}</span>
                        </div>
                        <h3 className="text-base font-medium text-neutral-900 mb-2">
                          {conv.title}
                        </h3>
                        <p className="text-base text-neutral-700 mb-4 line-clamp-2">
                          "{conv.snippet}"
                        </p>
                        <div className="flex items-center gap-6 text-sm text-neutral-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{conv.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{conv.replies} replies</span>
                          </div>
                          <button className="text-neutral-600 hover:text-neutral-900">
                            View thread
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Arcades & Communities Section */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
                Arcades & Communities
              </h2>

              {/* Tabs */}
              <div className="border-b border-neutral-200 mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("hosted")}
                    className={`pb-3 px-1 border-b-2 transition-colors ${
                      activeTab === "hosted"
                        ? "border-neutral-600 text-neutral-600"
                        : "border-transparent text-neutral-500"
                    }`}
                  >
                    Hosted Arcades
                  </button>
                  <button
                    onClick={() => setActiveTab("member")}
                    className={`pb-3 px-1 border-b-2 transition-colors ${
                      activeTab === "member"
                        ? "border-neutral-600 text-neutral-600"
                        : "border-transparent text-neutral-500"
                    }`}
                  >
                    Member of
                  </button>
                </div>
              </div>

              {/* Arcade Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeTab === "hosted" ? hostedArcades : memberArcades).map((arcade) => (
                  <div
                    key={arcade.id}
                    className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-neutral-900 mb-1">
                          {arcade.name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {arcade.category} · {arcade.memberCount} members
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {arcade.description}
                    </p>
                    <button className="text-sm text-neutral-600 hover:text-neutral-900">
                      View Arcade
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Highlights & Civic Impact */}
            <section className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Highlights & Civic Impact
              </h3>
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Top Contributor</p>
                      <p className="text-sm text-neutral-600">Boston Square</p>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Arcade Host</p>
                      <p className="text-sm text-neutral-600">Sustainability Lab</p>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Active Discussant</p>
                      <p className="text-sm text-neutral-600">50+ meaningful replies</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* People They Engage With */}
            <section className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                People They Engage With
              </h3>
              <div className="space-y-4">
                {people.map((person) => (
                  <div key={person.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                      <img
                        src={person.avatarUrl}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{person.name}</p>
                      <p className="text-sm text-neutral-500">{person.topics}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Share Profile */}
            <section className="bg-white border border-neutral-200 rounded-lg p-6">
              <button className="w-full bg-neutral-100 hover:bg-neutral-200 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors">
                <Share2 className="w-4 h-4 text-neutral-900" />
                <span className="text-base font-medium text-neutral-900">Share Profile</span>
              </button>
              <div className="border-t border-neutral-200 mt-4 pt-4">
                <p className="text-xs text-neutral-500 text-center">
                  centralsquare.ai/profile/{displayProfile.handle}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-900" />
              </div>
              <span className="text-lg font-semibold">Central Square</span>
            </div>
            <div className="flex gap-6 text-sm text-neutral-300">
              <Link href="/dashboard" className="hover:text-white">
                Arcades Dashboard
              </Link>
              <Link href="/profile/settings" className="hover:text-white">
                Privacy Settings
              </Link>
              <Link href="/" className="hover:text-white">
                Return Home
              </Link>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-6 pt-6">
            <p className="text-sm text-neutral-400 text-center">
              Building civic dialogue through community-driven conversations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

