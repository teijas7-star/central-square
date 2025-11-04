"use client";

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
} from "lucide-react";

interface ArcadeCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  host: string;
  memberCount: number;
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

export default function CityHome({ city = "Boston" }: { city?: string }) {
  // Mock data - replace with API calls
  const arcades: ArcadeCard[] = [
    {
      id: "1",
      name: "Civic Engagement Hub",
      description: "Discuss local policies and participate in town halls",
      icon: <Landmark className="w-6 h-6 text-white" />,
      host: "Sarah Chen",
      memberCount: 1247,
    },
    {
      id: "2",
      name: "Tech & Innovation",
      description: "Digital accessibility and smart city initiatives",
      icon: <Code className="w-6 h-6 text-white" />,
      host: "Marcus Johnson",
      memberCount: 892,
    },
    {
      id: "3",
      name: "Education Network",
      description: "School board meetings and curriculum discussions",
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      host: "Elena Rodriguez",
      memberCount: 634,
    },
    {
      id: "4",
      name: "Urban Planning",
      description: "City development and infrastructure projects",
      icon: <Building2 className="w-6 h-6 text-white" />,
      host: "Alex Thompson",
      memberCount: 523,
    },
    {
      id: "5",
      name: "Environment & Climate",
      description: "Sustainability initiatives and green projects",
      icon: <Leaf className="w-6 h-6 text-white" />,
      host: "Jamie Park",
      memberCount: 445,
    },
    {
      id: "6",
      name: "Health & Wellness",
      description: "Community health programs and mental health resources",
      icon: <Heart className="w-6 h-6 text-white" />,
      host: "David Kim",
      memberCount: 389,
    },
    {
      id: "7",
      name: "Local Business",
      description: "Small business support and economic development",
      icon: <Store className="w-6 h-6 text-white" />,
      host: "Lisa Wang",
      memberCount: 312,
    },
    {
      id: "8",
      name: "Arts & Culture",
      description: "Public art projects and cultural events",
      icon: <Palette className="w-6 h-6 text-white" />,
      host: "Mike Chen",
      memberCount: 278,
    },
  ];

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

  const getIconBgColor = (index: number) => {
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
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Strip */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
                <button className="px-3 py-1.5 bg-white rounded-md text-sm font-medium text-neutral-900 shadow-sm">
                  Your City
                </button>
                <button className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900">
                  Global Agora
                </button>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  Home
                </Link>
                <Link href="/discover" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  Arcades
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  Events
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  People
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signin"
                className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Central Square · {city}
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Your city's digital agora. Connect with neighbors, engage in civic discourse, and build community together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/discover"
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
                src="/design/boston-skyline.png"
                alt={`${city} skyline`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-300">
                <span className="text-neutral-500 text-sm">{city} Skyline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Arcades */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Community Arcades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {arcades.map((arcade, index) => (
              <Link
                key={arcade.id}
                href={`/arcades/${arcade.id}`}
                className="bg-white border border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:shadow-sm transition-all group"
              >
                <div className={`w-12 h-12 ${getIconBgColor(index)} rounded-lg flex items-center justify-center mb-4`}>
                  {arcade.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{arcade.name}</h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{arcade.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>Host: {arcade.host}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600">
                    {arcade.memberCount.toLocaleString()} members
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Meets & Projects */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Upcoming Meets & Projects</h2>
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
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Featured Conversations</h2>
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
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">People of the Square</h2>
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
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Across the Squares</h2>
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
              href="/global"
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
                  <Link href="/discover" className="hover:text-neutral-900">
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

