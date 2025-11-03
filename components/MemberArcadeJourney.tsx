"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  Image as ImageIcon,
  Paperclip,
  Smile,
  ChevronRight,
  Globe,
  Building2,
  Leaf,
  Clock,
} from "lucide-react";

interface MyArcade {
  id: string;
  name: string;
  memberCount: number;
  icon: React.ReactNode;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  arcade: string;
  attending: number;
}

interface FeedPost {
  id: string;
  type: "feed";
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  postedAt: string;
  likes: number;
  comments: number;
}

interface EventPost {
  id: string;
  type: "event";
  author: {
    name: string;
    avatarUrl?: string;
  };
  event: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
  };
  postedAt: string;
  likes: number;
  comments: number;
  attending: number;
}

interface ActiveMember {
  id: string;
  name: string;
  status: "online" | "recent" | "offline";
  lastActivity: string;
  avatarUrl?: string;
}

interface SuggestedArcade {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  icon: React.ReactNode;
}

export default function MemberArcadeJourney({
  arcadeId,
  arcadeName: initialArcadeName,
}: {
  arcadeId?: string;
  arcadeName?: string;
}) {
  const [activeTab, setActiveTab] = useState<"feed" | "events" | "people" | "collaborations">("feed");
  const [userName] = useState("Alex Chen");
  const [userLocation] = useState("Boston Runner");
  const [memberSince] = useState("2025");
  const [city] = useState("Boston");

  const [arcadeName] = useState(initialArcadeName || "Boston Runners");

  const [userStats] = useState({
    events: 12,
    posts: 8,
    arcades: 3,
  });

  const [myArcades] = useState<MyArcade[]>([
    {
      id: "1",
      name: "Boston Runners",
      memberCount: 245,
      icon: <Users className="w-3.5 h-3.5 text-white" />,
    },
    {
      id: "2",
      name: "CrossFit Central",
      memberCount: 89,
      icon: <Building2 className="w-3.5 h-3.5 text-white" />,
    },
    {
      id: "3",
      name: "Mindful Boston",
      memberCount: 156,
      icon: <Leaf className="w-3.5 h-3.5 text-white" />,
    },
  ]);

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: "1",
      title: "Morning Run - Charles River",
      date: "MAR 15",
      time: "7:00 AM",
      arcade: "Boston Runners",
      attending: 12,
    },
    {
      id: "2",
      title: "Weekend Warrior WOD",
      date: "MAR 18",
      time: "9:00 AM",
      arcade: "CrossFit Central",
      attending: 8,
    },
  ]);

  const [feedPosts] = useState<(FeedPost | EventPost)[]>([
    {
      id: "1",
      type: "feed",
      author: {
        name: "Sarah Martinez",
        avatarUrl: undefined,
      },
      content:
        "Just crushed a 5K around the Common! The weather was perfect and the energy was incredible. Who's joining tomorrow's morning run? 🌅",
      imageUrl: undefined,
      imageCaption: "Running photo from Boston Common",
      postedAt: "2h ago",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      type: "event",
      author: {
        name: "Boston Runners",
        avatarUrl: undefined,
      },
      event: {
        title: "Marathon Training - Long Run",
        description: "Join us for a 15-mile training run along the Charles River. Perfect for marathon prep!",
        date: "Saturday, March 16",
        time: "7:00 AM",
        location: "Charles River Esplanade",
      },
      postedAt: "5h ago",
      likes: 15,
      comments: 4,
      attending: 18,
    },
    {
      id: "3",
      type: "feed",
      author: {
        name: "Mike Johnson",
        avatarUrl: undefined,
      },
      content: `Tips for new runners: Start slow, focus on consistency over speed, and don't forget to celebrate small wins! What advice would you give to someone just starting their running journey?`,
      postedAt: "1d ago",
      likes: 32,
      comments: 12,
    },
  ]);

  const [activeMembers] = useState<ActiveMember[]>([
    {
      id: "1",
      name: "Emma Wilson",
      status: "online",
      lastActivity: "Running now",
      avatarUrl: undefined,
    },
    {
      id: "2",
      name: "David Park",
      status: "recent",
      lastActivity: "Posted 5m ago",
      avatarUrl: undefined,
    },
    {
      id: "3",
      name: "Lisa Chen",
      status: "online",
      lastActivity: "Online",
      avatarUrl: undefined,
    },
  ]);

  const [suggestedArcades] = useState<SuggestedArcade[]>([
    {
      id: "1",
      name: "Boston Cyclists",
      memberCount: 189,
      description: "Explore the city on two wheels with fellow cycling enthusiasts.",
      icon: <Building2 className="w-3.5 h-3.5 text-white" />,
    },
    {
      id: "2",
      name: "Wellness Warriors",
      memberCount: 124,
      description: "Holistic health and wellness community for mind, body, and spirit.",
      icon: <Leaf className="w-3.5 h-3.5 text-white" />,
    },
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-neutral-900">Central Square</span>
                <span className="text-sm text-neutral-500">{city}</span>
              </Link>
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search arcades, events, people..."
                  className="block w-full bg-white border border-neutral-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-neutral-600 hover:text-neutral-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-neutral-500 rounded-full"></span>
              </button>
              <button className="text-neutral-600 hover:text-neutral-900">
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex gap-4">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-neutral-900">{userName}</h3>
                  <p className="text-sm text-neutral-600">
                    {userLocation} • Member since {memberSince}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 pt-4 border-t border-neutral-200">
                <div className="text-center">
                  <p className="text-base font-medium text-neutral-900">{userStats.events}</p>
                  <p className="text-xs text-neutral-500">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-neutral-900">{userStats.posts}</p>
                  <p className="text-xs text-neutral-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-neutral-900">{userStats.arcades}</p>
                  <p className="text-xs text-neutral-500">Arcades</p>
                </div>
              </div>
            </div>

            {/* My Arcades */}
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="border-b border-neutral-200 px-4 py-4">
                <h3 className="text-base font-medium text-neutral-900">My Arcades</h3>
              </div>
              <div className="p-4 space-y-3">
                {myArcades.map((arcade) => (
                  <Link
                    key={arcade.id}
                    href={`/arcades/${arcade.id}`}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-neutral-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {arcade.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{arcade.name}</p>
                      <p className="text-xs text-neutral-500">{arcade.memberCount} members</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="border-b border-neutral-200 px-4 py-4">
                <h3 className="text-base font-medium text-neutral-900">Upcoming Events</h3>
              </div>
              <div className="p-4 space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="w-12 h-14 bg-neutral-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <p className="text-xs text-neutral-600 font-medium">{event.date.split(" ")[0]}</p>
                      <p className="text-base font-semibold text-neutral-900">{event.date.split(" ")[1]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 mb-1">{event.title}</p>
                      <p className="text-xs text-neutral-600 mb-1">
                        {event.time} • {event.arcade}
                      </p>
                      <p className="text-xs text-neutral-500">{event.attending} attending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Feed Area */}
          <div className="flex-1 max-w-2xl">
            {/* Welcome Banner */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Welcome to {arcadeName}, {userName.split(" ")[0]}! 🏃‍♂️
              </h2>
              <p className="text-base text-neutral-700 mb-6">
                You're now part of a community that runs together, grows together. Ready to hit the pavement?
              </p>
              <div className="flex items-center space-x-3">
                <button className="bg-neutral-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
                  Join Next Run
                </button>
                <button className="bg-white border border-neutral-300 text-neutral-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                  Complete Profile
                </button>
              </div>
            </div>

            {/* Compose Post */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Share an idea or photo from your run..."
                    className="w-full min-h-[98px] p-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm text-neutral-900 placeholder:text-neutral-400"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button className="text-neutral-600 hover:text-neutral-900">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button className="text-neutral-600 hover:text-neutral-900">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-neutral-600 hover:text-neutral-900">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Tabs */}
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="border-b border-neutral-200 px-4">
                <nav className="flex items-center space-x-6">
                  {[
                    { id: "feed", label: "Feed" },
                    { id: "events", label: "Events" },
                    { id: "people", label: "People" },
                    { id: "collaborations", label: "Collaborations" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-neutral-500 text-neutral-600"
                          : "border-transparent text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Feed Content */}
              <div className="p-6 space-y-6">
                {feedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 flex-shrink-0 space-y-4">
            {/* Active Members */}
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="border-b border-neutral-200 px-4 py-4">
                <h3 className="text-base font-medium text-neutral-900">Active Members</h3>
              </div>
              <div className="p-4 space-y-4">
                {activeMembers.map((member) => (
                  <div key={member.id} className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-neutral-500" />
                      </div>
                      {member.status === "online" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{member.name}</p>
                      <p className="text-xs text-neutral-500">{member.lastActivity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore Boston */}
            <div className="bg-white border border-neutral-200 rounded-lg">
              <div className="border-b border-neutral-200 px-4 py-4">
                <h3 className="text-base font-medium text-neutral-900">Explore {city}</h3>
              </div>
              <div className="p-4 space-y-4">
                {suggestedArcades.map((arcade) => (
                  <div key={arcade.id} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-8 h-8 bg-neutral-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        {arcade.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{arcade.name}</p>
                        <p className="text-xs text-neutral-500">{arcade.memberCount} members</p>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 mb-3">{arcade.description}</p>
                    <button className="w-full border border-neutral-300 text-neutral-700 py-1.5 rounded text-xs font-medium hover:bg-neutral-50 transition-colors">
                      Join Arcade
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Globally */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-neutral-900" />
                <h3 className="text-sm font-medium text-neutral-900">Connected Globally</h3>
              </div>
              <p className="text-xs text-neutral-600 mb-4">
                {arcadeName} is part of the Global Running Network with 12,000+ runners worldwide.
              </p>
              <button className="w-full bg-neutral-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-neutral-700 transition-colors">
                Explore Global Network
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-base font-medium text-neutral-900">Central Square</span>
            </div>
            <p className="text-sm text-neutral-500">
              Building intentional communities, one city at a time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponent: Post Card
function PostCard({ post }: { post: FeedPost | EventPost }) {
  if ("event" in post) {
    // Event Post
    return (
      <div className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 bg-neutral-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-base font-medium text-neutral-900">{post.author.name}</p>
              <span className="text-sm text-neutral-500">{post.postedAt}</span>
            </div>
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200 rounded-lg p-4 mt-3">
              <div className="flex items-start space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-neutral-900" />
                <h4 className="text-base font-medium text-neutral-900">{post.event.title}</h4>
              </div>
              <p className="text-sm text-neutral-700 mb-3">{post.event.description}</p>
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{post.event.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <span className="text-sm text-neutral-500">{post.attending} attending</span>
              </div>
              <button className="bg-neutral-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
                Join Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Feed Post
  return (
    <div className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-neutral-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-base font-medium text-neutral-900">{post.author.name}</p>
            <span className="text-sm text-neutral-500">{post.postedAt}</span>
          </div>
          <p className="text-base text-neutral-700 mb-4 leading-relaxed">{post.content}</p>
          {post.imageUrl && (
            <div className="bg-neutral-200 rounded-lg h-64 mb-4 flex items-center justify-center">
              {post.imageCaption && (
                <p className="text-neutral-500">{post.imageCaption}</p>
              )}
            </div>
          )}
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

