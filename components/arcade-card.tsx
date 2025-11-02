"use client";

import Link from "next/link";

interface ArcadeCardProps {
  id: string;
  name: string;
  description?: string | null;
  tags: string[];
  memberCount: number;
  postCount?: number;
  visibility: "open" | "invite";
}

export default function ArcadeCard({
  id,
  name,
  description,
  tags,
  memberCount,
  postCount,
  visibility,
}: ArcadeCardProps) {
  return (
    <Link
      href={`/arcades/${id}`}
      className="block border rounded-xl p-5 hover:shadow-lg transition-all bg-white hover:border-purple-300"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            visibility === "open"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {visibility === "open" ? "Open" : "Invite Only"}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span className="font-medium">{memberCount} {memberCount === 1 ? "member" : "members"}</span>
        {postCount !== undefined && (
          <span className="font-medium">{postCount} {postCount === 1 ? "post" : "posts"}</span>
        )}
      </div>
    </Link>
  );
}

