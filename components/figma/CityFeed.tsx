"use client";

import {
  MessageCircle,
  MapPin,
  Heart,
  Calendar,
  CalendarCheck,
  Sparkles,
  Star,
  Clock,
} from "lucide-react";

interface CityFeedProps {
  city?: string;
}

interface FeedPost {
  id: string;
  author: {
    name: string;
    neighborhood: string;
    avatarUrl?: string;
  };
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  timeAgo: string;
  comments: number;
  type?: "event";
  eventDetails?: {
    title: string;
    description: string;
    when: string;
    where: string;
    cost: string;
  };
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  location: string;
}

interface ArcadeHighlight {
  id: string;
  name: string;
  quote: string;
}

interface LocalLeader {
  id: string;
  name: string;
  achievement: string;
  avatarUrl?: string;
}

export default function CityFeed({ city = "Boston" }: CityFeedProps) {
  // Mock data - replace with API calls
  const posts: FeedPost[] = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        neighborhood: "Cambridge",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
      },
      content:
        "Just organized our first community garden cleanup at Porter Square! 🌱 Amazing turnout - 23 neighbors showed up. Next session is this Saturday 9am. Who's in?",
      imageUrl: "https://via.placeholder.com/814x192",
      imageCaption: "Community Garden Cleanup Photo",
      timeAgo: "2 hours ago",
      comments: 12,
    },
    {
      id: "2",
      author: {
        name: "Marcus Williams",
        neighborhood: "South End",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus",
      },
      content:
        "The new bike lanes on Washington Street are a game changer! Commute time cut in half. Has anyone else noticed improved traffic flow? Would love to see this model expanded to Columbus Ave.",
      timeAgo: "4 hours ago",
      comments: 8,
    },
    {
      id: "3",
      author: {
        name: "Elena Rodriguez",
        neighborhood: "Roxbury",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Elena",
      },
      type: "event",
      content: "Excited to share this upcoming community event!",
      eventDetails: {
        title: "Roxbury Community Tech Workshop",
        description:
          "Free coding workshop for teens and adults. Learn HTML, CSS, and basic web development. No experience needed! Laptops provided.",
        when: "Saturday, November 9th, 2-5 PM",
        where: "Roxbury Community Center",
        cost: "Free",
      },
      timeAgo: "6 hours ago",
      comments: 5,
    },
    {
      id: "4",
      author: {
        name: "David Park",
        neighborhood: "Back Bay",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=David",
      },
      content:
        "Question for fellow parents: Anyone know good after-school programs in the area? My 8-year-old is interested in art and music. Looking for something within walking distance of Copley.",
      timeAgo: "1 day ago",
      comments: 15,
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: "1",
      title: "Farmers Market",
      time: "Saturday 8am",
      location: "Copley Square",
    },
    {
      id: "2",
      title: "Community Cleanup",
      time: "Sunday 10am",
      location: "Charles River",
    },
    {
      id: "3",
      title: "Town Hall Meeting",
      time: "Monday 7pm",
      location: "City Hall",
    },
  ];

  const arcadeHighlights: ArcadeHighlight[] = [
    {
      id: "1",
      name: "Yoga Collective",
      quote: '"New morning sessions starting next week!"',
    },
    {
      id: "2",
      name: "Tech Makerspace",
      quote: '"3D printer workshop was amazing. Next: Arduino basics!"',
    },
    {
      id: "3",
      name: "Book Club",
      quote: '"This month: local authors spotlight."',
    },
  ];

  const localLeaders: LocalLeader[] = [
    {
      id: "1",
      name: "Maria Santos",
      achievement: "Organized 5 cleanups this month",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Maria",
    },
    {
      id: "2",
      name: "James Liu",
      achievement: "Leading bike safety initiative",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=James",
    },
    {
      id: "3",
      name: "Aisha Johnson",
      achievement: "Youth mentorship program",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Aisha",
    },
  ];

  const userAvatarUrl = "https://api.dicebear.com/7.x/notionists/svg?seed=User";

  return (
    <div className="space-y-8">
      {/* Hero Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Meet neighbours and organisers solving for {city}'s future
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Connect with your community, share local insights, and build the city we all want to live in
        </p>
      </div>

      {/* Feed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compose Post */}
          <article className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <img
                src={userAvatarUrl}
                alt="Your avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 space-y-4">
                <textarea
                  className="w-full min-h-[58px] p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-base text-neutral-500 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                  placeholder={`Start a discussion about ${city}...`}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-black hover:bg-neutral-50 transition-colors flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Event
                    </button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-black hover:bg-neutral-50 transition-colors flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Idea
                    </button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-black hover:bg-neutral-50 transition-colors flex items-center gap-2">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Question
                    </button>
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-black hover:bg-neutral-50 transition-colors flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Update
                    </button>
                  </div>
                  <button className="px-6 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Feed Posts */}
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-neutral-200 rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.author.avatarUrl || userAvatarUrl}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-neutral-900">
                      {post.author.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-xs text-neutral-800">
                      {post.author.neighborhood}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {post.timeAgo}
                    </span>
                  </div>

                  {post.type === "event" && post.eventDetails && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <CalendarCheck className="w-4 h-4" />
                        <span className="font-medium">UPCOMING EVENT</span>
                      </div>
                      <h4 className="text-base font-semibold text-neutral-900">
                        {post.eventDetails.title}
                      </h4>
                      <p className="text-base text-neutral-800">
                        {post.eventDetails.description}
                      </p>
                      <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
                        <div className="text-sm text-neutral-600">
                          <span className="font-bold">When:</span>{" "}
                          {post.eventDetails.when}
                        </div>
                        <div className="text-sm text-neutral-600">
                          <span className="font-bold">Where:</span>{" "}
                          {post.eventDetails.where}
                        </div>
                        <div className="text-sm text-neutral-600">
                          <span className="font-bold">Cost:</span>{" "}
                          {post.eventDetails.cost}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments} Comments
                        </button>
                        <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
                          <Heart className="w-4 h-4" />
                          Volunteer
                        </button>
                        <button className="px-6 py-2 bg-neutral-600 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4" />
                          Join Local Meet
                        </button>
                      </div>
                    </>
                  )}

                  {post.type !== "event" && (
                    <>
                      <p className="text-base text-neutral-800 leading-relaxed">
                        {post.content}
                      </p>
                      {post.imageUrl && (
                        <div className="relative w-full h-48 bg-neutral-300 rounded-lg overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.imageCaption || "Post image"}
                            className="w-full h-full object-cover"
                          />
                          {post.imageCaption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-3">
                              {post.imageCaption}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-neutral-600 pt-2">
                        <button className="flex items-center gap-2 hover:text-neutral-900">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments} Comments
                        </button>
                        <button className="flex items-center gap-2 hover:text-neutral-900">
                          <Heart className="w-4 h-4" />
                          Volunteer
                        </button>
                        <button className="flex items-center gap-2 hover:text-neutral-900">
                          <CalendarCheck className="w-4 h-4" />
                          Attend
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Upcoming Local Events */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarCheck className="w-4 h-4 text-neutral-900" />
              <h3 className="text-base font-semibold text-neutral-900">
                Upcoming Local Events
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-l-4 border-neutral-500 pl-4 py-1"
                >
                  <h4 className="text-sm font-medium text-neutral-900">
                    {event.title}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    {event.time} • {event.location}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-neutral-600 hover:text-neutral-900 w-full text-center">
              View all events
            </button>
          </section>

          {/* Arcade Highlights */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-neutral-900" />
              <h3 className="text-base font-semibold text-neutral-900">
                Arcade Highlights
              </h3>
            </div>
            <div className="space-y-4">
              {arcadeHighlights.map((arcade) => (
                <div
                  key={arcade.id}
                  className="bg-neutral-50 rounded-lg p-3 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <h4 className="text-sm font-medium text-neutral-900 mb-1">
                    {arcade.name}
                  </h4>
                  <p className="text-xs text-neutral-600">{arcade.quote}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Local Leaders of the Week */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-neutral-900" />
              <h3 className="text-base font-semibold text-neutral-900">
                Local Leaders of the Week
              </h3>
            </div>
            <div className="space-y-4">
              {localLeaders.map((leader) => (
                <div key={leader.id} className="flex items-start gap-3">
                  <img
                    src={leader.avatarUrl || userAvatarUrl}
                    alt={leader.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {leader.name}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      {leader.achievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}