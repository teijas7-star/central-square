"use client";

import { useState } from "react";

export default function Compose({
  arcadeId,
  parentId,
  onPost,
  placeholder = "Share something with the community…",
}: {
  arcadeId?: string;
  parentId?: string;
  onPost?: () => void;
  placeholder?: string;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const submit = async () => {
    if (!body.trim()) return;
    if (body.length > 800) {
      setError("Post must be less than 800 characters");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, arcadeId, parentId }),
      });

      if (res.ok) {
        setBody("");
        setShowCompose(false);
        if (onPost) onPost();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post");
      }
    } catch (err) {
      setError("Failed to post");
    } finally {
      setBusy(false);
    }
  };

  // Simple placeholder version (matches Figma design)
  if (!showCompose && !parentId) {
    return (
      <>
        <div
          onClick={() => setShowCompose(true)}
          className="border border-neutral-300 rounded-lg p-3 min-h-[80px] text-neutral-500 cursor-text mb-3 flex items-center"
        >
          {placeholder}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
              title="Add image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
              title="Add file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
              title="Create poll"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
              title="Add event"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            Post
          </button>
        </div>
      </>
    );
  }

  // Full compose when clicked or for replies
  return (
    <div className="space-y-3">
      <textarea
        className="w-full min-h-[80px] border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none text-neutral-900 placeholder-neutral-500"
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={800}
        disabled={busy}
        autoFocus
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">{error}</div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            type="button"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
            title="Add image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
            title="Add file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
            title="Create poll"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:bg-neutral-100 rounded transition-colors"
            title="Add event"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {body.length > 0 && (
            <span className="text-xs text-neutral-500">{body.length}/800</span>
          )}
          <button
            onClick={() => {
              if (body.trim()) {
                submit();
              } else {
                setShowCompose(false);
              }
            }}
            disabled={busy || (!body.trim() && !showCompose)}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Posting…" : parentId ? "Reply" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
