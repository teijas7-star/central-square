"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Heart,
  ChevronRight,
} from "lucide-react";
import ArcadeDashboardLayout from "./ArcadeDashboardLayout";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export default function ArcadeDashboardFeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [arcadeId, setArcadeId] = useState<string>("");
  const [arcadeName, setArcadeName] = useState<string>("Central Square Arcade");
  const [city, setCity] = useState<string>("Boston, MA");
  const [loading, setLoading] = useState(true);

  const [posts] = useState<Post[]>([
    {
      id: "1",
      title: "Local Food Systems",
      content: "Just shared our latest findings on urban heat islands in Boston.",
      author: "Sarah Kim",
      likes: 23,
      comments: 6,
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      title: "Community Garden Proposal",
      content: "Excited to announce that our community land trust proposal passed!",
      author: "Alex Rodriguez",
      likes: 41,
      comments: 15,
      timestamp: "1 day ago",
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
            Feed
          </h2>
          <p className="text-neutral-600">Latest posts and discussions</p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-neutral-50">
            <p className="text-neutral-600">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{post.title}</h3>
                    <p className="text-neutral-700">{post.content}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ArcadeDashboardLayout>
  );
}

