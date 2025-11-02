"use client";

import { useState } from "react";

interface PostActionsProps {
  postId: string;
  arcadeId: string | null;
  isLantern: boolean;
  isHost: boolean;
  onToggleLantern?: () => void;
  onSoftDelete?: () => void;
}

export default function PostActions({
  postId,
  arcadeId,
  isLantern,
  isHost,
  onToggleLantern,
  onSoftDelete,
}: PostActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleLantern = async () => {
    if (!arcadeId || !isHost) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/lantern`, {
        method: "POST",
      });
      if (res.ok && onToggleLantern) {
        onToggleLantern();
      }
    } catch (error) {
      console.error("Failed to toggle lantern", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!isHost) return;
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/moderation/posts/${postId}/soft-delete`, {
        method: "POST",
      });
      if (res.ok && onSoftDelete) {
        onSoftDelete();
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isHost) return null;

  return (
    <div className="flex gap-2 mt-2 text-xs">
      {arcadeId && (
        <button
          onClick={handleToggleLantern}
          disabled={loading}
          className={`px-2 py-1 rounded ${
            isLantern
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } disabled:opacity-50`}
          title={isLantern ? "Remove from Square" : "Promote to Square"}
        >
          {isLantern ? "⭐ Lantern" : "Promote to Square"}
        </button>
      )}
      <button
        onClick={handleSoftDelete}
        disabled={loading}
        className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
        title="Delete post"
      >
        Delete
      </button>
    </div>
  );
}

