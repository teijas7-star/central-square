"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  TrendingUp,
  UserPlus,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Link2,
  User,
} from "lucide-react";
import ArcadeDashboardLayout from "./ArcadeDashboardLayout";

interface StatCard {
  id: string;
  icon: React.ReactNode;
  value: string | number;
  label: string;
  period: string;
  change?: string;
  subtext?: string;
}

interface Activity {
  id: string;
  type: "member_joined" | "event_rsvp" | "post_liked";
  icon: React.ReactNode;
  message: string;
  timestamp: string;
  highlightedText?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attending: number;
  status: "published" | "draft";
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  activity: string;
}

interface HostDashboardProps {
  arcadeId: string;
  arcadeName?: string;
  city?: string;
}

export default function HostDashboard({ arcadeId, arcadeName = "Central Square Arcade", city = "Boston, MA" }: HostDashboardProps) {
  const [hostName, setHostName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profiles");
        if (res.ok) {
          const data = await res.json();
          if (data.profile && data.profile.name) {
            setHostName(data.profile.name);
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const [stats] = useState<StatCard[]>([
    {
      id: "1",
      icon: <UserPlus className="w-5 h-5 text-neutral-600" />,
      value: 12,
      label: "New members",
      period: "This week",
      change: "+18% from last week",
    },
    {
      id: "2",
      icon: <Calendar className="w-4 h-4 text-neutral-600" />,
      value: 3,
      label: "Upcoming events",
      period: "Next 7 days",
      subtext: "Community Garden Cleanup tomorrow",
    },
    {
      id: "3",
      icon: <MessageSquare className="w-4 h-4 text-neutral-600" />,
      value: 8,
      label: "Posts published",
      period: "This month",
      subtext: "Sustainability posts trending",
    },
    {
      id: "4",
      icon: <Link2 className="w-5 h-5 text-neutral-600" />,
      value: 2,
      label: "Collaborations",
      period: "Active",
      subtext: "Climate Action & Local Food",
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "member_joined",
      icon: <UserPlus className="w-3 h-3 text-neutral-600" />,
      message: "joined your Arcade",
      highlightedText: "Maya Chen",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "event_rsvp",
      icon: <Users className="w-3 h-3 text-neutral-600" />,
      message: "people RSVP'd to",
      highlightedText: "Community Garden Cleanup",
      timestamp: "4 hours ago",
      // Note: The design shows "15 people" but we'll use dynamic text
    },
    {
      id: "3",
      type: "post_liked",
      icon: <TrendingUp className="w-3 h-3 text-neutral-600" />,
      message: "Your post about got 23 likes",
      highlightedText: "Local Food Systems",
      timestamp: "Yesterday",
    },
  ]);

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Community Garden Cleanup",
      date: "Tomorrow, 9:00 AM",
      time: "9:00 AM",
      location: "Community Garden",
      attending: 15,
      status: "published",
    },
    {
      id: "2",
      title: "Sustainable Living Workshop",
      date: "March 15, 7:00 PM",
      time: "7:00 PM",
      location: "Community Center",
      attending: 0,
      status: "draft",
    },
  ]);

  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      role: "host",
      activity: "Hosted 3 events this month",
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "member",
      activity: "Top contributor in discussions",
    },
    {
      id: "3",
      name: "Jordan Taylor",
      role: "member",
      activity: "New member, high engagement",
    },
  ]);

  return (
    <ArcadeDashboardLayout arcadeId={arcadeId} arcadeName={arcadeName} city={city}>
      <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
              Welcome back, {loading ? "..." : hostName || "Teijas"}
            </h2>
            <p className="text-neutral-600">Here's your Arcade at a glance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          {/* Location & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Location Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Your Arcade Location</h3>
              <div className="bg-neutral-200 rounded-lg h-32 mb-4 flex items-center justify-center">
                <p className="text-neutral-500">Central Square Map View</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">B</span>
                </div>
                <div>
                  <p className="text-base font-medium text-neutral-800">{city}</p>
                  <p className="text-sm text-neutral-500">Central Square District</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Recent Activity</h3>
                <button className="text-sm text-neutral-500 hover:text-neutral-700">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} count={index === 1 ? 15 : undefined} />
                ))}
              </div>
            </div>
          </div>

          {/* Events & Members */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Upcoming Events</h3>
                <button className="text-sm text-neutral-500 hover:text-neutral-700">
                  Manage all
                </button>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Active Members</h3>
                <button className="text-sm text-neutral-500 hover:text-neutral-700">
                  View directory
                </button>
              </div>
              <div className="space-y-4 mb-4">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <p className="text-sm text-neutral-600 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Your community is most active on Thursday evenings
                </p>
              </div>
            </div>
          </div>
        </div>
      </ArcadeDashboardLayout>
  );
}

// Subcomponent: Stat Card
function StatCard({ stat }: { stat: StatCard }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
          {stat.icon}
        </div>
        <span className="text-xs text-neutral-500">{stat.period}</span>
      </div>
      <p className="text-2xl font-semibold text-neutral-800 mb-1">{stat.value}</p>
      <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
      {stat.change && (
        <p className="text-xs text-neutral-600">{stat.change}</p>
      )}
      {stat.subtext && (
        <p className="text-xs text-neutral-500 mt-1">{stat.subtext}</p>
      )}
    </div>
  );
}

// Subcomponent: Activity Item
function ActivityItem({ activity, count }: { activity: Activity; count?: number }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-800">
          {activity.highlightedText && (
            <span className="font-semibold">{activity.highlightedText}</span>
          )}
          {count !== undefined && <span className="font-semibold">{count} </span>}
          {activity.message}
          {activity.highlightedText && activity.type === "post_liked" && (
            <span className="font-semibold"> {activity.highlightedText}</span>
          )}
        </p>
        <p className="text-xs text-neutral-500 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}

// Subcomponent: Event Card
function EventCard({ event }: { event: Event }) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-medium text-neutral-800">{event.title}</h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === "published"
              ? "bg-neutral-100 text-neutral-700"
              : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {event.status === "published" ? "Published" : "Draft"}
        </span>
      </div>
      <p className="text-sm text-neutral-600 mb-3">{event.date}</p>
      <div className="flex items-center space-x-4 text-sm text-neutral-500">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{event.attending} attending</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Member Card
function MemberCard({ member }: { member: Member }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-neutral-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-neutral-800">{member.name}</p>
          <p className="text-sm text-neutral-500">{member.activity}</p>
        </div>
      </div>
      <button className="text-neutral-600 hover:text-neutral-900 p-2">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

