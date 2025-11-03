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
  Search,
  Filter,
  Bot,
  Sparkles,
  Globe2,
  Activity,
} from "lucide-react";

interface HighlightCard {
  id: string;
  city: string;
  category: string;
  title: string;
  description: string;
  author: string;
  replies: number;
  contributors: number;
  avatarUrl?: string;
}

interface GlobalArcadeCard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  cities: string[];
}

interface CityCard {
  id: string;
  name: string;
  activeCount: number;
}

interface VoiceCard {
  id: string;
  name: string;
  role: string;
  city: string;
  quote: string;
  avatarUrl?: string;
}

export default function GlobalAgora() {
  // Mock data - replace with API calls
  const highlights: HighlightCard[] = [
    {
      id: "1",
      city: "London",
      category: "Arts",
      title: "Community Mural Project Transforms East London",
      description: "Local artists collaborate with residents to create a 200-meter mural celebrating neighborhood diversity...",
      author: "Sarah Chen",
      replies: 47,
      contributors: 12,
    },
    {
      id: "2",
      city: "Amsterdam",
      category: "Climate",
      title: "Floating Gardens Initiative Gains Global Support",
      description: "Innovative urban farming solution spreads to 12 cities worldwide, creating sustainable food networks...",
      author: "Erik van der Berg",
      replies: 89,
      contributors: 23,
    },
    {
      id: "3",
      city: "Boston",
      category: "Civic Tech",
      title: "Open Data Platform Empowers Neighborhood Advocacy",
      description: "New tool helps residents track city budget allocation and propose community improvements...",
      author: "Maya Rodriguez",
      replies: 63,
      contributors: 18,
    },
  ];

  const globalArcades: GlobalArcadeCard[] = [
    {
      id: "1",
      name: "Women in AI",
      subtitle: "Cross-city collective",
      description: "Connecting female AI researchers, entrepreneurs, and advocates across 15 cities worldwide.",
      icon: <Code className="w-4 h-4 text-white" />,
      cities: ["SF", "NYC", "LDN", "+12"],
    },
    {
      id: "2",
      name: "Urban Farms Network",
      subtitle: "Global sustainability",
      description: "Sharing knowledge and resources for urban agriculture projects worldwide.",
      icon: <Leaf className="w-4 h-4 text-white" />,
      cities: ["AMS", "BER", "TOR", "+8"],
    },
    {
      id: "3",
      name: "Global Running Collective",
      subtitle: "Wellness community",
      description: "Connecting runners worldwide for virtual races, training tips, and cultural exchanges.",
      icon: <Heart className="w-4 h-4 text-white" />,
      cities: ["TOK", "SYD", "RIO", "+20"],
    },
  ];

  const cities: CityCard[] = [
    { id: "1", name: "London", activeCount: 247 },
    { id: "2", name: "New York", activeCount: 189 },
    { id: "3", name: "Amsterdam", activeCount: 156 },
    { id: "4", name: "Tokyo", activeCount: 203 },
    { id: "5", name: "Berlin", activeCount: 134 },
    { id: "6", name: "São Paulo", activeCount: 178 },
  ];

  const voices: VoiceCard[] = [
    {
      id: "1",
      name: "Maria Santos",
      role: "Mayor",
      city: "São Paulo",
      quote: "Connection transcends borders. When cities share solutions, we all grow stronger.",
    },
    {
      id: "2",
      name: "Dr. James Liu",
      role: "Climate Scientist",
      city: "Singapore",
      quote: "The solutions we need exist in communities worldwide. We just need to connect them.",
    },
    {
      id: "3",
      name: "Amara Okafor",
      role: "Artist",
      city: "Lagos",
      quote: "Art speaks a universal language. Through creativity, we find our shared humanity.",
    },
  ];

  const pulseThemes = [
    "Hope",
    "Sustainability",
    "Reform",
    "Art",
    "Innovation",
    "Community",
    "Connection",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-neutral-900">Central Square</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  My City
                </Link>
                <Link
                  href="/global"
                  className="text-neutral-900 border-b-2 border-neutral-900 pb-1 font-medium"
                >
                  Global Agora
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
                className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Join Conversation
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-32 top-20 w-32 h-32 border border-white rounded-full opacity-20"></div>
          <div className="absolute left-16 bottom-24 w-24 h-24 border border-white rounded-full opacity-15"></div>
          <div className="absolute right-64 top-72 w-4 h-4 bg-white rounded-full opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Central Square: The Global Agora
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Where the world's communities meet to share what they're building, learning, and imagining.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/discover"
                className="bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
              >
                Explore Global Conversations
              </Link>
              <Link
                href="/"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Return to My City
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-neutral-900">Global Highlights</h2>
            <div className="flex flex-wrap gap-2">
              <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                Arts
              </button>
              <button className="bg-white border border-neutral-300 text-neutral-600 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                Civic Tech
              </button>
              <button className="bg-white border border-neutral-300 text-neutral-600 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                Well-being
              </button>
              <button className="bg-white border border-neutral-300 text-neutral-600 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                Climate
              </button>
              <button className="bg-white border border-neutral-300 text-neutral-600 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                Innovation
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="bg-white border border-neutral-200 rounded-lg p-5 hover:bg-neutral-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-3 text-white" />
                  </div>
                  <span className="text-sm text-neutral-600">
                    {highlight.city} • {highlight.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 line-clamp-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{highlight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neutral-300 rounded-full"></div>
                    <span className="text-xs text-neutral-500">{highlight.author}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-neutral-500">
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {highlight.replies}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {highlight.contributors}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Arcades Directory */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Global Arcades Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {globalArcades.map((arcade) => (
              <div
                key={arcade.id}
                className="bg-white border border-neutral-200 rounded-lg p-5 hover:bg-neutral-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                    {arcade.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{arcade.name}</h3>
                    <p className="text-sm text-neutral-600">{arcade.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-4">{arcade.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral-500">Active in:</span>
                    <div className="flex flex-wrap gap-1">
                      {arcade.cities.map((city, idx) => (
                        <span
                          key={idx}
                          className="bg-neutral-100 text-neutral-900 px-2 py-1 rounded text-xs"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="w-full bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                  Join Arcade
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Across the Cities */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Across the Cities</h2>
          <div className="bg-neutral-100 rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {cities.map((city) => (
                <div key={city.id} className="text-center">
                  <div className="w-12 h-12 bg-neutral-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{city.name}</h3>
                  <p className="text-xs text-neutral-600">{city.activeCount} active</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/cities"
                className="text-neutral-600 hover:text-neutral-900 font-medium inline-flex items-center"
              >
                View All Cities
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Voices */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Global Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {voices.map((voice) => (
              <div key={voice.id} className="text-center">
                <div className="w-24 h-24 bg-neutral-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{voice.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {voice.role}, {voice.city}
                </p>
                <p className="text-neutral-700 italic">&quot;{voice.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Pulse */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">The Pulse</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {pulseThemes.map((theme, idx) => (
                <span
                  key={theme}
                  className={`px-4 py-3 rounded-full text-sm font-medium ${
                    idx === 1 || idx === 3 || idx === 6
                      ? "bg-neutral-200 text-neutral-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {theme}
                </span>
              ))}
            </div>
            <p className="text-center text-neutral-600 text-sm">
              Real-time themes emerging from global conversations
            </p>
          </div>
        </div>
      </section>

      {/* Join the Global Conversation CTA */}
      <section className="py-16 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Global Conversation</h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Share your ideas, create cross-city connections, or return to your local community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/square"
              className="bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Share an Idea
            </Link>
            <Link
              href="/arcades/create"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Create a Global Arcade
            </Link>
            <Link
              href="/"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Join Your City Square
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-neutral-900" />
                </div>
                <span className="text-lg font-semibold">Central Square</span>
              </div>
              <p className="text-sm text-neutral-400">
                Connecting communities worldwide through meaningful dialogue and shared purpose.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Global</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="/global" className="hover:text-white">
                    Global Agora
                  </Link>
                </li>
                <li>
                  <Link href="/cities" className="hover:text-white">
                    All Cities
                  </Link>
                </li>
                <li>
                  <Link href="/arcades" className="hover:text-white">
                    Global Arcades
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-white">
                    World Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="/guidelines" className="hover:text-white">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/moderators" className="hover:text-white">
                    Moderators
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <Link href="/newsletter" className="hover:text-white">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link href="/updates" className="hover:text-white">
                    Updates
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-sm text-neutral-400">
              © 2025 Central Square. Building bridges between communities worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

