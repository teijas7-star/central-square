// ============= SHARED TYPES =============

export interface HealthMetric {
  label: string;
  value: number;
  trend: number;
  color: string;
}

export interface EngagementDay {
  day: string;
  week: number;
  value: number;
  events: number;
  posts: number;
}

export interface AtRiskMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastActive: string;
  churnProbability: number;
  engagementTrend: number[];
  riskFactors: string[];
}

export interface BenchmarkMetric {
  label: string;
  yourValue: number;
  avgValue: number;
  topValue: number;
  unit: string;
}

export interface ActivityPoint {
  month: string;
  members: number;
  posts: number;
  events: number;
}

export interface FunnelStep {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface SponsorBrand {
  id: string;
  name: string;
  emoji: string;
  tier: "platinum" | "gold" | "silver";
  totalROI: number;
  impressions: number;
  engagements: number;
  conversions: number;
  revenue: number;
}

export interface CampaignMetric {
  name: string;
  sponsor: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: "active" | "completed";
}

export interface RevenueSegment {
  label: string;
  value: number;
  percentage: number;
}

export interface TrendingTopic {
  id: string;
  label: string;
  volume: number;
  sentiment: number;
  velocity: number;
  category: string;
}

export interface SentimentPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  overall: number;
}

export interface CrossCommunityTrend {
  topic: string;
  communities: { name: string; volume: number; sentiment: number }[];
}

export interface TopicCluster {
  id: string;
  label: string;
  size: number;
  x: number;
  y: number;
  connections: string[];
}

// ============= OPERATOR INTELLIGENCE DATA =============

export const operatorData = {
  healthScore: 87,
  healthTrend: 12,

  healthBreakdown: [
    { label: "Engagement", value: 92, trend: 8, color: "var(--cs-success)" },
    { label: "Retention", value: 85, trend: 3, color: "var(--gold)" },
    { label: "Growth", value: 78, trend: 15, color: "var(--burg-300)" },
    { label: "Content", value: 91, trend: 5, color: "var(--cream)" },
  ] as HealthMetric[],

  engagementGrid: (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const grid: EngagementDay[] = [];
    const values = [
      [65, 72, 58, 80, 85, 45, 30],
      [70, 68, 75, 82, 78, 50, 35],
      [60, 74, 80, 88, 90, 55, 40],
      [75, 82, 85, 92, 95, 60, 42],
    ];
    for (let week = 0; week < 4; week++) {
      for (let d = 0; d < 7; d++) {
        grid.push({
          day: days[d],
          week,
          value: values[week][d],
          events: Math.floor(values[week][d] / 20),
          posts: Math.floor(values[week][d] / 8),
        });
      }
    }
    return grid;
  })(),

  atRiskMembers: [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "SC",
      role: "Designer",
      lastActive: "12 days ago",
      churnProbability: 78,
      engagementTrend: [80, 65, 50, 40, 30, 20, 15],
      riskFactors: ["Missed 3 events", "No posts in 2 weeks"],
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      avatar: "MR",
      role: "Developer",
      lastActive: "8 days ago",
      churnProbability: 65,
      engagementTrend: [90, 85, 70, 55, 40, 35, 30],
      riskFactors: ["Stopped reacting", "Missed last meetup"],
    },
    {
      id: "3",
      name: "Priya Patel",
      avatar: "PP",
      role: "PM",
      lastActive: "15 days ago",
      churnProbability: 82,
      engagementTrend: [75, 60, 45, 30, 20, 10, 8],
      riskFactors: ["No activity in 2 weeks", "Left 2 channels"],
    },
    {
      id: "4",
      name: "James Wilson",
      avatar: "JW",
      role: "Founder",
      lastActive: "6 days ago",
      churnProbability: 45,
      engagementTrend: [95, 90, 80, 70, 65, 55, 50],
      riskFactors: ["Declining engagement trend"],
    },
    {
      id: "5",
      name: "Aisha Khan",
      avatar: "AK",
      role: "Designer",
      lastActive: "10 days ago",
      churnProbability: 71,
      engagementTrend: [70, 55, 45, 35, 25, 20, 18],
      riskFactors: ["Missed 4 events", "No DMs in 3 weeks"],
    },
  ] as AtRiskMember[],

  benchmarks: [
    { label: "Monthly Active Rate", yourValue: 87, avgValue: 62, topValue: 94, unit: "%" },
    { label: "Event Attendance", yourValue: 73, avgValue: 45, topValue: 88, unit: "%" },
    { label: "Post Frequency", yourValue: 4.2, avgValue: 2.1, topValue: 6.8, unit: "/wk" },
    { label: "Member Growth", yourValue: 18, avgValue: 8, topValue: 25, unit: "%/mo" },
    { label: "Avg Session Time", yourValue: 12, avgValue: 6, topValue: 18, unit: "min" },
  ] as BenchmarkMetric[],

  activityTrend: [
    { month: "Sep", members: 82, posts: 156, events: 4 },
    { month: "Oct", members: 98, posts: 189, events: 5 },
    { month: "Nov", members: 115, posts: 210, events: 7 },
    { month: "Dec", members: 140, posts: 245, events: 6 },
    { month: "Jan", members: 178, posts: 290, events: 8 },
    { month: "Feb", members: 214, posts: 342, events: 9 },
  ] as ActivityPoint[],

  summaryStats: {
    totalMembers: { value: 214, trend: 18, label: "Total Members", prefix: "" },
    weeklyActive: { value: 156, trend: 12, label: "Weekly Active", prefix: "" },
    totalPosts: { value: 1247, trend: 24, label: "Total Posts", prefix: "" },
    engagementRate: { value: 87, trend: 3, label: "Engagement Rate", suffix: "%" },
  },
};

