"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Search,
  Filter,
  Globe,
  Building2,
  Landmark,
  Code,
  GraduationCap,
  Leaf,
  Heart,
  Store,
  Palette,
} from "lucide-react";
import Nav from "./layout/nav";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface EventCard {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  attendees: number;
  type: "local" | "global";
  arcadeId?: string;
  arcadeName?: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "local" | "global">("all");

  // Mock data - replace with API calls
  const events: EventCard[] = [
    {
      id: "1",
      title: "City Council Meeting",
      description: "Discussing budget allocation for community projects and infrastructure improvements.",
      date: "Jan 15, 2025",
      time: "6:00 PM",
      venue: "City Hall",
      city: "Boston",
      category: "Civic",
      attendees: 247,
      type: "local",
      arcadeId: "1",
      arcadeName: "Civic Engagement Hub",
    },
    {
      id: "2",
      title: "Community Cleanup Day",
      description: "Join neighbors for a day of cleaning up parks and public spaces. Refreshments provided.",
      date: "Jan 20, 2025",
      time: "10:00 AM",
      venue: "Central Park",
      city: "Boston",
      category: "Community",
      attendees: 156,
      type: "local",
      arcadeId: "4",
      arcadeName: "Urban Planning",
    },
    {
      id: "3",
      title: "Climate Action Network Global Summit",
      description: "Virtual summit connecting climate advocates from 20+ cities worldwide.",
      date: "Jan 25, 2025",
      time: "2:00 PM EST",
      venue: "Online",
      city: "Global",
      category: "Climate",
      attendees: 1247,
      type: "global",
      arcadeId: "4",
      arcadeName: "Climate Action Network",
    },
    {
      id: "4",
      title: "Tech & Innovation Workshop",
      description: "Learn about digital accessibility tools and smart city initiatives.",
      date: "Feb 2, 2025",
      time: "1:00 PM",
      venue: "Public Library",
      city: "Boston",
      category: "Tech",
      attendees: 89,
      type: "local",
      arcadeId: "2",
      arcadeName: "Tech & Innovation",
    },
    {
      id: "5",
      title: "Arts & Culture Festival",
      description: "Celebrate local artists and cultural diversity with performances and installations.",
      date: "Feb 10, 2025",
      time: "12:00 PM",
      venue: "Community Center",
      city: "Boston",
      category: "Arts",
      attendees: 312,
      type: "local",
      arcadeId: "8",
      arcadeName: "Arts & Culture",
    },
    {
      id: "6",
      title: "Women in AI Global Meetup",
      description: "Monthly virtual meetup connecting female AI researchers and entrepreneurs worldwide.",
      date: "Feb 15, 2025",
      time: "11:00 AM EST",
      venue: "Online",
      city: "Global",
      category: "Tech",
      attendees: 892,
      type: "global",
      arcadeId: "1",
      arcadeName: "Women in AI",
    },
  ];

  const categories = [
    { id: "all", label: "All Events" },
    { id: "Civic", label: "Civic" },
    { id: "Community", label: "Community" },
    { id: "Tech", label: "Tech" },
    { id: "Climate", label: "Climate" },
    { id: "Arts", label: "Arts" },
    { id: "Education", label: "Education" },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Civic":
        return <Landmark className="w-5 h-5 text-white" />;
      case "Tech":
        return <Code className="w-5 h-5 text-white" />;
      case "Education":
        return <GraduationCap className="w-5 h-5 text-white" />;
      case "Climate":
        return <Leaf className="w-5 h-5 text-white" />;
      case "Arts":
        return <Palette className="w-5 h-5 text-white" />;
      case "Community":
        return <Building2 className="w-5 h-5 text-white" />;
      default:
        return <Calendar className="w-5 h-5 text-white" />;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    
    const matchesType =
      selectedType === "all" || event.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const upcomingEvents = filteredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date();
  });

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="py-12 bg-neutral-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Join local and global events happening across Central Square communities.
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
                placeholder="Search events by name, location, or topic..."
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
            
            {/* Type Filter */}
            <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedType === "all"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType("local")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedType === "local"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Local
              </button>
              <button
                onClick={() => setSelectedType("global")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  selectedType === "global"
                    ? "bg-white text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Global
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-neutral-900 text-white"
                      : "bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-neutral-50">
              <Calendar className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2 text-lg font-medium">No events found</p>
              <p className="text-sm text-neutral-500 mb-4">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <SequentialBloomLogo size={32} />
                  </div>
                  Upcoming Events
                  <span className="text-xl font-normal text-neutral-600 ml-2">
                    ({upcomingEvents.length})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={event.arcadeId ? `/arcades/${event.arcadeId}/events/${event.id}` : "#"}
                    className="bg-white border border-neutral-200 rounded-xl p-6 hover:bg-neutral-50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        event.category === "Civic" ? "bg-neutral-700" :
                        event.category === "Tech" ? "bg-blue-600" :
                        event.category === "Climate" ? "bg-green-600" :
                        event.category === "Arts" ? "bg-purple-600" :
                        event.category === "Education" ? "bg-yellow-600" :
                        "bg-neutral-600"
                      }`}>
                        {getCategoryIcon(event.category)}
                      </div>
                      {event.type === "global" && (
                        <div className="flex items-center space-x-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                          <Globe className="w-3 h-3" />
                          <span>Global</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700">
                      {event.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {event.arcadeName && (
                      <div className="mb-4">
                        <Link
                          href={event.arcadeId ? `/arcades/${event.arcadeId}` : "#"}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-neutral-500 hover:text-neutral-900"
                        >
                          Part of {event.arcadeName}
                        </Link>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-neutral-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.venue}, {event.city}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees} {event.attendees === 1 ? "attendee" : "attendees"}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-neutral-900 font-medium group-hover:underline">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Create Event CTA */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
            Hosting an Event?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Create an event in your Arcade to bring your community together.
          </p>
          <Link
            href="/arcades/create"
            className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors inline-block"
          >
            Create an Arcade to Host Events
          </Link>
        </div>
      </section>
    </div>
  );
}




