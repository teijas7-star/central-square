"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
  Gavel,
  Sprout,
  Bike,
  Handshake,
} from "lucide-react";
import ArcadeDashboardLayout from "@/components/ArcadeDashboardLayout";
import { SequentialBloomLogo } from "./CSLogos/animated-logos";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  type?: "official" | "volunteer" | "discussion" | "social";
  attending?: number;
}

export default function ArcadeDashboardEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [arcadeId, setArcadeId] = useState<string>("");
  const [arcadeName, setArcadeName] = useState<string>("Central Square Arcade");
  const [city, setCity] = useState<string>("Boston, MA");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "official" | "volunteer" | "discussion" | "social">("all");

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Community Garden Cleanup",
      description: "Join us for our monthly Central Square Park cleanup.",
      date: "Tomorrow, 9:00 AM",
      time: "9:00 AM",
      location: "Community Garden",
      type: "volunteer",
      attending: 15,
    },
    {
      id: "2",
      title: "Sustainable Living Workshop",
      description: "Learn sustainable gardening practices.",
      date: "March 15, 7:00 PM",
      time: "7:00 PM",
      location: "Community Center",
      type: "discussion",
      attending: 8,
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setArcadeId(id);

      try {
        const arcadeRes = await fetch(`/api/arcades/${id}`, { cache: "no-store" });
        if (arcadeRes.ok) {
          const arcadeData = await arcadeRes.json();
          setArcadeName(arcadeData.arcade.name);
          setCity("Boston, MA"); // City not available in Arcade model
        }
      } catch (error) {
        console.error("Failed to load arcade:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <ArcadeDashboardLayout arcadeId={arcadeId} arcadeName={arcadeName} city={city}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <SequentialBloomLogo size={32} />
            </div>
            Events
          </h2>
          <p className="text-neutral-600">Manage and organize community events</p>
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
                className="pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Search events..."
              />
            </div>
            <button className="flex items-center bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-700 hover:bg-neutral-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "official", "volunteer", "discussion", "social"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  filterType === type
                    ? "bg-neutral-900 text-white"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {type === "all" ? "All Events" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-neutral-50">
            <p className="text-neutral-600">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{event.title}</h3>
                <p className="text-sm text-neutral-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attending || 0} attending
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ArcadeDashboardLayout>
  );
}

