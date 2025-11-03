"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  User,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  Globe,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  host: {
    name: string;
    avatarUrl?: string;
  };
  status: "open" | "limited" | "workshop";
  spotsLeft?: number;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  postedAt: string;
  location: string;
  likes: number;
  comments: number;
}

interface Instructor {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface ConnectedCommunity {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export default function LocalArcadePage() {
  const [arcadeName] = useState("London Yoga Collective");
  const [hostedBy] = useState("Latika Yoga Studio");
  const [arcadeDescription] = useState(
    "Empowering mothers, teachers, and seekers through weekly sessions across the city"
  );
  const [city] = useState("London");
  const [tags] = useState(["#wellbeing", "#prenatal", "#mindfulmovement", "#community"]);

  const [stats] = useState({
    members: 532,
    weeklySessions: 12,
    locations: 8,
    founded: 2022,
  });

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Gentle Flow for Beginners",
      description: "Perfect for those new to yoga or returning after a break",
      date: "Wed, Jan 15",
      time: "7:00 PM",
      location: "Primrose Hill Park",
      host: {
        name: "Sarah Chen",
        avatarUrl: undefined,
      },
      status: "open",
    },
    {
      id: "2",
      title: "Prenatal Yoga Circle",
      description: "Supporting expecting mothers through gentle movement",
      date: "Fri, Jan 17",
      time: "6:30 PM",
      location: "Clapham Common",
      host: {
        name: "Emma Wilson",
        avatarUrl: undefined,
      },
      status: "limited",
      spotsLeft: 3,
    },
    {
      id: "3",
      title: "Mindfulness & Meditation",
      description: "90-minute deep dive into meditation practices",
      date: "Sun, Jan 19",
      time: "9:00 AM",
      location: "Hampstead Heath",
      host: {
        name: "Marcus Kumar",
        avatarUrl: undefined,
      },
      status: "workshop",
    },
  ]);

  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Jessica Martinez",
        avatarUrl: undefined,
      },
      content:
        "Today's session in Regent's Park was exactly what I needed. There's something magical about practicing with this group — we've become more than just yoga partners, we're a real support system. 🧘‍♀️✨",
      imageUrl: undefined,
      imageCaption: "Group photo after morning session",
      postedAt: "2 days ago",
      location: "London",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      author: {
        name: "Sarah Chen",
        avatarUrl: undefined,
      },
      content:
        "Reminder: Our prenatal yoga series starts next week! We'll be covering gentle flows, breathing techniques, and connecting with other expecting mothers. All experience levels welcome. 💕",
      postedAt: "4 days ago",
      location: "London",
      likes: 18,
      comments: 12,
    },
  ]);

  const [instructors] = useState<Instructor[]>([
    {
      id: "1",
      name: "Sarah Chen",
      role: "Founder",
      avatarUrl: undefined,
    },
    {
      id: "2",
      name: "Emma Wilson",
      role: "Prenatal Specialist",
      avatarUrl: undefined,
    },
    {
      id: "3",
      name: "Marcus Kumar",
      role: "Meditation Guide",
      avatarUrl: undefined,
    },
    {
      id: "4",
      name: "Lisa Thompson",
      role: "Vinyasa Teacher",
      avatarUrl: undefined,
    },
  ]);

  const [connectedCommunities] = useState<ConnectedCommunity[]>([
    {
      id: "1",
      name: "Global Wellbeing Network",
      subtitle: "Connected to yoga communities worldwide",
      description:
        "Share experiences and learn from yoga practitioners across different cultures and traditions.",
      icon: <Globe className="w-4 h-4 text-white" />,
    },
    {
      id: "2",
      name: "London Wellness Hub",
      subtitle: "Local health & wellness initiatives",
      description:
        "Connect with other London-based wellness communities including meditation groups and fitness clubs.",
      icon: <Users className="w-4 h-4 text-white" />,
    },
  ]);

  const [relatedArcades] = useState([
    "Tech Startups Collective",
    "Sustainable Living Network",
    "Creative Arts Community",
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${city.toLowerCase()}`}
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Back to {city} Square</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-700">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-400/80 via-neutral-500/80 to-neutral-700/80"></div>
        
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-xl font-medium">Community yoga session in Hyde Park</p>
        </div>

        {/* Arcade Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">LYC</span>
              </div>
              <p className="text-white/90 text-sm">Hosted by {hostedBy}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{arcadeName}</h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl">{arcadeDescription}</p>
            <div className="flex items-center space-x-4">
              <button className="bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
                Join Arcade
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
                Stay Updated
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* About Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">About Our Community</h2>
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <p>
                  Started in 2022 by Sarah Chen, a prenatal yoga instructor, our collective began
                  with just five mothers meeting in Regent's Park. Today, we've grown into a vibrant
                  community that supports wellness journeys across all life stages.
                </p>
                <p>
                  We believe yoga is for everyone — whether you're a complete beginner, returning
                  after pregnancy, or seeking deeper mindfulness practices. Our sessions blend
                  traditional techniques with modern accessibility.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">Community Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Members</span>
                  <span className="text-neutral-900 font-semibold">{stats.members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Weekly Sessions</span>
                  <span className="text-neutral-900 font-semibold">{stats.weeklySessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Locations</span>
                  <span className="text-neutral-900 font-semibold">{stats.locations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Founded</span>
                  <span className="text-neutral-900 font-semibold">{stats.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events & Classes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-neutral-900">Upcoming Events & Classes</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-neutral-600" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Community Stories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Community Stories</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Our Community */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-neutral-900">Our Community</h2>
            <button className="text-neutral-600 hover:text-neutral-900 flex items-center text-sm font-medium">
              View All
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Instructors & Hosts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Instructors & Hosts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    {instructor.avatarUrl ? (
                      <Image
                        src={instructor.avatarUrl}
                        alt={instructor.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-neutral-500" />
                    )}
                  </div>
                  <p className="font-medium text-neutral-900 mb-1">{instructor.name}</p>
                  <p className="text-sm text-neutral-600">{instructor.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Members */}
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Active Members</h3>
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center border-2 border-white"
                >
                  {i === 10 ? (
                    <span className="text-xs text-neutral-600 font-medium">+520</span>
                  ) : (
                    <User className="w-6 h-6 text-neutral-500" />
                  )}
                </div>
              ))}
            </div>
            <button className="text-neutral-600 hover:text-neutral-900 flex items-center text-sm font-medium">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite a Friend
            </button>
          </div>
        </section>

        {/* Connected Communities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Connected Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectedCommunities.map((community) => (
              <ConnectedCommunityCard key={community.id} community={community} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Explore More {city} Arcades
              </h3>
              <div className="flex flex-wrap gap-4">
                {relatedArcades.map((arcade) => (
                  <Link
                    key={arcade}
                    href="#"
                    className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors"
                  >
                    {arcade}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${city.toLowerCase()}`}
                className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors text-center"
              >
                Back to {city} Square
              </Link>
              <Link
                href="/global"
                className="bg-white border border-neutral-300 text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-center"
              >
                Global Agora
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponent: Event Card
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">{event.date}</p>
          <p className="text-sm text-neutral-600">{event.time}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === "open"
              ? "bg-green-100 text-green-800"
              : event.status === "limited"
              ? "bg-orange-100 text-orange-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {event.status === "open"
            ? "Open"
            : event.status === "limited"
            ? `${event.spotsLeft} spots left`
            : "Workshop"}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{event.title}</h3>
      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
      <div className="flex items-center text-sm text-neutral-600 mb-4">
        <MapPin className="w-4 h-4 mr-2" />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
            {event.host.avatarUrl ? (
              <Image
                src={event.host.avatarUrl}
                alt={event.host.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <User className="w-3 h-3 text-neutral-500" />
            )}
          </div>
          <span className="text-sm text-neutral-700">{event.host.name}</span>
        </div>
        <button className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
          RSVP
        </button>
      </div>
    </div>
  );
}

// Subcomponent: Post Card
function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-neutral-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-neutral-900">{post.author.name}</p>
          <p className="text-sm text-neutral-600">
            {post.postedAt} • {post.location}
          </p>
        </div>
      </div>
      <p className="text-neutral-700 mb-4 leading-relaxed">{post.content}</p>
      {post.imageUrl && (
        <div className="mb-4">
          <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
            {post.imageCaption && (
              <p className="text-neutral-500 text-sm">{post.imageCaption}</p>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
}

// Subcomponent: Connected Community Card
function ConnectedCommunityCard({ community }: { community: ConnectedCommunity }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
          {community.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">{community.name}</h3>
          <p className="text-sm text-neutral-600">{community.subtitle}</p>
        </div>
      </div>
      <p className="text-neutral-700 mb-4 leading-relaxed">{community.description}</p>
      <button className="text-neutral-900 hover:text-neutral-700 font-medium text-sm flex items-center">
        Explore Network <ChevronRightIcon className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}

