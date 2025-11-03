"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Bot,
  Users,
  Calendar,
  Plus,
  Gavel,
  Sprout,
  Bike,
  Handshake,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  File,
  Link as LinkIcon,
  Map,
  ExternalLink,
  Search,
  Filter,
  Download,
} from "lucide-react";

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

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "link" | "document" | "map";
  url?: string;
}

interface Member {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
}

export default function ArcadeEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [arcade, setArcade] = useState<Arcade | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arcadeId, setArcadeId] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "official" | "volunteer" | "discussion" | "social">("all");
  const [filterTimeframe, setFilterTimeframe] = useState<"upcoming" | "past">("upcoming");

  // Mock events data (until events API is implemented)
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
    {
      id: "5",
      title: "Town Hall Discussion",
      description: "Open forum for community members to share concerns and ideas with city officials.",
      date: "Feb 10, 2025",
      time: "6:00 PM",
      endTime: "8:30 PM",
      location: "Town Hall",
      type: "official",
      attending: 45,
      icon: "gavel",
    },
    {
      id: "6",
      title: "Community Garden Workshop",
      description: "Learn sustainable gardening practices and help maintain our community garden.",
      date: "Feb 15, 2025",
      time: "2:00 PM",
      endTime: "4:00 PM",
      location: "Community Garden",
      type: "volunteer",
      attending: 12,
      icon: "sprout",
    },
  ]);

  const [pastEvents] = useState<Event[]>([
    {
      id: "7",
      title: "Community Garden Cleanup",
      description: "",
      date: "January 8, 2025",
      attending: 23,
      icon: "sprout",
    },
    {
      id: "8",
      title: "Town Hall Discussion",
      description: "",
      date: "January 5, 2025",
      attending: 45,
      icon: "comments",
    },
    {
      id: "9",
      title: "Budget Planning Session",
      description: "",
      date: "December 28, 2024",
      attending: 18,
      icon: "gavel",
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

  const [activeMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Sarah Chen",
      handle: "sarahchen",
      avatarUrl: null,
    },
    {
      id: "2",
      name: "Marcus Johnson",
      handle: "marcusj",
      avatarUrl: null,
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      handle: "elenar",
      avatarUrl: null,
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setArcadeId(id);

      // Load arcade info
      try {
        const arcadeRes = await fetch(`/api/arcades/${id}`, { cache: "no-store" });
        if (arcadeRes.ok) {
          const arcadeData = await arcadeRes.json();
          setArcade(arcadeData.arcade);
          
          // Check if user is host
          const profileRes = await fetch("/api/profiles");
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.profile) {
              setUserAvatar(profileData.profile.avatarUrl);
              setIsHost(arcadeData.arcade.host.id === profileData.profile.id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load arcade:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const getEventIcon = (icon?: string) => {
    switch (icon) {
      case "gavel":
        return <Gavel className="w-6 h-6 text-neutral-600" />;
      case "sprout":
        return <Sprout className="w-6 h-6 text-neutral-600" />;
      case "bike":
        return <Bike className="w-6 h-6 text-neutral-600" />;
      case "handshake":
        return <Handshake className="w-6 h-6 text-neutral-600" />;
      case "comments":
        return <MessageSquare className="w-6 h-6 text-neutral-600" />;
      default:
        return <Calendar className="w-6 h-6 text-neutral-600" />;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
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

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const filteredPastEvents = pastEvents.filter((event) => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading && !arcade) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (!arcade) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">Arcade not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-neutral-900">Central Square</h1>
                  <p className="text-sm text-neutral-600">{arcade.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isHost && (
                <button className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
                  <UserPlus className="w-4 h-3.5" />
                  <span>Invite</span>
                </button>
              )}
              <div className="flex items-center space-x-3">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-500" />
                  </div>
                )}
                <div className="hidden md:block">
                  <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-lg">
                    <Bot className="w-3 h-3 text-neutral-600" />
                    <span className="text-sm text-neutral-900">AI Host Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-neutral-600">{arcade.description || "A space for civic engagement and community building — guided by AI Host Maya."}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <Link
              href={`/arcades/${arcadeId}`}
              className="py-4 px-2 text-neutral-600 hover:text-neutral-900 border-b-2 border-transparent hover:border-neutral-900 transition-colors"
            >
              Posts
            </Link>
            <Link
              href={`/arcades/${arcadeId}/events`}
              className="py-4 px-2 text-neutral-900 border-b-2 border-neutral-900 font-medium"
            >
              Events
            </Link>
            <Link
              href={`/arcades/${arcadeId}?tab=media`}
              className="py-4 px-2 text-neutral-600 hover:text-neutral-900 border-b-2 border-transparent hover:border-neutral-900 transition-colors"
            >
              Media
            </Link>
            <Link
              href={`/arcades/${arcadeId}/members`}
              className="py-4 px-2 text-neutral-600 hover:text-neutral-900 border-b-2 border-transparent hover:border-neutral-900 transition-colors"
            >
              Members
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column - Events */}
          <div>
            {/* AI Host Event Suggestion */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
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

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    placeholder="Search events by title or description"
                  />
                </div>
                <button className="flex items-center bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterType === "all"
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setFilterType("official")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterType === "official"
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Official
                </button>
                <button
                  onClick={() => setFilterType("volunteer")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterType === "volunteer"
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Volunteer
                </button>
                <button
                  onClick={() => setFilterType("discussion")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterType === "discussion"
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Discussion
                </button>
                <button
                  onClick={() => setFilterType("social")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    filterType === "social"
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Social
                </button>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-neutral-50">
                <p className="text-neutral-600">No events found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-neutral-300 h-32 flex items-center justify-center">
                      <div className="text-center text-neutral-600">
                        {getEventIcon(event.icon)}
                        <p className="text-sm mt-2">{event.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs">
                          {getTypeLabel(event.type)}
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
                ))}
              </div>
            )}

            {/* Past Events */}
            {filterTimeframe === "past" && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Events</h3>
                {filteredPastEvents.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-neutral-50">
                    <p className="text-neutral-600 text-sm">No past events found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPastEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-neutral-300 rounded-lg flex items-center justify-center">
                            {getEventIcon(event.icon)}
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Resources & Members */}
          <div className="space-y-6">
            {/* Community Resources */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <h3 className="text-neutral-900 font-semibold mb-4">Community Resources</h3>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const getResourceIcon = () => {
                    switch (resource.type) {
                      case "pdf":
                        return <FileText className="w-4 h-4 text-neutral-600" />;
                      case "link":
                        return <LinkIcon className="w-4 h-4 text-neutral-600" />;
                      case "document":
                        return <File className="w-4 h-4 text-neutral-600" />;
                      case "map":
                        return <Map className="w-4 h-4 text-neutral-600" />;
                      default:
                        return <File className="w-4 h-4 text-neutral-600" />;
                    }
                  };

                  return (
                    <div
                      key={resource.id}
                      className="flex items-start space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getResourceIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-neutral-900 text-sm font-medium mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-neutral-600 text-xs mb-2">{resource.description}</p>
                        {resource.url && (
                          <a
                            href={resource.url}
                            className="text-neutral-600 text-xs hover:text-neutral-900 flex items-center"
                          >
                            {resource.type === "link" ? (
                              <>
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open link
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </>
                            )}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-900 font-semibold">Active Members</h3>
                <Link
                  href={`/arcades/${arcadeId}/members`}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  View all members
                </Link>
              </div>
              <div className="space-y-3">
                {activeMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <img
                      src={
                        member.avatarUrl ||
                        `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${member.id}`
                      }
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-900 text-sm font-medium">{member.name}</p>
                      <p className="text-neutral-600 text-xs">@{member.handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion Footer */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Bot className="w-4 h-4 text-neutral-600 mt-0.5" />
                <div>
                  <p className="text-neutral-700 text-sm mb-1">
                    Want to create a new event?
                  </p>
                  <p className="text-neutral-600 text-xs">
                    AI Host can help you plan and promote community events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

