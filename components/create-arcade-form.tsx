"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronDown,
  Globe,
  Lock,
  Bot,
  ArrowRight,
  Check,
  Bell,
  Building2,
} from "lucide-react";
import { ArcadeCreate } from "@/lib/validators";

interface SuccessModalProps {
  arcadeId: string;
  onViewArcade: () => void;
  onCreateAnother: () => void;
}

function SuccessModal({ arcadeId, onViewArcade, onCreateAnother }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-neutral-900" />
        </div>

        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Your Arcade is Ready!</h2>
        <p className="text-neutral-600 mb-6">
          Your AI Host will help set up the community space and guide initial discussions. You'll receive a notification once everything is configured.
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onViewArcade}
            className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            View My Arcade
          </button>
          <button
            onClick={onCreateAnother}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Create Another Arcade
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateArcadeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<"open" | "invite">("open");
  const [symbol, setSymbol] = useState("🏛️");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdArcadeId, setCreatedArcadeId] = useState("");

  // Get user profile for avatar
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.avatarUrl) {
          setUserAvatar(data.profile.avatarUrl);
        }
      })
      .catch(() => {});
  }, []);

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

    try {
      const res = await fetch("/api/arcades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (res.ok) {
        setCreatedArcadeId(data.arcade.id);
        setShowSuccessModal(true);
      } else {
        setError(data.error || "Failed to create arcade");
      }
    } catch (error) {
      setError("Failed to create arcade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewArcade = () => {
    setShowSuccessModal(false);
    router.push(`/arcades/${createdArcadeId}`);
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setName("");
    setDescription("");
    setTags("");
    setVisibility("open");
    setSymbol("🏛️");
    setCreatedArcadeId("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-6 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-neutral-900">Central Square</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <Link href="/discover" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                Discover
              </Link>
              <Link
                href="/arcades/create"
                className="text-neutral-900 border-b-2 border-neutral-900 pb-1 font-medium"
              >
                Create Arcade
              </Link>
            </nav>
          </div>

          <form className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 md:py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Search communities, topics, discussions..."
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
            )}
            <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="bg-neutral-50 min-h-[600px]">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Create Your Arcade</h1>
              <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto">
                Start a new community space where members can engage in meaningful discussions around shared interests and civic topics.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Choose Symbol
                  </label>
                  <button
                    type="button"
                    className="w-full p-4 border border-neutral-200 rounded-lg flex items-center justify-between hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-lg">
                        {symbol}
                      </div>
                      <span className="text-neutral-700 text-sm">Select emoji or upload banner</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                <div>
                  <label htmlFor="arcade-name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Arcade Name *
                  </label>
                  <input
                    type="text"
                    id="arcade-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    placeholder="e.g., Downtown Development Discussion"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arcade-description" className="block text-sm font-medium text-neutral-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="arcade-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none transition-all"
                  placeholder="Describe what your Arcade is about and what kind of discussions you want to foster..."
                  maxLength={240}
                  required
                  disabled={loading}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-neutral-500">Maximum 240 characters</span>
                  <span className="text-xs text-neutral-400">{description.length}/240</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Visibility *</label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="open"
                      checked={visibility === "open"}
                      onChange={() => setVisibility("open")}
                      className="mt-1 w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900"
                      disabled={loading}
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="w-4 h-4 text-neutral-600" />
                        <span className="text-neutral-900 font-medium">Public</span>
                      </div>
                      <p className="text-sm text-neutral-600">Anyone can discover and join this Arcade</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="invite"
                      checked={visibility === "invite"}
                      onChange={() => setVisibility("invite")}
                      className="mt-1 w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900"
                      disabled={loading}
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Lock className="w-4 h-4 text-neutral-600" />
                        <span className="text-neutral-900 font-medium">Invite-only</span>
                      </div>
                      <p className="text-sm text-neutral-600">Members can only join through invitations</p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Tags field (hidden but functional for API) */}
              <div className="hidden">
                <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="e.g., development, urban-planning, civic"
                  disabled={loading}
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-neutral-900 font-semibold mb-2">AI Host Moderation</h3>
                      <p className="text-sm text-neutral-600">
                        Your Arcade will be moderated by an AI Host that helps facilitate constructive discussions, ensures community guidelines are followed, and provides helpful context when needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-neutral-900 text-white px-8 py-3 rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <span>{loading ? "Creating..." : "Create Arcade"}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-neutral-900" />
                </div>
                <span className="text-xl font-semibold">Central Square</span>
              </div>
              <p className="text-neutral-300 text-sm">
                An open space for constructive civic dialogue and community collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <Link href="/discover" className="hover:text-white transition-colors">
                    Browse Arcades
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Moderation Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Safety Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-neutral-400 mb-4 md:mb-0 text-center md:text-left">
                Central Square is an open space for constructive dialogue. All discussions are moderated by AI Hosts to ensure respectful and productive conversations.
              </p>
              <div className="flex items-center space-x-6 text-sm text-neutral-400">
                <span>© 2025 Central Square</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          arcadeId={createdArcadeId}
          onViewArcade={handleViewArcade}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </div>
  );
}

