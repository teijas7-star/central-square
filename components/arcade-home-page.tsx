"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  UserPlus,
  Bot,
  Circle,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  BarChart3,
  Plus,
  Gavel,
  Sprout,
  Bike,
  Handshake,
  MapPin,
  FileText,
  File,
  Link as LinkIcon,
  Map,
  ExternalLink,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import Compose from "@/components/compose";

interface Arcade {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  visibility: "open" | "invite";
  host: {
    id: string;
    name: string;
    handle: string;
  };
  _count: {
    memberships: number;
    posts: number;
  };
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  isLantern: boolean;
  author: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  replies: Post[];
}

interface Member {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio?: string | null;
  role: "host" | "member";
  joinedAt: string;
  membershipId: string;
  postCount?: number;
  commentCount?: number;
  lastActive?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  endTime?: string;
  location?: string;
  type?: "official" | "volunteer" | "discussion" | "social";
  attending?: number;
  icon?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "link" | "document" | "map";
  url?: string;
}

interface ArcadeHomePageProps {
  params: Promise<{ id: string }>;
}

export default function ArcadeHomePage({ params }: ArcadeHomePageProps) {
  const router = useRouter();
  const [arcade, setArcade] = useState<Arcade | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberStats, setMemberStats] = useState({
    total: 0,
    hosts: 0,
    newThisWeek: 0,
    inactive: 0,
  });
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "media" | "members">("posts");
  const [isMember, setIsMember] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [arcadeId, setArcadeId] = useState<string>("");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState<"all" | "online" | "hosts" | "new" | "active">("all");
  const [memberPage, setMemberPage] = useState(1);
  const [memberPagination, setMemberPagination] = useState({
    page: 1,
    total: 0,
    hasMore: false,
  });

  // Mock events data (until events are implemented)
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "City Council Meeting",
      description: "Discuss new zoning proposals and community development initiatives. Public comment period included.",
      date: "Jan 15, 2025",
      time: "7:00 PM",
      endTime: "9:00 PM",
      location: "City Hall",
      type: "official",
      attending: 23,
      icon: "gavel",
    },
    {
      id: "2",
      title: "Community Cleanup",
      description: "Join us for our monthly Central Square Park cleanup. Bring gloves and enthusiasm!",
      date: "Jan 20, 2025",
      time: "9:00 AM",
      endTime: "12:00 PM",
      location: "Central Park",
      type: "volunteer",
      attending: 15,
      icon: "sprout",
    },
    {
      id: "3",
      title: "Bike Lane Forum",
      description: "Community discussion and Q&A session about the proposed bike lane improvements.",
      date: "Jan 25, 2025",
      time: "6:30 PM",
      endTime: "8:00 PM",
      location: "Library Hall",
      type: "discussion",
      attending: 31,
      icon: "bike",
    },
    {
      id: "4",
      title: "Neighborhood Meet & Greet",
      description: "Casual gathering to meet your neighbors and discuss local initiatives over coffee.",
      date: "Feb 1, 2025",
      time: "10:00 AM",
      endTime: "12:00 PM",
      location: "Community Center",
      type: "social",
      attending: 8,
      icon: "handshake",
    },
  ]);

  const [pastEvents] = useState<Event[]>([
    {
      id: "5",
      title: "Community Garden Cleanup",
      description: "",
      date: "January 8, 2025",
      attending: 23,
      icon: "sprout",
    },
    {
      id: "6",
      title: "Town Hall Discussion",
      description: "",
      date: "January 5, 2025",
      attending: 45,
      icon: "comments",
    },
  ]);

  const [resources] = useState<Resource[]>([
    {
      id: "1",
      title: "City Development Plan 2025",
      description: "Official city planning document",
      type: "pdf",
    },
    {
      id: "2",
      title: "Local Government Portal",
      description: "Access city services and forms",
      type: "link",
      url: "#",
    },
    {
      id: "3",
      title: "Meeting Minutes Archive",
      description: "Past council meeting records",
      type: "document",
      url: "#",
    },
    {
      id: "4",
      title: "Neighborhood Map",
      description: "Interactive community map",
      type: "map",
      url: "#",
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const { id } = await params;
      setArcadeId(id);

      // Load arcade details
      const arcadeRes = await fetch(`/api/arcades/${id}`);
      if (arcadeRes.ok) {
        const arcadeData = await arcadeRes.json();
        setArcade(arcadeData.arcade);
        setIsMember(arcadeData.isMember || false);
        setIsHost(arcadeData.isHost || false);
      }

      // Load posts
      const postsRes = await fetch(`/api/posts?arcadeId=${id}&page=1&limit=20`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }

      // Load user profile for avatar
      const profileRes = await fetch("/api/profiles");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.profile?.avatarUrl) {
          setUserAvatar(profileData.profile.avatarUrl);
        }
      }

      // Load members
      loadMembers(id, memberPage, memberSearch, memberFilter);

      setLoading(false);
    }
    loadData();
  }, [params]);

  const handlePost = () => {
    fetch(`/api/posts?arcadeId=${arcadeId}&page=1&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
      });
  };

  const loadMembers = async (
    arcadeId: string,
    page: number,
    search: string,
    filter: string
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "6");
    if (search) params.set("search", search);
    if (filter !== "all") params.set("filter", filter);

    const res = await fetch(`/api/arcades/${arcadeId}/members?${params}`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members || []);
      setMemberStats(data.stats || { total: 0, hosts: 0, newThisWeek: 0 });
      setMemberPagination(data.pagination || { page: 1, total: 0, hasMore: false });
    }
  };

  useEffect(() => {
    if (activeTab === "members" && arcadeId) {
      loadMembers(arcadeId, memberPage, memberSearch, memberFilter);
    }
  }, [activeTab, memberPage, memberSearch, memberFilter, arcadeId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center py-12">
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!arcade) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center py-12">
          <p className="text-neutral-500">Arcade not found</p>
        </div>
      </div>
    );
  }

  const userAvatarUrl = userAvatar || "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456";
  const aiHostAvatarUrl = "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">{arcade.name}</h1>
              <p className="text-sm text-neutral-600">Civic Arcade</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {(isHost || isMember) && (
            <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-neutral-800 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </button>
          )}
          <div className="flex items-center">
            <img
              src={aiHostAvatarUrl}
              alt="AI Host"
              className="w-10 h-10 rounded-full border-2 border-neutral-400"
            />
            <div className="ml-2">
              <div className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs flex items-center">
                <Circle className="w-2 h-2 mr-1 text-neutral-500 fill-current" />
                AI Host Active
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-3">
        <p className="text-neutral-700 text-sm">
          {arcade.description || "A space for civic engagement and community building"} — guided by AI Host Maya.
        </p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Tabs Navigation */}
          <div className="border-b border-neutral-200 px-6">
            <div className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-1 py-4 border-b-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === "posts"
                    ? "border-neutral-900 text-neutral-900 font-medium"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-1 py-4 border-b-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === "events"
                    ? "border-neutral-900 text-neutral-900 font-medium"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`px-1 py-4 border-b-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === "media"
                    ? "border-neutral-900 text-neutral-900 font-medium"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-1 py-4 border-b-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === "members"
                    ? "border-neutral-900 text-neutral-900 font-medium"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Members
              </button>
            </div>
          </div>

          {/* Feed Content */}
          <div className="px-6 py-6">
            {activeTab === "posts" && (
              <>
                {/* Create Post */}
                {isMember && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <img
                        src={userAvatarUrl}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <Compose
                          arcadeId={arcade.id}
                          onPost={handlePost}
                          placeholder="Share something with the community…"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Host Suggestion */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <img
                      src={aiHostAvatarUrl}
                      alt="AI Host Maya"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-neutral-900 font-medium">Maya</span>
                        <span className="ml-2 bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">
                          AI Host
                        </span>
                      </div>
                      <p className="text-neutral-900 text-sm">
                        💡 Great discussion happening about local transportation! I noticed several members are interested in bike lane improvements. Would anyone like to organize a community meeting?
                      </p>
                      <div className="flex space-x-3 mt-3">
                        <button className="text-neutral-700 text-sm hover:underline">Organize Meeting</button>
                        <button className="text-neutral-600 text-sm hover:underline">Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-neutral-50">
                      <p className="text-neutral-600 mb-2">No posts yet.</p>
                      <p className="text-sm text-neutral-500">
                        {isMember ? "Be the first to post!" : "Join this Arcade to start posting!"}
                      </p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={post.author.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${post.author.id}`}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-neutral-900 font-medium">{post.author.name}</span>
                              <span className="text-neutral-500 text-sm">•</span>
                              <span className="text-neutral-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
                            </div>
                            <p className="text-neutral-900 mb-3 whitespace-pre-wrap">{post.body}</p>
                            <div className="flex items-center space-x-6 text-neutral-500">
                              <button className="flex items-center space-x-2 hover:text-neutral-700 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">0</span>
                              </button>
                              <Link
                                href={`/arcades/${arcade.id}?post=${post.id}`}
                                className="flex items-center space-x-2 hover:text-neutral-700 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{post.replies?.length || 0}</span>
                              </Link>
                              <button className="flex items-center space-x-2 hover:text-neutral-700 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm">Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "events" && (
              <>
                {/* AI Host Event Suggestion */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <img
                      src={aiHostAvatarUrl}
                      alt="AI Host Maya"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-neutral-900 font-medium">Maya</span>
                        <span className="ml-2 bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">
                          AI Host
                        </span>
                      </div>
                      <p className="text-neutral-900 text-sm mb-3">
                        🎯 Based on recent discussions about bike lanes and traffic, would you like me to help organize a "Sustainable Transportation Forum"? I can assist with scheduling, invitations, and agenda planning.
                      </p>
                      <div className="flex space-x-3">
                        <button className="bg-neutral-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-neutral-800 transition-colors">
                          Let's Plan It
                        </button>
                        <button className="text-neutral-600 text-sm hover:underline">
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">Upcoming Events</h2>
                    <p className="text-neutral-600 text-sm">Community gatherings and civic activities</p>
                  </div>
                  {isHost && (
                    <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-neutral-800 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </button>
                  )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {events.map((event) => {
                    const getIcon = () => {
                      switch (event.icon) {
                        case "gavel":
                          return <Gavel className="w-6 h-6 text-neutral-600" />;
                        case "sprout":
                          return <Sprout className="w-6 h-6 text-neutral-600" />;
                        case "bike":
                          return <Bike className="w-6 h-6 text-neutral-600" />;
                        case "handshake":
                          return <Handshake className="w-6 h-6 text-neutral-600" />;
                        default:
                          return <Calendar className="w-6 h-6 text-neutral-600" />;
                      }
                    };

                    const getTypeLabel = () => {
                      switch (event.type) {
                        case "official":
                          return "Official";
                        case "volunteer":
                          return "Volunteer";
                        case "discussion":
                          return "Discussion";
                        case "social":
                          return "Social";
                        default:
                          return "Event";
                      }
                    };

                    return (
                      <div
                        key={event.id}
                        className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-neutral-300 h-32 flex items-center justify-center">
                          <div className="text-center text-neutral-600">
                            {getIcon()}
                            <p className="text-sm mt-2">{event.title}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs">
                              {getTypeLabel()}
                            </span>
                            <span className="text-neutral-500 text-xs">{event.date}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-neutral-600 text-sm mb-3">{event.description}</p>
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="flex items-center text-neutral-500 text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>
                                {event.time}
                                {event.endTime && ` - ${event.endTime}`}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-neutral-500 text-sm">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-neutral-500 text-sm">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{event.attending || 0} attending</span>
                            </div>
                            <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition-colors">
                              RSVP
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Past Events */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {pastEvents.map((event) => {
                      const getIcon = () => {
                        switch (event.icon) {
                          case "sprout":
                            return <Sprout className="w-6 h-6 text-neutral-600" />;
                          case "comments":
                            return <MessageSquare className="w-6 h-6 text-neutral-600" />;
                          default:
                            return <Calendar className="w-6 h-6 text-neutral-600" />;
                        }
                      };

                      return (
                        <div
                          key={event.id}
                          className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-neutral-300 rounded-lg flex items-center justify-center">
                              {getIcon()}
                            </div>
                            <div>
                              <h4 className="text-neutral-900 font-medium">{event.title}</h4>
                              <p className="text-neutral-600 text-sm">
                                {event.date} • {event.attending || 0} attended
                              </p>
                            </div>
                          </div>
                          <button className="text-neutral-600 text-sm hover:text-neutral-900 transition-colors">
                            View Summary
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === "media" && (
              <div className="text-center py-12">
                <p className="text-neutral-600">Media gallery coming soon</p>
              </div>
            )}

            {activeTab === "members" && (
              <>
                {/* Members Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">Community Members</h2>
                    <p className="text-neutral-600">
                      {memberStats.total || arcade._count.memberships} active members • {Math.floor((memberStats.total || arcade._count.memberships) * 0.5)} online now
                    </p>
                  </div>
                  {isHost && (
                    <div className="flex space-x-3">
                      <button className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm flex items-center hover:bg-neutral-50 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Export List
                      </button>
                      <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-neutral-800 transition-colors">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Members
                      </button>
                    </div>
                  )}
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        placeholder="Search members by name or role"
                      />
                    </div>
                    <button className="flex items-center bg-white border border-neutral-300 rounded-lg px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "online", "hosts", "new", "active"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setMemberFilter(filter);
                          setMemberPage(1);
                        }}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          memberFilter === filter
                            ? "bg-neutral-900 text-white"
                            : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {filter === "all"
                          ? "All Members"
                          : filter === "online"
                          ? "Online"
                          : filter === "hosts"
                          ? "Hosts"
                          : filter === "new"
                          ? "New This Week"
                          : "Most Active"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-4">
                  {members.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-neutral-50">
                      <p className="text-neutral-600">No members found</p>
                    </div>
                  ) : (
                    members.map((member, index) => {
                      const isOnline = index < 3; // Mock online status
                      const joinedDate = new Date(member.joinedAt);
                      const isNewThisWeek =
                        (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24) < 7;

                      return (
                        <div
                          key={member.id}
                          className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <img
                                  src={
                                    member.avatarUrl ||
                                    `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${member.id}`
                                  }
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div
                                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                                    isOnline ? "bg-neutral-500" : "bg-neutral-400"
                                  }`}
                                ></div>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-neutral-900 font-semibold">{member.name}</h3>
                                  <span
                                    className={`bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs ${
                                      member.role === "host" ? "font-medium" : ""
                                    }`}
                                  >
                                    {member.role === "host" ? "Host" : "Member"}
                                  </span>
                                  {isNewThisWeek && (
                                    <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full text-xs">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="text-neutral-600 text-sm mb-1">
                                  {member.bio || "Member"} • Active {formatTimeAgo(member.joinedAt)} ago
                                </p>
                                <p className="text-neutral-500 text-sm">
                                  Joined {joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })} •{" "}
                                  {member.postCount || 0} posts • {member.commentCount || 0} comments
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {member.role !== "host" && isHost && (
                                <button
                                  onClick={async () => {
                                    // TODO: Implement promote to host
                                    alert("Promote to host functionality coming soon");
                                  }}
                                  className="bg-neutral-900 text-white px-3 py-1.5 text-sm rounded hover:bg-neutral-800 transition-colors"
                                >
                                  Promote to Host
                                </button>
                              )}
                              <button className="text-neutral-600 hover:text-neutral-900 px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 transition-colors">
                                Message
                              </button>
                              <button className="text-neutral-600 hover:text-neutral-900 p-2 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {memberPagination.total > 6 && (
                  <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (memberPage > 1) {
                            setMemberPage(memberPage - 1);
                          }
                        }}
                        disabled={memberPage === 1}
                        className="px-3 py-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-50 transition-colors flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, Math.ceil(memberPagination.total / 6)) }, (_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === Math.ceil(memberPagination.total / 6) ||
                          (pageNum >= memberPage - 1 && pageNum <= memberPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setMemberPage(pageNum)}
                              className={`px-3 py-2 rounded transition-colors ${
                                memberPage === pageNum
                                  ? "bg-neutral-900 text-white"
                                  : "text-neutral-600 hover:text-neutral-900"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === memberPage - 2 ||
                          pageNum === memberPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="px-3 py-2 text-neutral-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => {
                          if (memberPagination.hasMore) {
                            setMemberPage(memberPage + 1);
                          }
                        }}
                        disabled={!memberPagination.hasMore}
                        className="px-3 py-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-50 transition-colors flex items-center"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Host Interaction Panel */}
        {activeTab === "members" && (
          <div className="w-full lg:w-80 bg-neutral-50 border-l border-neutral-200 p-6">
            {/* AI Host Summary */}
            <div className="mb-8">
              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={aiHostAvatarUrl}
                    alt="AI Host Maya"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-neutral-900 font-medium">Maya</span>
                      <span className="ml-2 bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">
                        AI Host
                      </span>
                    </div>
                    <p className="text-neutral-900 text-sm mb-3">
                      Here's how engagement has evolved this week...
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">New members</span>
                    <span className="text-sm text-neutral-900 font-medium">+{memberStats.newThisWeek || 8}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Active discussions</span>
                    <span className="text-sm text-neutral-900 font-medium">+24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Event participation</span>
                    <span className="text-sm text-neutral-900 font-medium">+15%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm text-neutral-900 mb-2 font-medium">Participation This Week</h4>
                  <div className="flex items-end space-x-1 h-16">
                    {[
                      { height: 32, color: "bg-neutral-300" },
                      { height: 48, color: "bg-neutral-400" },
                      { height: 40, color: "bg-neutral-500" },
                      { height: 56, color: "bg-neutral-600" },
                      { height: 64, color: "bg-neutral-700" },
                      { height: 44, color: "bg-neutral-500" },
                      { height: 36, color: "bg-neutral-400" },
                    ].map((bar, index) => (
                      <div
                        key={index}
                        className={`${bar.color} w-4 rounded-sm`}
                        style={{ height: `${bar.height}px` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Statistics */}
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <BarChart3 className="w-4 h-4 mr-2" />
                Member Statistics
              </h3>
              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-neutral-700 rounded-full mr-2"></div>
                      <span className="text-sm text-neutral-600">Hosts</span>
                    </div>
                    <span className="text-sm text-neutral-900 font-medium">
                      {memberStats.hosts || 3}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-neutral-500 rounded-full mr-2"></div>
                      <span className="text-sm text-neutral-600">Active Members</span>
                    </div>
                    <span className="text-sm text-neutral-900 font-medium">
                      {Math.max(0, (memberStats.total || arcade._count.memberships) - (memberStats.hosts || 3) - (memberStats.newThisWeek || 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-neutral-300 rounded-full mr-2"></div>
                      <span className="text-sm text-neutral-600">New This Week</span>
                    </div>
                    <span className="text-sm text-neutral-900 font-medium">
                      {memberStats.newThisWeek || 8}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-neutral-200 rounded-full mr-2"></div>
                      <span className="text-sm text-neutral-600">Inactive</span>
                    </div>
                    <span className="text-sm text-neutral-900 font-medium">
                      {Math.max(0, Math.floor((memberStats.total || arcade._count.memberships) * 0.25))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="bg-white border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=111"
                      alt="Member"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">Alex Thompson joined the community</p>
                      <p className="text-xs text-neutral-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=222"
                      alt="Member"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">Jamie Park was promoted to Host</p>
                      <p className="text-xs text-neutral-500">4 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=333"
                      alt="Member"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900">David Kim started following the community</p>
                      <p className="text-xs text-neutral-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar - Resources & Members (for Events tab) */}
        {activeTab === "events" && (
          <div className="w-full lg:w-80 bg-neutral-50 border-l border-neutral-200 p-6">
            {/* Community Resources */}
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <FolderOpen className="w-4 h-4 mr-2" />
                Community Resources
              </h3>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const getIcon = () => {
                    switch (resource.type) {
                      case "pdf":
                        return <File className="w-4 h-4 text-neutral-600" />;
                      case "link":
                        return <LinkIcon className="w-4 h-4 text-neutral-600" />;
                      case "document":
                        return <FileText className="w-4 h-4 text-neutral-600" />;
                      case "map":
                        return <Map className="w-4 h-4 text-neutral-600" />;
                      default:
                        return <FileText className="w-4 h-4 text-neutral-600" />;
                    }
                  };

                  return (
                    <div
                      key={resource.id}
                      className="bg-white border border-neutral-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-neutral-300 rounded flex items-center justify-center flex-shrink-0">
                          {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-neutral-900 text-sm font-medium truncate">
                            {resource.title}
                          </h4>
                          <p className="text-neutral-600 text-xs truncate">
                            {resource.description}
                          </p>
                        </div>
                        <button className="text-neutral-500 hover:text-neutral-700 transition-colors flex-shrink-0">
                          {resource.type === "pdf" ? (
                            <Download className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Members */}
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <Users className="w-4 h-4 mr-2" />
                Active Members
                <span className="ml-auto text-sm text-neutral-600 font-normal">
                  {Math.floor((memberStats.total || arcade._count.memberships) * 0.5)} online
                </span>
              </h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member, index) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          member.avatarUrl ||
                          `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${member.id}`
                        }
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                          index < 4 ? "bg-neutral-500" : "bg-neutral-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900 font-medium">{member.name}</p>
                      <p className="text-xs text-neutral-600">
                        {member.bio || (member.role === "host" ? "Host" : "Member")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("members")}
                className="w-full mt-4 text-neutral-600 text-sm hover:text-neutral-900 transition-colors"
              >
                View all members
              </button>
            </div>

            {/* AI Suggestion Footer */}
            <div className="mt-8 p-4 bg-white border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src={aiHostAvatarUrl}
                  alt="AI Host Maya"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-neutral-900 text-sm font-medium">Maya</span>
                <span className="ml-2 bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs">
                  AI Host
                </span>
              </div>
              <p className="text-neutral-600 text-sm mb-3">
                Have an idea for a community event?
              </p>
              <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-3 py-2 rounded-lg text-sm transition-colors">
                Suggest a new event (AI Host assists)
              </button>
            </div>
          </div>
        )}

        {/* Right Sidebar - Events & Members (for Posts tab) */}
        {activeTab === "posts" && (
          <div className="w-full lg:w-80 bg-neutral-50 border-l border-neutral-200 p-6">
            {/* Upcoming Events */}
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-white border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-neutral-900 text-sm font-medium mb-1">{event.title}</h4>
                        <p className="text-neutral-600 text-xs mb-2">{event.description}</p>
                        <div className="flex items-center text-neutral-500 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {event.date}, {event.time}
                          </span>
                        </div>
                      </div>
                      <button className="text-neutral-900 text-xs bg-neutral-100 px-2 py-1 rounded hover:bg-neutral-200 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("events")}
                className="w-full mt-3 text-neutral-600 text-sm hover:text-neutral-900 transition-colors"
              >
                View all events
              </button>
            </div>

            {/* Active Members */}
            <div>
              <h3 className="text-neutral-900 mb-4 flex items-center font-semibold">
                <Users className="w-4 h-4 mr-2" />
                Active Members
                <span className="ml-auto text-sm text-neutral-600 font-normal">
                  {arcade._count.memberships} {arcade._count.memberships === 1 ? "member" : "members"}
                </span>
              </h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member, index) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          member.avatarUrl ||
                          `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${member.id}`
                        }
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                          index < 4 ? "bg-neutral-500" : "bg-neutral-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900 font-medium">{member.name}</p>
                      <p className="text-xs text-neutral-600">
                        {member.role === "host" ? "Host" : "Member"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("members")}
                className="w-full mt-4 text-neutral-600 text-sm hover:text-neutral-900 transition-colors"
              >
                View all members
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