// ============= SPONSOR INTELLIGENCE DATA =============

export const sponsorData = {
  funnel: [
    { label: "Awareness", value: 12400, percentage: 100, color: "var(--burg-400)" },
    { label: "Attendance", value: 3200, percentage: 25.8, color: "var(--burg-300)" },
    { label: "Discussion", value: 1800, percentage: 14.5, color: "var(--gold)" },
    { label: "Consideration", value: 680, percentage: 5.5, color: "var(--cream)" },
    { label: "Purchase", value: 240, percentage: 1.9, color: "var(--cs-success)" },
  ] as FunnelStep[],

  brands: [
    {
      id: "1",
      name: "Figma",
      emoji: "\u{1F3A8}",
      tier: "platinum" as const,
      totalROI: 5.2,
      impressions: 8400,
      engagements: 2100,
      conversions: 145,
      revenue: 28000,
    },
    {
      id: "2",
      name: "Notion",
      emoji: "\u{1F4DD}",
      tier: "gold" as const,
      totalROI: 3.8,
      impressions: 6200,
      engagements: 1500,
      conversions: 89,
      revenue: 18500,
    },
    {
      id: "3",
      name: "Linear",
      emoji: "\u{26A1}",
      tier: "gold" as const,
      totalROI: 4.1,
      impressions: 5800,
      engagements: 1350,
      conversions: 102,
      revenue: 21000,
    },
    {
      id: "4",
      name: "Vercel",
      emoji: "\u{25B2}",
      tier: "silver" as const,
      totalROI: 2.9,
      impressions: 4100,
      engagements: 890,
      conversions: 56,
      revenue: 12500,
    },
  ] as SponsorBrand[],

  campaigns: [
    { name: "Design Systems Workshop", sponsor: "Figma", impressions: 3200, clicks: 890, conversions: 67, revenue: 12400, status: "completed" as const },
    { name: "Productivity Stack Talk", sponsor: "Notion", impressions: 2800, clicks: 720, conversions: 45, revenue: 8900, status: "completed" as const },
    { name: "Ship Week Sprint", sponsor: "Linear", impressions: 2400, clicks: 650, conversions: 52, revenue: 10200, status: "active" as const },
    { name: "Deploy & Demo Night", sponsor: "Vercel", impressions: 2100, clicks: 480, conversions: 34, revenue: 7800, status: "active" as const },
    { name: "Portfolio Review", sponsor: "Figma", impressions: 1800, clicks: 520, conversions: 41, revenue: 8600, status: "completed" as const },
  ] as CampaignMetric[],

  revenueBreakdown: [
    { label: "Event Sponsorship", value: 45000, percentage: 42 },
    { label: "Content Partnership", value: 28000, percentage: 26 },
    { label: "Member Perks", value: 18000, percentage: 17 },
    { label: "Data Licensing", value: 16000, percentage: 15 },
  ] as RevenueSegment[],

  summaryStats: {
    totalRevenue: { value: 107, trend: 34, label: "Total Revenue", prefix: "$", suffix: "K" },
    avgROI: { value: 4.2, trend: 0.8, label: "Avg ROI", suffix: "x" },
    activeSponsors: { value: 4, trend: 2, label: "Active Sponsors", prefix: "" },
    conversionRate: { value: 1.9, trend: 0.4, label: "Conversion Rate", suffix: "%" },
  },
};

