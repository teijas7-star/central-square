"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Compose from "@/components/compose";
import Nav from "@/components/layout/nav";
import PostCard from "@/components/post-card";
import Link from "next/link";

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
  arcade?: {
    id: string;
    name: string;
  } | null;
}

export default function SquarePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/profiles")
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
    
    loadPosts();
  }, [tag]);

  const loadPosts = async () => {
    setLoading(true);
    const url = tag ? `/api/feed/square?tag=${encodeURIComponent(tag)}` : `/api/feed/square`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    setPosts(json.posts ?? []);
    setLoading(false);
  };

  const handlePost = () => {
    router.refresh();
    loadPosts();
  };

  return (
    <>
      {isAuthenticated ? <Nav /> : (
        <div className="min-h-screen bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link href="/" className="text-xl font-semibold text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}
      <main className={`max-w-3xl mx-auto p-6 ${!isAuthenticated ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50' : ''}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Central Square</h1>
          <p className="text-gray-600">
            Discover communities and join the conversation in the public square.
          </p>
          {!isAuthenticated && (
            <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block">
              Sign in to join →
            </Link>
          )}
        </div>

        {/* Compose for Square posts - only show if authenticated */}
        {isAuthenticated && <Compose onPost={handlePost} />}

        {/* Tag Filter */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter by tag (e.g., ai, education, climate)"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {tag && (
            <button
              onClick={() => setTag("")}
              className="text-sm text-purple-600 hover:text-purple-700 mt-2"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse bg-white">
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
              {tag
                ? "Try a different tag or browse all posts"
                : "Be the first to post in the Square!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showArcade={true} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
