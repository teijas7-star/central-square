"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Landmark,
  Code,
  GraduationCap,
  Building,
  Leaf,
  Heart,
  Store,
  Palette,
  Bus,
  Flame,
  Star,
  Clock,
  UserCircle,
  Sprout,
  Calendar,
  Handshake,
  Music,
  Bike,
  Bot,
} from "lucide-react";

interface Arcade {
  id: string;
  name: string;
  description?: string | null;
  tags: string[];
  visibility: string;
  _count?: {
    memberships: number;
    posts: number;
  };
}

// Icon mapping for arcades based on name/tags
function getArcadeIcon(name: string, tags: string[]) {
  const lowerName = name.toLowerCase();
  const lowerTags = tags.join(" ").toLowerCase();

  if (lowerName.includes("civic") || lowerTags.includes("civic")) {
    return <Landmark className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("tech") || lowerTags.includes("tech") || lowerTags.includes("code")) {
    return <Code className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("education") || lowerTags.includes("education")) {
    return <GraduationCap className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("urban") || lowerName.includes("commons") || lowerTags.includes("urban")) {
    return <Building className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("climate") || lowerTags.includes("climate") || lowerTags.includes("environment")) {
    return <Leaf className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("health") || lowerName.includes("wellness") || lowerTags.includes("health")) {
    return <Heart className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("business") || lowerTags.includes("business")) {
    return <Store className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("arts") || lowerName.includes("culture") || lowerTags.includes("arts")) {
    return <Palette className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("transportation") || lowerTags.includes("transport")) {
    return <Bus className="w-6 h-6 text-white" />;
  }
  return <Users className="w-6 h-6 text-white" />;
}

// Activity indicator based on arcade data
function getActivityIndicator(arcade: Arcade) {
  const recentPosts = arcade._count?.posts || 0;
  if (recentPosts > 100) {
    return { icon: <Flame className="w-3 h-3 text-neutral-400" />, text: "Trending: Active Discussion" };
  }
  if (recentPosts > 50) {
    return { icon: <Star className="w-3 h-3 text-neutral-400" />, text: "Featured: Community Highlight" };
  }
  if (recentPosts > 10) {
    return { icon: <Clock className="w-3 h-3 text-neutral-400" />, text: "Recent: New Activity" };
  }
  return { icon: <UserCircle className="w-3 h-3 text-neutral-400" />, text: "Active: Member Engagement" };
}

interface DiscoverArcadeCardProps {
  arcade: Arcade;
  onJoin?: (arcadeId: string) => void;
  isMember?: boolean;
}

function DiscoverArcadeCard({ arcade, onJoin, isMember }: DiscoverArcadeCardProps) {
  const router = useRouter();
  const activity = getActivityIndicator(arcade);
  const icon = getArcadeIcon(arcade.name, arcade.tags);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMember) {
      router.push(`/arcades/${arcade.id}`);
      return;
    }

    try {
      const res = await fetch(`/api/arcades/${arcade.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "" }),
      });

      if (res.ok) {
        if (onJoin) onJoin(arcade.id);
        router.push(`/arcades/${arcade.id}`);
      }
    } catch (error) {
      console.error("Failed to join arcade", error);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-100 flex items-center justify-center">
        <span className="text-neutral-600 text-sm">{arcade.name} Banner</span>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-neutral-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">{arcade.name}</h3>
              <p className="text-sm text-neutral-500">
                {arcade._count?.memberships || 0} {arcade._count?.memberships === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
        </div>
        <p className="text-neutral-600 mb-4 text-sm leading-relaxed line-clamp-2">
          {arcade.description || "A community space for meaningful discussions and collaboration."}
        </p>
        <div className="flex items-center text-xs text-neutral-500 mb-4">
          {activity.icon}
          <span className="ml-1">{activity.text}</span>
        </div>
        <button
          onClick={handleJoin}
          className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
        >
          {isMember ? "View Arcade" : "Join Arcade"}
        </button>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const [arcades, setArcades] = useState<Arcade[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"trending" | "newest" | "interest">("trending");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadArcades();
  }, [filter]);

  const loadArcades = async (append = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    
    // Note: API doesn't support trending/newest filters yet, so we'll just fetch all
    const url = `/api/discovery?${params.toString()}`;
    const res = await fetch(url);
    const json = await res.json();
    
    let sortedArcades = json.arcades ?? [];
    
    // Client-side sorting
    if (filter === "newest") {
      // Would need createdAt from API - for now just use as-is
      sortedArcades = sortedArcades;
    } else if (filter === "trending") {
      // Sort by member count + post count
      sortedArcades = sortedArcades.sort((a: Arcade, b: Arcade) => {
        const aScore = (a._count?.memberships || 0) + (a._count?.posts || 0);
        const bScore = (b._count?.memberships || 0) + (b._count?.posts || 0);
        return bScore - aScore;
      });
    }
    
    if (append) {
      setArcades([...arcades, ...sortedArcades]);
    } else {
      setArcades(sortedArcades.slice(0, 9)); // Show first 9
      setHasMore(sortedArcades.length > 9);
    }
    
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadArcades();
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    loadArcades(true);
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
              <Link
                href="/discover"
                className="text-neutral-900 border-b-2 border-neutral-900 pb-1 font-medium"
              >
                Discover
              </Link>
            </nav>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 md:py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Find your Arcade..."
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="px-4 md:px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm md:text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Discover Header */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Discover Arcades</h1>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl">
                Explore community spaces where meaningful conversations happen. Each Arcade is a moderated environment focused on specific topics and local initiatives.
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-neutral-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setFilter("trending")}
                className={`px-4 md:px-6 py-2 rounded-md transition-colors text-sm ${
                  filter === "trending"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setFilter("newest")}
                className={`px-4 md:px-6 py-2 rounded-md transition-colors text-sm ${
                  filter === "newest"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setFilter("interest")}
                className={`px-4 md:px-6 py-2 rounded-md transition-colors text-sm ${
                  filter === "interest"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                By Interest
              </button>
            </div>
          </div>
        </section>

        {/* Arcade Grid */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            {loading && arcades.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-neutral-100"></div>
                    <div className="p-6">
                      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : arcades.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-neutral-50">
                <p className="text-neutral-600 mb-2 text-lg font-medium">No arcades found</p>
                <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
                <Link
                  href="/arcades/create"
                  className="inline-block text-neutral-900 hover:underline font-medium"
                >
                  Create your own Arcade →
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {arcades.map((arcade) => (
                    <DiscoverArcadeCard key={arcade.id} arcade={arcade} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Load More Arcades
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Create Arcade CTA */}
        <section className="py-16 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 mb-8">
              Create a new Arcade for your community interest or local initiative. Our AI Hosts will help moderate meaningful discussions.
            </p>
            <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
              <Link
                href="/arcades/create"
                className="bg-neutral-900 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Create New Arcade
              </Link>
              <Link
                href="/ai-host"
                className="border border-neutral-300 text-neutral-700 px-6 md:px-8 py-3 rounded-lg hover:bg-white transition-colors font-medium"
              >
                Learn About Moderation
              </Link>
            </div>
          </div>
        </section>
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

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/ai-host"
          className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors"
          title="Chat with AI Host"
        >
          <Bot className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
