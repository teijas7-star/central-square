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