// ============= DISCOURSE INTELLIGENCE DATA =============

export const discourseData = {
  trendingTopics: [
    { id: "1", label: "AI Design Tools", volume: 9, sentiment: 0.7, velocity: 85, category: "Technology" },
    { id: "2", label: "Remote Work", volume: 7, sentiment: 0.3, velocity: 20, category: "Culture" },
    { id: "3", label: "Design Systems", volume: 8, sentiment: 0.8, velocity: 45, category: "Design" },
    { id: "4", label: "Figma Updates", volume: 6, sentiment: 0.6, velocity: 70, category: "Tools" },
    { id: "5", label: "Portfolio Tips", volume: 5, sentiment: 0.5, velocity: 30, category: "Career" },
    { id: "6", label: "Accessibility", volume: 7, sentiment: 0.9, velocity: 55, category: "Design" },
    { id: "7", label: "Startup Culture", volume: 4, sentiment: 0.2, velocity: 15, category: "Culture" },
    { id: "8", label: "Motion Design", volume: 6, sentiment: 0.7, velocity: 60, category: "Design" },
    { id: "9", label: "UX Research", volume: 5, sentiment: 0.6, velocity: 35, category: "Research" },
    { id: "10", label: "Salary Trends", volume: 8, sentiment: -0.1, velocity: 90, category: "Career" },
    { id: "11", label: "Design Tokens", volume: 4, sentiment: 0.8, velocity: 40, category: "Design" },
    { id: "12", label: "Freelancing", volume: 6, sentiment: 0.4, velocity: 25, category: "Career" },
    { id: "13", label: "AR/VR Design", volume: 3, sentiment: 0.5, velocity: 50, category: "Technology" },
    { id: "14", label: "Brand Identity", volume: 5, sentiment: 0.6, velocity: 20, category: "Design" },
    { id: "15", label: "Mentorship", volume: 7, sentiment: 0.9, velocity: 65, category: "Community" },
  ] as TrendingTopic[],

  sentimentTimeline: (() => {
    const data: SentimentPoint[] = [];
    const baseDate = new Date(2025, 1, 1);
    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      const noise = Math.sin(i * 0.5) * 0.15 + Math.cos(i * 0.3) * 0.1;
      const pos = 0.55 + noise + (i / 60);
      const neg = 0.25 - noise * 0.5 + Math.sin(i * 0.8) * 0.08;
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        positive: Math.max(0, Math.min(1, pos)),
        negative: Math.max(0, Math.min(1, neg)),
        neutral: Math.max(0, 1 - pos - neg),
        overall: pos - neg,
      });
    }
    return data;
  })(),

  crossCommunityTrends: [
    {
      topic: "AI Design Tools",
      communities: [
        { name: "Design Circle SF", volume: 89, sentiment: 0.7 },
        { name: "UX Research NYC", volume: 72, sentiment: 0.5 },
        { name: "Creative Tech LA", volume: 65, sentiment: 0.8 },
        { name: "Product Design London", volume: 58, sentiment: 0.6 },
      ],
    },
    {
      topic: "Design Systems",
      communities: [
        { name: "Design Circle SF", volume: 82, sentiment: 0.8 },
        { name: "Frontend Guild Berlin", volume: 76, sentiment: 0.7 },
        { name: "UX Research NYC", volume: 60, sentiment: 0.6 },
        { name: "Creative Tech LA", volume: 45, sentiment: 0.5 },
      ],
    },
    {
      topic: "Salary Trends",
      communities: [
        { name: "Design Circle SF", volume: 95, sentiment: -0.1 },
        { name: "Product Design London", volume: 88, sentiment: 0.0 },
        { name: "UX Research NYC", volume: 78, sentiment: -0.2 },
        { name: "Creative Tech LA", volume: 70, sentiment: 0.1 },
      ],
    },
  ] as CrossCommunityTrend[],

  topicClusters: [
    { id: "1", label: "AI Tools", size: 9, x: 35, y: 25, connections: ["3", "4", "8"] },
    { id: "2", label: "Remote Work", size: 7, x: 70, y: 60, connections: ["7", "12"] },
    { id: "3", label: "Design Systems", size: 8, x: 25, y: 55, connections: ["1", "6", "11"] },
    { id: "4", label: "Figma", size: 6, x: 55, y: 20, connections: ["1", "8"] },
    { id: "5", label: "Career", size: 5, x: 80, y: 35, connections: ["10", "12"] },
    { id: "6", label: "A11y", size: 7, x: 15, y: 75, connections: ["3", "9"] },
    { id: "7", label: "Startups", size: 4, x: 60, y: 75, connections: ["2", "10"] },
    { id: "8", label: "Motion", size: 6, x: 45, y: 40, connections: ["1", "4", "11"] },
    { id: "9", label: "UX Research", size: 5, x: 30, y: 85, connections: ["6", "14"] },
    { id: "10", label: "Salaries", size: 8, x: 85, y: 50, connections: ["5", "7"] },
  ] as TopicCluster[],

  summaryStats: {
    totalConversations: { value: 48.2, trend: 22, label: "Conversations", suffix: "K" },
    avgSentiment: { value: 0.65, trend: 0.08, label: "Avg Sentiment", prefix: "" },
    activeTopics: { value: 127, trend: 15, label: "Active Topics", prefix: "" },
  },
};

