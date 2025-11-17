"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  Globe,
  MapPin,
  Clock,
  Building2,
  Landmark,
  Code,
  GraduationCap,
  Leaf,
  Heart,
  Store,
  Palette,
  Bus,
  ChevronRight,
  Flame,
  Star,
  UserCircle,
  TrendingUp,
} from "lucide-react";
import { AnimatedRootsLogo } from "./CSLogos/animated-logos";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

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

interface EventCard {
  id: string;
  date: string;
  title: string;
  venue: string;
  type: string;
}

interface ConversationCard {
  id: string;
  origin: string;
  snippet: string;
  replies: number;
  contributors: number;
}

interface ProfileCard {
  id: string;
  name: string;
  role: string;
  isHost: boolean;
  avatarUrl?: string;
}

interface WorldCard {
  id: string;
  city: string;
  description: string;
  members: number;
}

// Icon mapping for arcades based on name/tags
function getArcadeIcon(name: string, tags: string[]) {
  const lowerName = name.toLowerCase();
  const lowerTags = tags.join(" ").toLowerCase();

  if (lowerName.includes("civic") || lowerTags.includes("civic") || lowerTags.includes("engagement")) {
    return <Landmark className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("tech") || lowerTags.includes("tech") || lowerTags.includes("code") || lowerTags.includes("innovation")) {
    return <Code className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("education") || lowerTags.includes("education") || lowerTags.includes("learning")) {
    return <GraduationCap className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("urban") || lowerName.includes("planning") || lowerTags.includes("urban") || lowerTags.includes("infrastructure")) {
    return <Building2 className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("climate") || lowerName.includes("environment") || lowerTags.includes("climate") || lowerTags.includes("environment") || lowerTags.includes("sustainability")) {
    return <Leaf className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("health") || lowerName.includes("wellness") || lowerTags.includes("health") || lowerTags.includes("wellness")) {
    return <Heart className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("business") || lowerTags.includes("business") || lowerTags.includes("economic")) {
    return <Store className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("arts") || lowerName.includes("culture") || lowerTags.includes("arts") || lowerTags.includes("culture")) {
    return <Palette className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("transportation") || lowerTags.includes("transport") || lowerTags.includes("mobility")) {
    return <Bus className="w-6 h-6 text-white" />;
  }
  if (lowerName.includes("aspen") || lowerName.includes("institute") || lowerTags.includes("institute") || lowerTags.includes("leadership")) {
    return <Landmark className="w-6 h-6 text-white" />;
  }
  return <Users className="w-6 h-6 text-white" />;
}

// Get icon background color based on tags
function getIconBgColor(tags: string[], index: number) {
  const lowerTags = tags.join(" ").toLowerCase();
  
  if (lowerTags.includes("civic") || lowerTags.includes("engagement")) {
    return "bg-neutral-700";
  }
  if (lowerTags.includes("tech") || lowerTags.includes("code")) {
    return "bg-blue-600";
  }
  if (lowerTags.includes("education") || lowerTags.includes("learning")) {
    return "bg-purple-600";
  }
  if (lowerTags.includes("climate") || lowerTags.includes("environment")) {
    return "bg-green-600";
  }
  if (lowerTags.includes("health") || lowerTags.includes("wellness")) {
    return "bg-red-600";
  }
  if (lowerTags.includes("business") || lowerTags.includes("economic")) {
    return "bg-orange-600";
  }
  if (lowerTags.includes("arts") || lowerTags.includes("culture")) {
    return "bg-pink-600";
  }
  if (lowerTags.includes("institute") || lowerTags.includes("leadership")) {
    return "bg-indigo-600";
  }
  
  const colors = [
    "bg-neutral-700",
    "bg-blue-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-orange-600",
    "bg-pink-600",
  ];
  return colors[index % colors.length];
}

// Activity indicator based on arcade data
function getActivityIndicator(arcade: Arcade) {
  const postCount = arcade._count?.posts || 0;
  const memberCount = arcade._count?.memberships || 0;
  
  if (postCount > 50 || memberCount > 200) {
    return { icon: <Flame className="w-3 h-3 text-orange-500" />, text: "Trending", color: "text-orange-600" };
  }
  if (postCount > 20 || memberCount > 100) {
    return { icon: <Star className="w-3 h-3 text-yellow-500" />, text: "Featured", color: "text-yellow-600" };
  }
  if (postCount > 5 || memberCount > 50) {
    return { icon: <TrendingUp className="w-3 h-3 text-blue-500" />, text: "Growing", color: "text-blue-600" };
  }
  return { icon: <UserCircle className="w-3 h-3 text-neutral-400" />, text: "Active", color: "text-neutral-600" };
}

