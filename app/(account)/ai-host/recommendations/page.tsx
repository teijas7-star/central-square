"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArcadeCard from "@/components/arcade-card";

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
    // Track click
    await fetch("/api/ai-host/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendationId, action: "click" }),
    });

    // Navigate to arcade
    router.push(`/arcades/${arcadeId}`);
  };

  const handleJoin = async (recommendationId: string, arcadeId: string) => {
    const res = await fetch(`/api/arcades/${arcadeId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "" }),
    });

    if (res.ok) {
      // Track join
      await fetch("/api/ai-host/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, action: "join" }),
      });

      router.push(`/arcades/${arcadeId}`);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Your AI Host Recommendations</h1>
          <p className="text-gray-600">
            Based on our conversation, here are Arcades that might interest you.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading recommendations...</p>
          </div>
        ) : message ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <p className="text-gray-600 mb-4">{message}</p>
            <Link
              href="/ai-host"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Start a conversation with your AI Host →
            </Link>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500">No recommendations yet.</p>
            <Link
              href="/ai-host"
              className="text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block"
            >
              Start a conversation with your AI Host →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{rec.arcade.name}</h3>
                    {rec.arcade.description && (
                      <p className="text-sm text-gray-600 mb-2">{rec.arcade.description}</p>
                    )}
                    <p className="text-sm text-purple-600 mb-2">
                      💡 {rec.reason}
                    </p>
                    <div className="flex gap-2 mb-2">
                      {rec.arcade.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {rec.arcade.memberCount} members · {rec.arcade.postCount} posts
                      {rec.confidence > 0.5 && (
                        <span className="ml-2 text-green-600">High match</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRecommendationClick(rec.id, rec.arcade.id)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Arcade →
                  </button>
                  <button
                    onClick={() => handleJoin(rec.id, rec.arcade.id)}
                    className="text-sm bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Join Arcade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/ai-host"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Continue conversation with AI Host →
          </Link>
        </div>
      </main>
    </main>
  );
}

