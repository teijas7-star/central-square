"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Users, Search, Landmark, GraduationCap, Leaf, Clock, Heart, MessageCircle, Share2, Bot } from "lucide-react";

// Featured Arcade Card Component
interface FeaturedArcadeProps {
  icon: React.ReactNode;
  name: string;
  members: number;
  description: string;
  recentActivity: string;
  arcadeId?: string;
}

function FeaturedArcadeCard({ icon, name, members, description, recentActivity, arcadeId }: FeaturedArcadeProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-neutral-900 font-semibold">{name}</h3>
            <p className="text-sm text-neutral-600">{members.toLocaleString()} members</p>
          </div>
        </div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
      </div>

      <div className="mb-4">
        <div className="w-full h-32 bg-neutral-200 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-neutral-500 text-sm">Community Banner</span>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{description}</p>
        <div className="flex items-center text-sm text-neutral-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Recent: {recentActivity}</span>
        </div>
      </div>

      <Link
        href={arcadeId ? `/arcades/${arcadeId}` : "/discover"}
        className="block w-full bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 text-center transition-colors"
      >
        View Arcade
      </Link>
    </div>
  );
}

// Discussion Post Component
interface DiscussionPostProps {
  author: {
    name: string;
    avatar: string;
  };
  arcade: string;
  timeAgo: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
}