// ============= BOT COMMAND CENTER TYPES =============

export interface BotPlatformStatus {
  id: string;
  platform: "whatsapp" | "instagram" | "eventbrite";
  name: string;
  status: "live" | "paused" | "disconnected";
  membersReached: number;
  lastActivity: string;
  messagesSent: number;
  responsesReceived: number;
}

export interface BotPoll {
  id: string;
  question: string;
  platform: "whatsapp" | "instagram" | "eventbrite" | "all";
  sentAt: string;
  responseCount: number;
  totalReached: number;
  responseRate: number;
  results: { option: string; count: number; percentage: number }[];
  status: "active" | "completed";
}

export interface BotMemberIntelligence {
  id: string;
  name: string;
  avatar: string;
  source: "whatsapp" | "instagram" | "eventbrite";
  interests: string[];
  engagementScore: number;
  responsesGiven: number;
  lastInteraction: string;
  readyToOnboard: boolean;
}

export interface BotActivity {
  date: string;
  messagesSent: number;
  responsesReceived: number;
  pollsCreated: number;
}

// ============= BOT COMMAND CENTER DATA =============

export const botCommandData = {
  summaryStats: {
    activeBots: { value: 3, trend: 2, label: "Active Integrations" },
    questionsSent: { value: 47, trend: 12, label: "Questions Sent" },
    responsesCollected: { value: 312, trend: 34, label: "Responses" },
    avgResponseRate: { value: 87, trend: 5, label: "Response Rate" },
  },

  platformStatus: [
    {
      id: "wa-1",
      platform: "whatsapp" as const,
      name: "Design Circle SF Group",
      status: "live" as const,
      membersReached: 156,
      lastActivity: "2 min ago",
      messagesSent: 34,
      responsesReceived: 198,
    },
    {
      id: "ig-1",
      platform: "instagram" as const,
      name: "@designcirclesf",
      status: "live" as const,
      membersReached: 2400,
      lastActivity: "15 min ago",
      messagesSent: 8,
      responsesReceived: 67,
    },
    {
      id: "eb-1",
      platform: "eventbrite" as const,
      name: "Design Circle SF Events",
      status: "live" as const,
      membersReached: 890,
      lastActivity: "1 hour ago",
      messagesSent: 5,
      responsesReceived: 47,
    },
  ] as BotPlatformStatus[],

  recentPolls: [
    {
      id: "p1",
      question: "What type of events do you want this month?",
      platform: "whatsapp" as const,
      sentAt: "2 hours ago",
      responseCount: 89,
      totalReached: 156,
      responseRate: 57,
      results: [
        { option: "Workshop on AI tools", count: 34, percentage: 38 },
        { option: "Portfolio review night", count: 28, percentage: 31 },
        { option: "Networking mixer", count: 18, percentage: 20 },
        { option: "Design systems talk", count: 9, percentage: 10 },
      ],
      status: "completed" as const,
    },
    {
      id: "p2",
      question: "Best day of the week for meetups?",
      platform: "all" as const,
      sentAt: "1 day ago",
      responseCount: 134,
      totalReached: 312,
      responseRate: 43,
      results: [
        { option: "Thursday", count: 52, percentage: 39 },
        { option: "Wednesday", count: 38, percentage: 28 },
        { option: "Tuesday", count: 28, percentage: 21 },
        { option: "Friday", count: 16, percentage: 12 },
      ],
      status: "completed" as const,
    },
    {
      id: "p3",
      question: "What design tools are you exploring?",
      platform: "instagram" as const,
      sentAt: "3 days ago",
      responseCount: 42,
      totalReached: 67,
      responseRate: 63,
      results: [
        { option: "Figma AI features", count: 18, percentage: 43 },
        { option: "Framer", count: 11, percentage: 26 },
        { option: "Webflow", count: 8, percentage: 19 },
        { option: "Rive", count: 5, percentage: 12 },
      ],
      status: "completed" as const,
    },
  ] as BotPoll[],

  memberIntelligence: [
    {
      id: "mi1",
      name: "Sarah Chen",
      avatar: "SC",
      source: "whatsapp" as const,
      interests: ["AI Design", "Design Systems", "Figma"],
      engagementScore: 92,
      responsesGiven: 12,
      lastInteraction: "2 hours ago",
      readyToOnboard: true,
    },
    {
      id: "mi2",
      name: "Marcus Rodriguez",
      avatar: "MR",
      source: "whatsapp" as const,
      interests: ["Frontend Dev", "React", "Motion Design"],
      engagementScore: 85,
      responsesGiven: 9,
      lastInteraction: "4 hours ago",
      readyToOnboard: true,
    },
    {
      id: "mi3",
      name: "Priya Patel",
      avatar: "PP",
      source: "instagram" as const,
      interests: ["UX Research", "Portfolio", "Career Growth"],
      engagementScore: 78,
      responsesGiven: 7,
      lastInteraction: "1 day ago",
      readyToOnboard: true,
    },
    {
      id: "mi4",
      name: "James Wilson",
      avatar: "JW",
      source: "whatsapp" as const,
      interests: ["Startup Design", "Branding", "Freelancing"],
      engagementScore: 71,
      responsesGiven: 5,
      lastInteraction: "2 days ago",
      readyToOnboard: false,
    },
    {
      id: "mi5",
      name: "Aisha Khan",
      avatar: "AK",
      source: "eventbrite" as const,
      interests: ["Motion Design", "3D Design", "AR/VR"],
      engagementScore: 65,
      responsesGiven: 4,
      lastInteraction: "3 days ago",
      readyToOnboard: false,
    },
  ] as BotMemberIntelligence[],

  activityTrend: [
    { date: "Mon", messagesSent: 8, responsesReceived: 42, pollsCreated: 1 },
    { date: "Tue", messagesSent: 5, responsesReceived: 28, pollsCreated: 0 },
    { date: "Wed", messagesSent: 12, responsesReceived: 67, pollsCreated: 2 },
    { date: "Thu", messagesSent: 6, responsesReceived: 34, pollsCreated: 1 },
    { date: "Fri", messagesSent: 9, responsesReceived: 51, pollsCreated: 1 },
    { date: "Sat", messagesSent: 4, responsesReceived: 18, pollsCreated: 0 },
    { date: "Sun", messagesSent: 3, responsesReceived: 12, pollsCreated: 0 },
  ] as BotActivity[],
};

