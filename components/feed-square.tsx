"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";

interface Post {
  id: string;
  body: string;
  createdAt: string;
  isLantern: boolean;
  author: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  replies: Post[];
  arcade?: { id: string; name: string } | null;
}

export default function SquareFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const url = tag ? `/api/feed/square?tag=${encodeURIComponent(tag)}` : `/api/feed/square`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    setPosts(json.posts ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [tag]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by tag (e.g., education, ai)"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-600 mb-2">
            {tag ? `No posts found with tag "${tag}"` : "No posts yet"}
          </p>
          <p className="text-sm text-gray-500">
            {tag ? "Try a different tag or browse all posts" : "Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showArcade={true} />
          ))}
        </div>
      )}
    </div>
  );
}

