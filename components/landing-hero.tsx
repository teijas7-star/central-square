"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const popularCommunities = [
  { name: "Sports", icon: "⚽", color: "border-blue-500" },
  { name: "Civic", icon: "🏛️", color: "border-green-500" },
  { name: "Music", icon: "🎵", color: "border-purple-500" },
  { name: "Arts", icon: "🎨", color: "border-red-500" },
  { name: "Culture", icon: "🌻", color: "border-orange-500" },
  { name: "Tech", icon: "⚙️", color: "border-cyan-500" },
];

export default function LandingHero() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // For magic link, we'll use email only
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("Check your email for the magic link!");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to send magic link");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Step Into the Square
        </h1>
        <p className="text-lg text-gray-600">
          Join communities, connect naturally.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab("login")}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === "login"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === "signup"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      {activeTab === "login" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your email address."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="#forgot" className="text-sm text-purple-600 hover:text-purple-700">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your password."
            />
            <p className="text-xs text-gray-500 mt-1">
              We use magic link authentication. Password field is optional.
            </p>
          </div>

          {message && (
            <p className={`text-sm ${message.includes("Check") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Login"}
          </button>
        </form>
      )}

      {/* Sign Up Form */}
      {activeTab === "signup" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your email address."
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes("Check") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Sign Up"}
          </button>
        </form>
      )}

      {/* Social Login */}
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-4">
          <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            <span className="text-xl font-bold text-gray-600">G</span>
          </button>
          <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            <span className="text-xl font-bold text-gray-600">f</span>
          </button>
          <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            <span className="text-xl">🍎</span>
          </button>
        </div>
      </div>

      {/* Popular Communities */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Popular communities to explore
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularCommunities.map((community) => (
            <Link
              key={community.name}
              href={`/discover?tag=${encodeURIComponent(community.name.toLowerCase())}`}
              className={`border-2 ${community.color} rounded-lg p-3 hover:shadow-md transition-shadow bg-white`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{community.icon}</span>
                <span className="font-medium text-gray-800 text-sm">{community.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/square"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Or browse the Square feed →
          </Link>
        </div>
      </div>
    </div>
  );
}