// ============= JARVIS CONVERSATIONAL AI TYPES =============

export interface JarvisDataCard {
  type: "metric" | "members" | "trend" | "comparison";
  title: string;
  data: Record<string, any>;
}

export interface JarvisMessage {
  id: string;
  role: "jarvis" | "user";
  content: string;
  timestamp: string;
  dataCards?: JarvisDataCard[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: "health" | "engagement" | "members" | "events" | "growth";
}

// ============= JARVIS CONVERSATIONAL AI DATA =============

export const jarvisData = {
  welcomeThread: [
    {
      id: "j1",
      role: "jarvis" as const,
      content:
        "Hey! I\u2019ve been analyzing Design Circle SF all week. A few things jumped out \u2014 your engagement dipped 12% since last Tuesday, but your event RSVPs are actually up 18%. Want me to dig into what\u2019s happening?",
      timestamp: "Just now",
    },
    {
      id: "j2",
      role: "user" as const,
      content: "Yeah, why did engagement drop?",
      timestamp: "Just now",
    },
    {
      id: "j3",
      role: "jarvis" as const,
      content:
        "Looks like it\u2019s a posting gap \u2014 your top 3 contributors (Sarah C., Marcus W., Lena K.) all went quiet after the portfolio review event. That event generated 47 posts in 48 hours, then\u2026 crickets. This is actually a common pattern \u2014 high-energy events create a \u2018hangover\u2019 where members feel the bar was set too high for casual posts.",
      timestamp: "Just now",
      dataCards: [
        {
          type: "members" as const,
          title: "Top Contributors \u2014 Post Frequency",
          data: {
            members: [
              { name: "Sarah C.", avatar: "SC", before: [8, 12, 15, 11, 14], after: [3, 1, 0, 1, 0] },
              { name: "Marcus W.", avatar: "MW", before: [6, 9, 7, 10, 8], after: [2, 1, 1, 0, 0] },
              { name: "Lena K.", avatar: "LK", before: [5, 7, 8, 6, 9], after: [1, 0, 2, 0, 0] },
            ],
          },
        },
        {
          type: "trend" as const,
          title: "Engagement This Week",
          data: {
            values: [82, 91, 94, 72, 58, 51, 48],
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            direction: "down" as const,
          },
        },
      ],
    },
    {
      id: "j4",
      role: "jarvis" as const,
      content:
        "My recommendation: Drop a casual prompt in WhatsApp \u2014 something low-stakes like \u2018Show us your desk setup this week.\u2019 It re-opens the door without the pressure of matching that portfolio review energy. I\u2019ve seen this work in 73% of similar communities.",
      timestamp: "Just now",
    },
  ] as JarvisMessage[],

  suggestedQuestions: [
    { id: "sq1", text: "Who are my most at-risk members right now?", category: "health" as const },
    { id: "sq2", text: "What type of content gets the most engagement?", category: "engagement" as const },
    { id: "sq3", text: "How does our retention compare to similar communities?", category: "growth" as const },
    { id: "sq4", text: "What should I do differently this month?", category: "health" as const },
    { id: "sq5", text: "Which members should I personally reach out to?", category: "members" as const },
    { id: "sq6", text: "What\u2019s the best time to post for my community?", category: "engagement" as const },
  ] as SuggestedQuestion[],

  mockResponses: {
    sq1: {
      content:
        "You have 3 members showing strong churn signals right now. David Park hasn\u2019t engaged in 14 days and missed the last 2 events \u2014 that\u2019s unusual for someone who attended 8 in a row. Nadia Okafor\u2019s posting dropped 80% this month, and Tom Liu stopped responding to polls entirely after being your most active pollster.",
      dataCards: [
        {
          type: "members" as const,
          title: "At-Risk Members",
          data: {
            members: [
              { name: "David Park", avatar: "DP", stat: "14 days inactive", risk: 82 },
              { name: "Nadia Okafor", avatar: "NO", stat: "80% post drop", risk: 71 },
              { name: "Tom Liu", avatar: "TL", stat: "0 poll responses", risk: 65 },
            ],
          },
        },
        {
          type: "metric" as const,
          title: "Community Health Score",
          data: { value: 74, trend: -3, label: "Health Score" },
        },
      ],
    },
    sq2: {
      content:
        "Your portfolio shares get 3.2x more engagement than any other content type. Members spend an average of 4.2 minutes on portfolio posts vs 0.8 minutes on general discussion. But here\u2019s what\u2019s interesting \u2014 \u2018hot take\u2019 style posts about design tools get the most comments per post, even though they reach fewer people.",
      dataCards: [
        {
          type: "comparison" as const,
          title: "Engagement by Content Type",
          data: {
            items: [
              { label: "Portfolio shares", value: 89, color: "var(--gold)" },
              { label: "Hot takes / opinions", value: 72, color: "var(--cream)" },
              { label: "Event recaps", value: 54, color: "var(--burg-400)" },
              { label: "General discussion", value: 28, color: "var(--burg-600)" },
            ],
          },
        },
      ],
    },
    sq3: {
      content:
        "Your 30-day retention is 68%, which puts you in the top 25% of design communities your size. The average for communities with 150\u2013250 members is 54%. Where you\u2019re falling behind is event-to-member conversion \u2014 you\u2019re at 12% vs the top performers at 28%. People come to events but don\u2019t always stick around in the community afterward.",
      dataCards: [
        {
          type: "comparison" as const,
          title: "You vs Similar Communities",
          data: {
            items: [
              { label: "30-day retention", yours: 68, avg: 54, unit: "%" },
              { label: "Weekly active rate", yours: 42, avg: 35, unit: "%" },
              { label: "Event conversion", yours: 12, avg: 20, unit: "%" },
              { label: "Post frequency", yours: 8.4, avg: 5.2, unit: "/wk" },
            ],
          },
        },
      ],
    },
    sq4: {
      content:
        "Three things I\u2019d change this month: First, your Thursday events consistently outperform other days by 40% \u2014 move your monthly mixer from Wednesday. Second, you\u2019re over-indexing on announcements (60% of posts) and under-indexing on member spotlights \u2014 flip that ratio. Third, start a \u2018Design of the Day\u2019 thread in WhatsApp. Low-effort, high-engagement \u2014 similar communities saw a 25% bump in daily active members.",
      dataCards: [
        {
          type: "trend" as const,
          title: "Projected Impact",
          data: {
            values: [74, 74, 76, 78, 81, 84, 87],
            labels: ["Now", "Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
            direction: "up" as const,
          },
        },
      ],
    },
    sq5: {
      content:
        "I\u2019d personally reach out to 4 members this week. Sarah Chen has been your top contributor for 3 months \u2014 a quick thank you DM goes a long way. David Park is at-risk (14 days silent) \u2014 a casual check-in could save him. Priya Patel just attended her first event and posted twice \u2014 she\u2019s in the \u2018golden window\u2019 for deep engagement. And Marcus Rodriguez has been sharing your events externally \u2014 he\u2019s a natural ambassador.",
      dataCards: [
        {
          type: "members" as const,
          title: "Recommended Outreach",
          data: {
            members: [
              { name: "Sarah Chen", avatar: "SC", stat: "Top contributor \u2014 thank her", risk: 0 },
              { name: "David Park", avatar: "DP", stat: "At-risk \u2014 check in", risk: 82 },
              { name: "Priya Patel", avatar: "PP", stat: "New & active \u2014 welcome her", risk: 0 },
              { name: "Marcus Rodriguez", avatar: "MR", stat: "Ambassador \u2014 empower him", risk: 0 },
            ],
          },
        },
      ],
    },
    sq6: {
      content:
        "Your community is most active between 10\u201311am and 7\u20139pm PST. Tuesday and Thursday mornings get 2.3x more engagement than other time slots. The worst time? Sunday mornings \u2014 less than 5% of your members are online. For events, Thursday 7pm is your sweet spot (your poll data confirms this too \u2014 39% chose Thursday).",
      dataCards: [
        {
          type: "trend" as const,
          title: "Activity by Hour (Avg)",
          data: {
            values: [5, 8, 22, 45, 78, 92, 85, 62, 38, 25, 48, 71, 88, 95, 82, 55, 30, 12],
            labels: ["6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p"],
            direction: "up" as const,
          },
        },
      ],
    },
  } as Record<string, { content: string; dataCards?: JarvisDataCard[] }>,

  genericResponse: {
    content:
      "That\u2019s a great question. Based on your community data, here\u2019s what I\u2019m seeing \u2014 your community has been growing steadily at 8% month-over-month, with strong engagement from your core group. The biggest opportunity I see is converting event attendees into daily active members. Want me to dive deeper into any specific area?",
    dataCards: [
      {
        type: "metric" as const,
        title: "Community Snapshot",
        data: { value: 74, trend: 3, label: "Health Score" },
      },
      {
        type: "trend" as const,
        title: "Growth Trend (6 months)",
        data: {
          values: [120, 135, 148, 162, 178, 194],
          labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          direction: "up" as const,
        },
      },
    ],
  } as { content: string; dataCards?: JarvisDataCard[] },
};
