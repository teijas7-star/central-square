"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileUpdate } from "@/lib/validators";

interface ProfileFormProps {
  userId: string;
  initialData?: {
    name: string;
    handle: string;
    avatarUrl?: string | null;
    bio?: string | null;
    interests: string[];
  };
}

export default function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [handle, setHandle] = useState(initialData?.handle || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [interests, setInterests] = useState(initialData?.interests.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedInterests = interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = ProfileUpdate.safeParse({
      name,
      handle,
      avatarUrl: avatarUrl || null,
      bio: bio || null,
      interests: parsedInterests,
    });

    if (!result.success) {
      setError(result.error.issues.map((i) => i.message).join(", "));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="handle" className="block text-sm font-medium mb-1">
          Handle
        </label>
        <input
          id="handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">
          Avatar URL (optional)
        </label>
        <input
          id="avatarUrl"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com/avatar.jpg"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Bio (max 240 chars)
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={240}
          rows={3}
          className="w-full border rounded-lg px-3 py-2"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium mb-1">
          Interests (comma-separated, max 10)
        </label>
        <input
          id="interests"
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., tech, ai, civics"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

