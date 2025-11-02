"use client";

import { useState } from "react";
import Link from "next/link";
import ReplyButton from "@/components/reply-button";

interface Post {
  id: string;
  body: string;
  createdAt: string;
  isLantern?: boolean;
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

interface PostCardProps {
  post: Post;
  showArcade?: boolean;
  onReply?: () => void;
}

export default function PostCard({ post, showArcade = false, onReply }: PostCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <article className="border rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              post.author.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{post.author.name}</span>
              <span className="text-sm text-gray-500">@{post.author.handle}</span>
              {post.isLantern && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  ⭐ Lantern
                </span>
              )}
              {showArcade && post.arcade && (
                <Link
                  href={`/arcades/${post.arcade.id}`}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  from {post.arcade.name}
                </Link>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mb-3">
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{post.body}</p>
      </div>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
          {post.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {reply.author.avatarUrl ? (
                  <img
                    src={reply.author.avatarUrl}
                    alt={reply.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  reply.author.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{reply.author.name}</span>
                  <span className="text-xs text-gray-500">@{reply.author.handle}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <ReplyButton postId={post.id} arcadeId={post.arcade?.id} onReply={onReply} />
      </div>
    </article>
  );
}