function DiscussionPost({ author, arcade, timeAgo, title, content, likes, replies }: DiscussionPostProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <img
          src={author.avatar}
          alt={`${author.name} avatar`}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2 flex-wrap">
            <span className="text-neutral-900 font-medium">{author.name}</span>
            <span className="text-neutral-500 text-sm">in {arcade}</span>
            <span className="text-neutral-400 text-sm">{timeAgo}</span>
          </div>
          <h3 className="text-neutral-900 font-semibold mb-2">{title}</h3>
          <p className="text-neutral-600 mb-3">{content}</p>
          <div className="flex items-center space-x-6 text-sm text-neutral-500">
            <button className="flex items-center space-x-1 hover:text-neutral-700 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-neutral-700 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{replies} replies</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-neutral-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Arcade {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  _count: {
    memberships: number;
    posts: number;
  };
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  arcade?: {
    id: string;
    name: string;
  } | null;
  author: {
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  replies?: Post[];
}

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredArcades, setFeaturedArcades] = useState<Arcade[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured arcades and recent posts
    Promise.all([
      fetch("/api/discovery").then((res) => res.json()).catch(() => ({ arcades: [] })),
      fetch("/api/feed/square").then((res) => res.json()).catch(() => ({ posts: [] })),
    ]).then(([arcadesData, postsData]) => {
      setFeaturedArcades(arcadesData.arcades?.slice(0, 3) || []);
      setRecentPosts(postsData.posts?.slice(0, 3) || []);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/discover");
    }
  };

  // Icon mapping for arcades based on tags/name
  const getArcadeIcon = (name: string, tags: string[]) => {
    const lowerName = name.toLowerCase();
    const lowerTags = tags.join(" ").toLowerCase();
    
    if (lowerName.includes("civic") || lowerTags.includes("civic") || lowerTags.includes("engagement")) {
      return <Landmark className="w-6 h-6 text-white" />;
    }
    if (lowerName.includes("education") || lowerTags.includes("education")) {
      return <GraduationCap className="w-6 h-6 text-white" />;
    }
    if (lowerName.includes("environment") || lowerTags.includes("environment") || lowerTags.includes("climate")) {
      return <Leaf className="w-6 h-6 text-white" />;
    }
    return <Users className="w-6 h-6 text-white" />;
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Fallback featured arcades (used if API returns empty)
  const fallbackArcades = [
    {
      icon: <Landmark className="w-6 h-6 text-white" />,
      name: "Civic Engagement",
      members: 1247,
      description: "Discuss local policies, participate in town halls, and engage with elected officials in a moderated environment.",
      recentActivity: "Budget Planning Discussion",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      name: "Education Hub",
      members: 892,
      description: "Share educational resources, discuss curriculum changes, and connect parents with local school initiatives.",
      recentActivity: "School Board Meeting Recap",
    },
    {
      icon: <Leaf className="w-6 h-6 text-white" />,
      name: "Environment",
      members: 634,
      description: "Collaborate on sustainability initiatives, share eco-friendly tips, and organize community clean-up events.",
      recentActivity: "Park Restoration Project",
    },
  ];

  const displayArcades = featuredArcades.length > 0 
    ? featuredArcades.map((arcade) => ({
        icon: getArcadeIcon(arcade.name, arcade.tags),
        name: arcade.name,
        members: arcade._count.memberships,
        description: arcade.description || "Join the conversation in this community Arcade.",
        recentActivity: `${arcade._count.posts} active discussions`,
        arcadeId: arcade.id,
      }))
    : fallbackArcades.map(arcade => ({ ...arcade, arcadeId: undefined }));

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
              <Link
                href="/"
                className="text-neutral-900 border-b-2 border-neutral-900 pb-1 font-medium"
              >
                Home
              </Link>
              <Link href="/discover" className="text-neutral-600 hover:text-neutral-900 transition-colors">
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
                placeholder="Search communities, topics, discussions..."
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
        {/* Hero Section */}
        <section className="bg-neutral-50 py-12 md:py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              A community of communities for civic collaboration
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join thoughtful conversations, participate in local initiatives, and connect with neighbors in moderated spaces designed for constructive dialogue.
            </p>
            <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
              <Link
                href="/discover"
                className="bg-neutral-900 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Explore Arcades
              </Link>
              <Link
                href="/square"
                className="border border-neutral-300 text-neutral-700 px-6 md:px-8 py-3 rounded-lg hover:bg-white transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Arcades Section */}
        <section className="py-12 md:py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Featured Arcades</h2>
              <Link href="/discover" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
                    <div className="h-32 bg-neutral-200 rounded mb-3"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayArcades.map((arcade, index) => (
                  <FeaturedArcadeCard
                    key={arcade.arcadeId || index}
                    icon={arcade.icon}
                    name={arcade.name}
                    members={arcade.members}
                    description={arcade.description}
                    recentActivity={arcade.recentActivity}
                    arcadeId={arcade.arcadeId}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Discussions Section */}
        <section className="py-12 md:py-16 px-6 bg-neutral-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Recent Discussions</h2>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  All Topics
                </button>
                <button className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Following
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
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
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <span className="text-neutral-900 font-medium">{post.author.name}</span>
                          {post.arcade && (
                            <span className="text-neutral-500 text-sm">in {post.arcade.name}</span>
                          )}
                          <span className="text-neutral-400 text-sm">{formatTimeAgo(post.createdAt)}</span>
                        </div>
                        <p className="text-neutral-600 mb-3">{post.body}</p>
                        <div className="flex items-center space-x-6 text-sm text-neutral-500">
                          <button className="flex items-center space-x-1 hover:text-neutral-700 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>0</span>
                          </button>
                          <Link
                            href={post.arcade ? `/arcades/${post.arcade.id}` : `/square`}
                            className="flex items-center space-x-1 hover:text-neutral-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replies ? post.replies.length : 0} replies</span>
                          </Link>
                          <button className="flex items-center space-x-1 hover:text-neutral-700 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-neutral-200 rounded-xl">
                <p className="text-neutral-600 mb-2">No discussions yet</p>
                <Link href="/square" className="text-neutral-900 hover:underline font-medium">
                  Browse the Square →
                </Link>
              </div>
            )}

            <div className="text-center mt-8">
              <Link
                href="/square"
                className="inline-block px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-white transition-colors"
              >
                Load More Discussions
              </Link>
            </div>
          </div>
        </section>

        {/* Join CTA Section */}
        <section className="py-12 md:py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">Ready to join the conversation?</h2>
            <p className="text-lg md:text-xl text-neutral-600 mb-8">
              Create an account to participate in discussions, join Arcades, and connect with your community.
            </p>
            <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
              <Link
                href="/signin"
                className="bg-neutral-900 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
              >
                Sign Up Free
              </Link>
              <Link
                href="/square"
                className="border border-neutral-300 text-neutral-700 px-6 md:px-8 py-3 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
              >
                Browse as Guest
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
