"use client";

import {
  MessageCircle,
  MapPin,
  Heart,
} from "lucide-react";

interface FeedPost {
  id: string;
  author: {
    name: string;
    city: string;
    avatarUrl?: string;
  };
  title: string;
  content: string;
  tags: string[];
  replies: number;
  citiesInvolved: number;
  appreciations: number;
}

interface TrendingTag {
  tag: string;
  discussions: number;
}

interface ArcadeHighlight {
  id: string;
  title: string;
  description: string;
}

interface ActiveCity {
  id: string;
  name: string;
  avatarUrl?: string;
}

export default function GlobalFeed() {
  // Mock data - replace with API calls
  const posts: FeedPost[] = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        city: "London",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
      },
      title: "How can cities collaborate on climate resilience?",
      content:
        "Cities worldwide are facing unprecedented climate challenges. From flooding in Venice to heatwaves in Delhi, we need innovative cross-border solutions. What if we created a global network for sharing climate adaptation strategies?",
      tags: ["Climate", "Cities"],
      replies: 23,
      citiesInvolved: 8,
      appreciations: 47,
    },
    {
      id: "2",
      author: {
        name: "Marcus Rodriguez",
        city: "Boston",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus",
      },
      title: "The future of AI governance in democratic societies",
      content:
        "As AI becomes more integrated into our daily lives, how do we ensure democratic oversight? Looking at different approaches from Nordic countries to Asian democracies...",
      tags: ["AI", "Democracy"],
      replies: 31,
      citiesInvolved: 12,
      appreciations: 62,
    },
    {
      id: "3",
      author: {
        name: "Ingrid Larsson",
        city: "Oslo",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Ingrid",
      },
      title: "Reimagining education for the global citizen",
      content: `Traditional education systems weren't designed for our interconnected world. How can we prepare students to think globally while acting locally? Sharing insights from Nordic education reforms...`,
      tags: ["Education", "Future"],
      replies: 18,
      citiesInvolved: 6,
      appreciations: 34,
    },
  ];

  const trendingTags: TrendingTag[] = [
    { tag: "Climate", discussions: 142 },
    { tag: "AI", discussions: 89 },
    { tag: "Democracy", discussions: 67 },
    { tag: "Education", discussions: 54 },
  ];

  const arcadeHighlights: ArcadeHighlight[] = [
    {
      id: "1",
      title: "Boston Yoga Collective x Global Wellness",
      description: "Mindfulness practices across cultures",
    },
    {
      id: "2",
      title: "London Tech Hub x Innovation Forum",
      description: "Ethical AI development frameworks",
    },
    {
      id: "3",
      title: "Oslo Sustainability Circle",
      description: "Zero-waste city initiatives",
    },
  ];

  const activeCities: ActiveCity[] = [
    { id: "1", name: "London", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=London" },
    { id: "2", name: "Boston", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Boston" },
    { id: "3", name: "Oslo", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Oslo" },
    { id: "4", name: "Hyderabad", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Hyderabad" },
    { id: "5", name: "Tokyo", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Tokyo" },
    { id: "6", name: "Berlin", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Berlin" },
    { id: "7", name: "Sydney", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Sydney" },
    { id: "8", name: "Toronto", avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Toronto" },
  ];

  const userAvatarUrl = "https://api.dicebear.com/7.x/notionists/svg?seed=User";

  return (
    <div className="space-y-8">
      {/* Hero Heading */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          The Global Agora Feed
        </h2>
        <p className="text-base text-neutral-500">
          Join dialogues from across the world's Squares
        </p>
      </div>

      {/* Feed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compose Post */}
          <article className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={userAvatarUrl}
                alt="Your avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 space-y-4">
                <textarea
                  className="w-full min-h-[106px] p-4 border border-neutral-200 rounded-lg text-base text-neutral-900 placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                  placeholder="Share a thought with the world..."
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-neutral-500">Add tags:</span>
                    <button className="px-4 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-700 hover:bg-neutral-200 transition-colors">
                      #Climate
                    </button>
                    <button className="px-4 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-700 hover:bg-neutral-200 transition-colors">
                      #AI
                    </button>
                    <button className="px-4 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-700 hover:bg-neutral-200 transition-colors">
                      #Democracy
                    </button>
                    <button className="px-4 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-700 hover:bg-neutral-200 transition-colors">
                      #Education
                    </button>
                  </div>
                  <button className="px-6 py-2 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-900 transition-colors">
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
              className="bg-white border border-neutral-200 rounded-lg p-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.author.avatarUrl || userAvatarUrl}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-neutral-900">
                      {post.author.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-xs text-neutral-800">
                      {post.author.city}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-800">
                    {post.title}
                  </h4>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-neutral-100 rounded-full text-xs text-neutral-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-neutral-500 pt-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies} Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{post.citiesInvolved} Cities involved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{post.appreciations} Appreciations</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Trending Conversations */}
          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              Trending Conversations
            </h3>
            <div className="space-y-4">
              {trendingTags.map((item) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between"
                >
                  <button className="px-4 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-800 hover:bg-neutral-200 transition-colors">
                    #{item.tag}
                  </button>
                  <span className="text-sm text-neutral-500">
                    {item.discussions} discussions
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* From the Arcades */}
          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              From the Arcades
            </h3>
            <div className="space-y-4">
              {arcadeHighlights.map((arcade) => (
                <div
                  key={arcade.id}
                  className="bg-neutral-50 rounded-lg p-3 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <h4 className="text-sm font-medium text-neutral-800 mb-1">
                    {arcade.title}
                  </h4>
                  <p className="text-xs text-neutral-600">{arcade.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cities Active Now */}
          <section className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              Cities Active Now
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {activeCities.map((city) => (
                <div
                  key={city.id}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={city.avatarUrl || userAvatarUrl}
                        alt={city.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-neutral-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-xs text-neutral-600 text-center">
                    {city.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}