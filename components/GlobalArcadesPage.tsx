"use client";

import { useState } from "react";
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
  TrendingUp,
  Users2,
  Map,
  Grid3x3,
  List as ListIcon,
} from "lucide-react";

interface GlobalArcade {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  cities: string[];
  memberCount: number;
  category: string;
  featured: boolean;
}

interface CityPresence {
  city: string;
  arcadeId: string;
  memberCount: number;
}

export default function GlobalArcadesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - replace with API calls
  const globalArcades: GlobalArcade[] = [
    {
      id: "1",
      name: "Women in AI",
      subtitle: "Cross-city collective",
      description: "Connecting female AI researchers, entrepreneurs, and advocates across 15 cities worldwide. Fostering mentorship, knowledge sharing, and collaborative projects.",
      icon: <Code className="w-4 h-4 text-white" />,
      cities: ["SF", "NYC", "LDN", "TOK", "BER", "+10"],
      memberCount: 2847,
      category: "tech",
      featured: true,
    },
    {
      id: "2",
      name: "Urban Farms Network",
      subtitle: "Global sustainability",
      description: "Sharing knowledge and resources for urban agriculture projects worldwide. Connecting urban farmers, sustainability advocates, and food security initiatives.",
      icon: <Leaf className="w-4 h-4 text-white" />,
      cities: ["AMS", "BER", "TOR", "SFO", "NYC", "+8"],
      memberCount: 1923,
      category: "sustainability",
      featured: true,
    },
    {
      id: "3",
      name: "Global Running Collective",
      subtitle: "Wellness community",
      description: "Connecting runners worldwide for virtual races, training tips, and cultural exchanges. Building a supportive global running community.",
      icon: <Heart className="w-4 h-4 text-white" />,
      cities: ["TOK", "SYD", "RIO", "NYC", "LDN", "+20"],
      memberCount: 4567,
      category: "wellness",
      featured: true,
    },
    {
      id: "4",
      name: "Climate Action Network",
      subtitle: "Environmental advocacy",
      description: "Coordinating climate action initiatives across cities. Sharing best practices, organizing global campaigns, and building climate resilience.",
      icon: <Leaf className="w-4 h-4 text-white" />,
      cities: ["AMS", "COP", "SF", "BER", "SYD", "+12"],
      memberCount: 3124,
      category: "climate",
      featured: false,
    },
    {
      id: "5",
      name: "Public Art Collective",
      subtitle: "Global arts movement",
      description: "Uniting artists and communities worldwide to create public art that celebrates local culture and global connections.",
      icon: <Palette className="w-4 h-4 text-white" />,
      cities: ["NYC", "LDN", "PAR", "TOK", "RIO", "+15"],
      memberCount: 2789,
      category: "arts",
      featured: false,
    },
    {
      id: "6",
      name: "Open Source Civic Tech",
      subtitle: "Digital democracy",
      description: "Building open-source tools for civic engagement and transparent governance. Connecting developers, activists, and city officials.",
      icon: <Code className="w-4 h-4 text-white" />,
      cities: ["SF", "NYC", "LDN", "BER", "AMS", "+8"],
      memberCount: 1654,
      category: "civic-tech",
      featured: false,
    },
    {
      id: "7",
      name: "Mental Health Allies",
      subtitle: "Global support network",
      description: "Creating safe spaces for mental health discussions and peer support across cultures and languages.",
      icon: <Heart className="w-4 h-4 text-white" />,
      cities: ["NYC", "LDN", "TOK", "SYD", "TOR", "+18"],
      memberCount: 4231,
      category: "wellness",
      featured: false,
    },
    {
      id: "8",
      name: "Zero Waste Cities",
      subtitle: "Circular economy",
      description: "Transforming cities into zero-waste communities through shared strategies, innovative solutions, and community action.",
      icon: <Leaf className="w-4 h-4 text-white" />,
      cities: ["AMS", "SF", "TOK", "SYD", "COP", "+10"],
      memberCount: 2345,
      category: "sustainability",
      featured: false,
    },
  ];

  const categories = [
    { id: "all", label: "All Arcades" },
    { id: "tech", label: "Tech" },
    { id: "sustainability", label: "Sustainability" },
    { id: "wellness", label: "Wellness" },
    { id: "climate", label: "Climate" },
    { id: "arts", label: "Arts" },
    { id: "civic-tech", label: "Civic Tech" },
  ];

  const filteredArcades = globalArcades.filter((arcade) => {
    const matchesSearch =
      searchQuery === "" ||
      arcade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arcade.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || arcade.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArcades = globalArcades.filter((arcade) => arcade.featured);

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
                <Link href="/global" className="text-neutral-600 hover:text-neutral-900 font-medium">
                  Global Agora
                </Link>
                <Link
                  href="/global/arcades"
                  className="text-neutral-900 border-b-2 border-neutral-900 pb-1 font-medium"
                >
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
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Global Arcades
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Discover organizations connecting communities across cities worldwide. Join global movements shaping our shared future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 text-neutral-600">
                <Globe className="w-5 h-5" />
                <span className="text-sm">{globalArcades.length} Global Arcades</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-600">
                <Map className="w-5 h-5" />
                <span className="text-sm">50+ Cities</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-600">
                <Users2 className="w-5 h-5" />
                <span className="text-sm">
                  {globalArcades.reduce((sum, arcade) => sum + arcade.memberCount, 0).toLocaleString()} Members
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search global arcades..."
                  className="pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-neutral-600" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-neutral-900 text-white"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 border border-neutral-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                aria-label="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Arcades */}
      {featuredArcades.length > 0 && (
        <section className="py-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Featured Global Arcades</h2>
              <Link
                href="#all-arcades"
                className="text-neutral-600 hover:text-neutral-900 text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArcades.map((arcade) => (
                <GlobalArcadeCard key={arcade.id} arcade={arcade} featured={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Arcades */}
      <section id="all-arcades" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              All Global Arcades
              {filteredArcades.length !== globalArcades.length && (
                <span className="text-neutral-600 font-normal ml-2">
                  ({filteredArcades.length} of {globalArcades.length})
                </span>
              )}
            </h2>
          </div>

          {filteredArcades.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-neutral-50">
              <p className="text-neutral-600 mb-2">No arcades found matching your filters</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-neutral-900 hover:underline text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArcades.map((arcade) => (
                <GlobalArcadeCard key={arcade.id} arcade={arcade} featured={false} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArcades.map((arcade) => (
                <GlobalArcadeListCard key={arcade.id} arcade={arcade} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Start a Global Arcade?</h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Create a cross-city organization that connects communities worldwide around shared purpose.
          </p>
          <Link
            href="/arcades/create?global=true"
            className="bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors inline-block"
          >
            Create Global Arcade
          </Link>
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
                  <Link href="/global/arcades" className="hover:text-white">
                    Global Arcades
                  </Link>
                </li>
                <li>
                  <Link href="/cities" className="hover:text-white">
                    All Cities
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

// Subcomponent: Global Arcade Card (Grid View)
function GlobalArcadeCard({
  arcade,
  featured,
}: {
  arcade: GlobalArcade;
  featured: boolean;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:bg-neutral-50 hover:shadow-md transition-all">
      {featured && (
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-4 h-4 text-neutral-600" />
          <span className="text-xs font-medium text-neutral-600">Featured</span>
        </div>
      )}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
          {arcade.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">{arcade.name}</h3>
          <p className="text-sm text-neutral-600">{arcade.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">{arcade.description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-500">Active in:</span>
          <div className="flex flex-wrap gap-1">
            {arcade.cities.map((city, idx) => (
              <span
                key={idx}
                className="bg-neutral-100 text-neutral-900 px-2 py-0.5 rounded text-xs font-medium"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-neutral-600">
          <Users className="w-4 h-4" />
          <span>{arcade.memberCount.toLocaleString()} members</span>
        </div>
        <Link
          href={`/global/arcades/${arcade.id}`}
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          View Arcade
        </Link>
      </div>
    </div>
  );
}

// Subcomponent: Global Arcade List Card (List View)
function GlobalArcadeListCard({ arcade }: { arcade: GlobalArcade }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:bg-neutral-50 hover:shadow-sm transition-all">
      <div className="flex items-start space-x-6">
        <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
          {arcade.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-1">{arcade.name}</h3>
              <p className="text-sm text-neutral-600">{arcade.subtitle}</p>
            </div>
            <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-xs font-medium">
              {arcade.category}
            </span>
          </div>
          <p className="text-neutral-600 mb-4">{arcade.description}</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">
                  {arcade.memberCount.toLocaleString()} members
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">{arcade.cities.length} cities</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">Active in:</span>
                <div className="flex flex-wrap gap-1">
                  {arcade.cities.slice(0, 5).map((city, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-100 text-neutral-900 px-2 py-0.5 rounded text-xs"
                    >
                      {city}
                    </span>
                  ))}
                  {arcade.cities.length > 5 && (
                    <span className="text-xs text-neutral-500">+{arcade.cities.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/global/arcades/${arcade.id}`}
              className="bg-neutral-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center"
            >
              View Arcade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