export default function CityHome({ city = "Boston" }: { city?: string }) {
  // 6 example community arcades with made-up topics
  const exampleArcades: Arcade[] = [
    {
      id: "civic-engagement-hub",
      name: "Civic Engagement Hub",
      description: "Discuss local policies and participate in town halls. A space for neighbors to engage with city governance and make their voices heard.",
      tags: ["Civic", "Policy", "Governance"],
      visibility: "open",
      _count: {
        memberships: 1247,
        posts: 156,
      },
    },
    {
      id: "tech-innovation",
      name: "Tech & Innovation",
      description: "Digital accessibility and smart city initiatives. Explore how technology can improve our community.",
      tags: ["Tech", "Innovation", "Smart City"],
      visibility: "open",
      _count: {
        memberships: 892,
        posts: 98,
      },
    },
    {
      id: "education-network",
      name: "Education Network",
      description: "School board meetings and curriculum discussions. Connect parents, teachers, and students in meaningful dialogue.",
      tags: ["Education", "Learning", "Schools"],
      visibility: "open",
      _count: {
        memberships: 634,
        posts: 87,
      },
    },
    {
      id: "urban-planning",
      name: "Urban Planning",
      description: "City development and infrastructure projects. Shape the future of our neighborhoods together.",
      tags: ["Urban Planning", "Infrastructure", "Development"],
      visibility: "open",
      _count: {
        memberships: 523,
        posts: 64,
      },
    },
    {
      id: "environment-climate",
      name: "Environment & Climate",
      description: "Sustainability initiatives and green projects. Building a more sustainable future for our community.",
      tags: ["Climate", "Sustainability", "Environment"],
      visibility: "open",
      _count: {
        memberships: 445,
        posts: 92,
      },
    },
    {
      id: "health-wellness",
      name: "Health & Wellness",
      description: "Community health programs and mental health resources. Supporting each other's wellbeing.",
      tags: ["Health", "Wellness", "Mental Health"],
      visibility: "open",
      _count: {
        memberships: 389,
        posts: 55,
      },
    },
    {
      id: "aspen-institute",
      name: "Aspen Institute",
      description: "Leadership development and policy discussions. Engaging in thoughtful dialogue on critical issues facing our community.",
      tags: ["Leadership", "Policy", "Education"],
      visibility: "open",
      _count: {
        memberships: 567,
        posts: 78,
      },
    },
  ];

  const [arcades, setArcades] = useState<Arcade[]>(exampleArcades);
  const [loading, setLoading] = useState(false);

  const events: EventCard[] = [
    {
      id: "1",
      date: "Jan 15, 2025",
      title: "City Council Meeting",
      venue: "City Hall",
      type: "Official",
    },
    {
      id: "2",
      date: "Jan 20, 2025",
      title: "Community Cleanup Day",
      venue: "Central Park",
      type: "Volunteer",
    },
    {
      id: "3",
      date: "Jan 25, 2025",
      title: "Bike Lane Forum",
      venue: "Library Hall",
      type: "Discussion",
    },
    {
      id: "4",
      date: "Feb 1, 2025",
      title: "Neighborhood Meet & Greet",
      venue: "Community Center",
      type: "Social",
    },
    {
      id: "5",
      date: "Feb 10, 2025",
      title: "Budget Planning Session",
      venue: "Town Hall",
      type: "Official",
    },
    {
      id: "6",
      date: "Feb 15, 2025",
      title: "Sustainable Transportation Workshop",
      venue: "City Hall Annex",
      type: "Discussion",
    },
  ];

  const conversations: ConversationCard[] = [
    {
      id: "1",
      origin: "Civic Engagement Hub",
      snippet: "The new bike lane proposal has generated significant discussion. What are your thoughts on the proposed routes?",
      replies: 47,
      contributors: 23,
    },
    {
      id: "2",
      origin: "Education Network",
      snippet: "Parents are discussing the upcoming school board meeting agenda. Key topics include curriculum updates and facility improvements.",
      replies: 34,
      contributors: 18,
    },
    {
      id: "3",
      origin: "Urban Planning",
      snippet: "The downtown development project is moving forward. Community input sessions are scheduled for next month.",
      replies: 28,
      contributors: 15,
    },
    {
      id: "4",
      origin: "Environment & Climate",
      snippet: "Proposal for community solar project: Let's discuss feasibility and community benefits.",
      replies: 52,
      contributors: 31,
    },
  ];

  const people: ProfileCard[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Community Organizer",
      isHost: true,
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Local Business Owner",
      isHost: false,
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Environmental Activist",
      isHost: true,
    },
    {
      id: "4",
      name: "Alex Thompson",
      role: "City Planner",
      isHost: false,
    },
    {
      id: "5",
      name: "Jamie Park",
      role: "Resident Advocate",
      isHost: false,
    },
  ];

  const worldSquares: WorldCard[] = [
    {
      id: "1",
      city: "New York",
      description: "Join thousands of New Yorkers building community",
      members: 12450,
    },
    {
      id: "2",
      city: "San Francisco",
      description: "Tech-forward civic engagement on the West Coast",
      members: 8920,
    },
    {
      id: "3",
      city: "Chicago",
      description: "Midwest hub for community organizing",
      members: 6780,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                City Square · {city}
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Your city's digital agora. Connect with neighbors, engage in civic discourse, and build community together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/global/arcades"
                  className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center"
                >
                  Explore Arcades
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/arcades/create"
                  className="bg-white border-2 border-neutral-900 text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                >
                  Start Your Arcade
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-neutral-200">
              <Image
                src="/design/boston-skyline.jpg"
                alt={`${city} skyline`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Arcades */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Community Arcades
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse"
                >
                  <div className="w-12 h-12 bg-neutral-200 rounded-lg mb-4" />
                  <div className="h-5 bg-neutral-200 rounded mb-2" />
                  <div className="h-4 bg-neutral-200 rounded mb-4" />
                  <div className="h-4 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          ) : arcades.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">No arcades found yet.</p>
              <Link
                href="/arcades/create"
                className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Create the First Arcade
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {arcades.map((arcade, index) => {
                const activity = getActivityIndicator(arcade);
                const icon = getArcadeIcon(arcade.name, arcade.tags);
                
                return (
                  <Link
                    key={arcade.id}
                    href={arcade.id === "aspen-institute" || arcade.name === "Aspen Institute" ? "/aspeninstitute" : `/arcades/${arcade.id}`}
                    className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all group"
                  >
                    {/* Icon and Activity Indicator */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${getIconBgColor(arcade.tags, index)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {icon}
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-50 ${activity.color}`}>
                        {activity.icon}
                        <span className="text-xs font-medium">{activity.text}</span>
                      </div>
                    </div>
                    
                    {/* Arcade Name */}
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                      {arcade.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                      {arcade.description || "A community space for meaningful discussions and collaboration."}
                    </p>
                    
                    {/* Tags */}
                    {arcade.tags && arcade.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {arcade.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {arcade.tags.length > 2 && (
                          <span className="text-xs text-neutral-500 px-2 py-1">
                            +{arcade.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-3 text-xs text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{arcade._count?.memberships || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{arcade._count?.posts || 0}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Meets & Projects */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Upcoming Meets & Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-500">{event.date}</span>
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{event.title}</h3>
                <div className="flex items-center text-sm text-neutral-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.venue}</span>
                </div>
                <button className="w-full bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Conversations */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Featured Conversations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs">
                    {conversation.origin}
                  </span>
                </div>
                <p className="text-neutral-700 mb-4 line-clamp-2">{conversation.snippet}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {conversation.replies} replies
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {conversation.contributors} contributors
                    </span>
                  </div>
                  <button className="text-neutral-900 text-sm font-medium hover:underline flex items-center">
                    Join discussion
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People of the Square */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            People of the Square
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition-all text-center"
              >
                <div className="w-16 h-16 bg-neutral-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{person.name}</h3>
                <p className="text-sm text-neutral-600 mb-2">{person.role}</p>
                {person.isHost && (
                  <span className="inline-block bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs mb-3">
                    Host
                  </span>
                )}
                <Link
                  href={`/people/${person.id}`}
                  className="text-neutral-600 text-sm hover:text-neutral-900 hover:underline"
                >
                  View profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Across the Squares */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Across the Squares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {worldSquares.map((square) => (
              <div
                key={square.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-neutral-900">{square.city}</h3>
                  <Globe className="w-5 h-5 text-neutral-600" />
                </div>
                <p className="text-neutral-600 mb-4">{square.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">
                    {square.members.toLocaleString()} members
                  </span>
                  <Link
                    href={`/${square.city.toLowerCase().replace(' ', '-')}`}
                    className="text-neutral-900 text-sm font-medium hover:underline flex items-center"
                  >
                    Visit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Band */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build community?</h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Join your city's square, start your own arcade, or explore the global agora.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${city.toLowerCase()}/feed`}
              className="bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Join Your City's Square
            </Link>
            <Link
              href="/arcades/create"
              className="bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Start Your Arcade
            </Link>
            <Link
              href="/agora"
              className="bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Step into the Global Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Central Square</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/about" className="hover:text-neutral-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-neutral-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-neutral-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/global/arcades" className="hover:text-neutral-900">
                    Arcades
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-neutral-900">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/people" className="hover:text-neutral-900">
                    People
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/help" className="hover:text-neutral-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-neutral-900">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-neutral-900">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/twitter" className="hover:text-neutral-900">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="/facebook" className="hover:text-neutral-900">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-neutral-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
            <p>© 2025 Central Square. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

