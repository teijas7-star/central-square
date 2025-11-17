"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  Building2,
  Landmark,
  Code,
  GraduationCap,
  Leaf,
  Heart,
  Store,
  Palette,
  MapPin,
  Award,
  MessageSquare,
  Globe,
  Filter,
  ArrowRight,
} from "lucide-react";
import Nav from "./layout/nav";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface PersonCard {
  id: string;
  name: string;
  role: string;
  city: string;
  bio: string;
  isHost: boolean;
  arcadeCount: number;
  contributionCount: number;
  avatarUrl?: string;
  interests: string[];
}

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // Mock data - replace with API calls
  const people: PersonCard[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Community Organizer",
      city: "Boston",
      bio: "Passionate about civic engagement and neighborhood initiatives.",
      isHost: true,
      arcadeCount: 3,
      contributionCount: 147,
      interests: ["Civic", "Community"],
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Local Business Owner",
      city: "Boston",
      bio: "Supporting local economic development and small business growth.",
      isHost: false,
      arcadeCount: 1,
      contributionCount: 89,
      interests: ["Business", "Community"],
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Environmental Activist",
      city: "Boston",
      bio: "Working towards sustainable urban development and climate action.",
      isHost: true,
      arcadeCount: 2,
      contributionCount: 203,
      interests: ["Climate", "Sustainability"],
    },
    {
      id: "4",
      name: "Alex Thompson",
      role: "City Planner",
      city: "Boston",
      bio: "Urban planning professional focused on equitable city development.",
      isHost: false,
      arcadeCount: 1,
      contributionCount: 156,
      interests: ["Urban Planning", "Civic"],
    },
    {
      id: "5",
      name: "Jamie Park",
      role: "Resident Advocate",
      city: "Boston",
      bio: "Advocating for resident rights and community voice in city decisions.",
      isHost: false,
      arcadeCount: 2,
      contributionCount: 112,
      interests: ["Civic", "Community"],
    },
    {
      id: "6",
      name: "Maya Rodriguez",
      role: "Tech Advocate",
      city: "San Francisco",
      bio: "Building open-source tools for civic engagement and transparent governance.",
      isHost: true,
      arcadeCount: 2,
      contributionCount: 234,
      interests: ["Tech", "Civic Tech"],
    },
    {
      id: "7",
      name: "Dr. James Liu",
      role: "Climate Scientist",
      city: "Singapore",
      bio: "Connecting climate solutions across cities worldwide.",
      isHost: true,
      arcadeCount: 1,
      contributionCount: 189,
      interests: ["Climate", "Sustainability"],
    },
    {
      id: "8",
      name: "Amara Okafor",
      role: "Artist",
      city: "Lagos",
      bio: "Creating public art that celebrates local culture and global connections.",
      isHost: false,
      arcadeCount: 1,
      contributionCount: 76,
      interests: ["Arts", "Culture"],
    },
  ];

  const roles = [
    { id: "all", label: "All Roles" },
    { id: "host", label: "Arcade Hosts" },
    { id: "Community Organizer", label: "Organizers" },
    { id: "Local Business Owner", label: "Business Owners" },
    { id: "Environmental Activist", label: "Activists" },
    { id: "City Planner", label: "Planners" },
    { id: "Artist", label: "Artists" },
  ];

  const cities = [
    { id: "all", label: "All Cities" },
    { id: "Boston", label: "Boston" },
    { id: "San Francisco", label: "San Francisco" },
    { id: "Singapore", label: "Singapore" },
    { id: "Lagos", label: "Lagos" },
  ];

  const getRoleIcon = (role: string) => {
    if (role.includes("Business")) return <Store className="w-5 h-5 text-white" />;
    if (role.includes("Planner") || role.includes("Urban")) return <Building2 className="w-5 h-5 text-white" />;
    if (role.includes("Civic") || role.includes("Organizer")) return <Landmark className="w-5 h-5 text-white" />;
    if (role.includes("Tech")) return <Code className="w-5 h-5 text-white" />;
    if (role.includes("Climate") || role.includes("Environmental")) return <Leaf className="w-5 h-5 text-white" />;
    if (role.includes("Artist")) return <Palette className="w-5 h-5 text-white" />;
    if (role.includes("Education")) return <GraduationCap className="w-5 h-5 text-white" />;
    return <Users className="w-5 h-5 text-white" />;
  };

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      searchQuery === "" ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesRole =
      selectedRole === "all" ||
      (selectedRole === "host" && person.isHost) ||
      person.role === selectedRole;
    
    const matchesCity =
      selectedCity === "all" || person.city === selectedCity;

    return matchesSearch && matchesRole && matchesCity;
  });

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="py-12 bg-neutral-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              People of Central Square
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Discover community leaders, organizers, and active members across cities.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-white border border-neutral-200 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Search by name, role, interests, or city..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-700">Filter:</span>
            </div>
            
            {/* Role Filter */}
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === role.id
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {/* City Filter */}
            <div className="flex items-center space-x-2 ml-auto">
              <MapPin className="w-4 h-4 text-neutral-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* People Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {filteredPeople.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-neutral-50">
              <Users className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2 text-lg font-medium">No people found</p>
              <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <SequentialBloomLogo size={32} />
                  </div>
                  Community Members
                  <span className="text-xl font-normal text-neutral-600 ml-2">
                    ({filteredPeople.length})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeople.map((person) => (
                  <Link
                    key={person.id}
                    href={`/people/${person.id}`}
                    className="bg-white border border-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                        {person.avatarUrl ? (
                          <Image
                            src={person.avatarUrl}
                            alt={person.name}
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-white text-xl font-semibold">
                            {person.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700">
                            {person.name}
                          </h3>
                          {person.isHost && (
                            <div className="flex items-center space-x-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                              <Award className="w-3 h-3" />
                              <span>Host</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{person.role}</p>
                        <div className="flex items-center text-xs text-neutral-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {person.city}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {person.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {person.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-neutral-600 pt-4 border-t border-neutral-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span>{person.arcadeCount} {person.arcadeCount === 1 ? "Arcade" : "Arcades"}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>{person.contributionCount} contributions</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Join the Community
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Connect with people who share your interests and build meaningful connections.
          </p>
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-4">
            <Link
              href="/signin"
              className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors inline-block"
            >
              Sign In to Connect
            </Link>
            <Link
              href="/global/arcades"
              className="border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-white transition-colors inline-block"
            >
              Explore Arcades
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


