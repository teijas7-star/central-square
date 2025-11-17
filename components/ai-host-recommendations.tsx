"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  MapPin,
  ArrowRight,
  ExternalLink,
  Bot,
  Star,
  Flame,
} from "lucide-react";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface Recommendation {
  id: string;
  arcade: {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    memberCount: number;
    postCount: number;
  };
  reason: string;
  confidence: number;
}

export default function AIHostRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const res = await fetch("/api/ai-host/recommendations");
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
        setMessage(data.message || "");
      }
    } catch (error) {
      console.error("Failed to load recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = async (recommendationId: string, arcadeId: string) => {
    await fetch("/api/ai-host/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId, action: "click" }),
    });
    router.push(`/arcades/${arcadeId}`);
  };

  const handleJoin = async (recommendationId: string, arcadeId: string) => {
    const res = await fetch(`/api/arcades/${arcadeId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "" }),
    });

    if (res.ok) {
      await fetch("/api/ai-host/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, action: "join" }),
      });
      router.push(`/arcades/${arcadeId}`);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return { icon: Flame, text: "Perfect Match", color: "text-orange-600 bg-orange-50" };
    } else if (confidence >= 0.6) {
      return { icon: Star, text: "Great Match", color: "text-yellow-600 bg-yellow-50" };
    } else {
      return { icon: TrendingUp, text: "Good Match", color: "text-blue-600 bg-blue-50" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-neutral-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <SequentialBloomLogo size={40} />
                </div>
                Your AI Host Recommendations
              </h1>
            </div>
            <p className="text-xl text-neutral-600">
              {message || "Discover communities tailored to your interests and values"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {recommendations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Start Your Journey
            </h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              {message || "Have a conversation with your AI Host to discover personalized Arcade recommendations tailored to your interests."}
            </p>
            <Link
              href="/ai-host"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              <Bot className="w-5 h-5" />
              Start Conversation with AI Host
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-neutral-300 mb-1">Personalized for You</p>
                  <p className="text-2xl font-semibold">
                    {recommendations.length} {recommendations.length === 1 ? "Community" : "Communities"} Found
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{recommendations.reduce((sum, r) => sum + r.arcade.memberCount, 0)}</p>
                    <p className="text-xs text-neutral-300">Total Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{recommendations.reduce((sum, r) => sum + r.arcade.postCount, 0)}</p>
                    <p className="text-xs text-neutral-300">Active Discussions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendations.map((rec, index) => {
                const badge = getConfidenceBadge(rec.confidence);
                const BadgeIcon = badge.icon;
                
                return (
                  <div
                    key={rec.id}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-1">
                            {rec.arcade.name}
                          </h3>
                          {rec.arcade.description && (
                            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                              {rec.arcade.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Confidence Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium mb-4 ${badge.color}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{badge.text}</span>
                      </div>

                      {/* Reason */}
                      <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-neutral-700 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                          <span>{rec.reason}</span>
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.arcade.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {rec.arcade.tags.length > 4 && (
                          <span className="text-xs text-neutral-500 px-2 py-1">
                            +{rec.arcade.tags.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-neutral-600 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{rec.arcade.memberCount} {rec.arcade.memberCount === 1 ? "member" : "members"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>{rec.arcade.postCount} {rec.arcade.postCount === 1 ? "post" : "posts"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex items-center gap-3">
                      <button
                        onClick={() => handleRecommendationClick(rec.id, rec.arcade.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors text-sm"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleJoin(rec.id, rec.arcade.id)}
                        className="px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                Want More Recommendations?
              </h2>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Continue your conversation with your AI Host to discover even more communities that match your evolving interests.
              </p>
              <Link
                href="/ai-host"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                <Bot className="w-5 h-5" />
                Continue Conversation
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


