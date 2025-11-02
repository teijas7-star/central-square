"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArcadeCreate } from "@/lib/validators";

export default function ArcadeForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<"open" | "invite">("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedTags = tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = ArcadeCreate.safeParse({
      name,
      description: description || undefined,
      tags: parsedTags,
      visibility,
    });

    if (!result.success) {
      setError(result.error.issues.map((i) => i.message).join(", "));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/arcades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/arcades/${data.arcade.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create arcade");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Arcade Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., AI & Society"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          rows={3}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="What is this arcade about?"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (comma-separated, max 10)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., ai, ethics, society"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="visibility" className="block text-sm font-medium mb-1">
          Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as "open" | "invite")}
          className="w-full border rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="open">Open - Anyone can join</option>
          <option value="invite">Invite-only - Requires invite link</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Arcade"}
      </button>
    </form>
  );
}

