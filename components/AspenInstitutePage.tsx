"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  ArrowRight,
  Landmark,
  Users,
  BookOpen,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import Nav from "./layout/nav";

export default function AspenInstitutePage() {
  const [activeTab, setActiveTab] = useState<"conversation" | "events" | "learn">("conversation");

  const posts = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        role: "Aspen Fellow",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      },
      tags: ["Leadership", "AI"],
      content: "Reflecting on today's dialogue about ethical AI development. How do we balance innovation with accountability? The conversation reminded me that technology serves humanity best when built with empathy at its core.",
      timeAgo: "2 hours ago",
      replies: 12,
      likes: 24,
    },
    {
      id: "2",
      author: {
        name: "Marcus Johnson",
        role: "Community Member",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      tags: ["Democracy", "Society"],
      content: "The discussion on civic renewal resonated deeply. Building bridges across divides requires patience, empathy, and a commitment to understanding perspectives different from our own.",
      timeAgo: "5 hours ago",
      replies: 8,
      likes: 18,
    },
    {
      id: "3",
      author: {
        name: "Elena Rodriguez",
        role: "Aspen Fellow",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      },
      tags: ["Ethics", "Technology"],
      content: "What does ethical leadership look like in an age of rapid technological change? Today's seminar explored how we can maintain our values while embracing innovation.",
      timeAgo: "1 day ago",
      replies: 15,
      likes: 32,
    },
  ];

  const events = [
    {
      id: "1",
      title: "Aspen Seminar in Session",
      date: "Jan 20, 2025",
      time: "2:00 PM",
      location: "Innovation Center",
    },
    {
      id: "2",
      title: "Leadership Dialogue",
      date: "Jan 25, 2025",
      time: "6:00 PM",
      location: "Community Hall",
    },
    {
      id: "3",
      title: "Community Gathering",
      date: "Feb 1, 2025",
      time: "7:00 PM",
      location: "Innovation Center",
    },
  ];

  const dialogues = [
    {
      id: "1",
      title: "Ethical Leadership in the Digital Age",
      date: "Feb 5, 2025",
      time: "6:00 PM",
      location: "Innovation Center",
      description: "Exploring how leaders can navigate ethical challenges in an increasingly digital world.",
      type: "Dialogue",
    },
    {
      id: "2",
      title: "Democracy and Technology",
      date: "Feb 12, 2025",
      time: "7:00 PM",
      location: "Community Hall",
      description: "A deep dive into how technology shapes democratic participation and civic engagement.",
      type: "Seminar",
    },
    {
      id: "3",
      title: "Building Inclusive Communities",
      date: "Feb 20, 2025",
      time: "6:30 PM",
      location: "Innovation Center",
      description: "Strategies for creating communities that welcome diverse perspectives and experiences.",
      type: "Dialogue",
    },
  ];

  const communityMembers = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Aspen Fellow",
      bio: "Tech entrepreneur focused on ethical AI",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Community Leader",
      bio: "Advocate for civic engagement and democracy",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Aspen Fellow",
      bio: "Policy researcher and thought leader",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "4",
      name: "Alex Thompson",
      role: "Community Member",
      bio: "Urban planner and sustainability advocate",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "5",
      name: "Jamie Park",
      role: "Aspen Fellow",
      bio: "Social entrepreneur and community builder",
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "6",
      name: "David Kim",
      role: "Community Member",
      bio: "Educator and civic engagement specialist",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
  ];

  const ideas = [
    {
      id: "1",
      title: "The Future of Civic Engagement",
      author: "Sarah Chen",
      excerpt: "How digital platforms can enhance rather than replace traditional forms of civic participation.",
      category: "Democracy",
      date: "Jan 15, 2025",
    },
    {
      id: "2",
      title: "Ethical AI: A Framework for Leaders",
      author: "Elena Rodriguez",
      excerpt: "A practical guide for leaders navigating the ethical implications of artificial intelligence.",
      category: "Technology",
      date: "Jan 10, 2025",
    },
    {
      id: "3",
      title: "Building Bridges Across Divides",
      author: "Marcus Johnson",
      excerpt: "Strategies for fostering dialogue and understanding in polarized communities.",
      category: "Society",
      date: "Jan 5, 2025",
    },
    {
      id: "4",
      title: "Leadership in Times of Change",
      author: "Jamie Park",
      excerpt: "Exploring adaptive leadership models for navigating complex societal challenges.",
      category: "Leadership",
      date: "Dec 28, 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-700">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/70 via-neutral-800/70 to-neutral-900/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-end pb-12">
          <div className="w-full">
            {/* Logo and Title */}
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Landmark className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
                  Aspen Institute Boston
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Exploring leadership, ethics, and ideas for a better society.
                </p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setActiveTab("conversation")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "conversation"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
              >
                Join the Conversation
                {activeTab === "conversation" && <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "events"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab("learn")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "learn"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                }`}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-bold text-neutral-900 mb-3">Who We Are</h2>
            <div className="w-24 h-1 bg-neutral-900 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <p className="text-xl text-neutral-700 leading-relaxed">
                Aspen Institute Boston convenes emerging leaders across sectors to engage in reflective dialogue and shared inquiry — grounded in values and ideas.
              </p>
              <p className="text-xl text-neutral-700 leading-relaxed">
                Through thoughtful conversation and collaborative exploration, we bridge divides and inspire civic renewal across our community and beyond.
              </p>
              
              <div className="space-y-8 pt-8">
                <div>
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Mission</h3>
                  <p className="text-xl text-neutral-700">To inspire civic renewal through dialogue.</p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Focus Areas</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Leadership", "Ethics", "Technology", "Democracy", "Society"].map((area) => (
                      <span
                        key={area}
                        className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg text-base font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-56 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop"
                  alt="Aspen Seminar in Session"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">Aspen Seminar in Session</p>
                </div>
              </div>
              <div className="relative h-56 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                  alt="Leadership Dialogue"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">Leadership Dialogue</p>
                </div>
              </div>
              <div className="relative h-64 col-span-2 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop"
                  alt="Community Gathering at Innovation Center"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">Community Gathering at Innovation Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In the Square Section */}
      {activeTab === "conversation" && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-neutral-900 mb-2">In the Square</h2>
              <p className="text-xl text-neutral-600">
                Join the conversation with fellows and community members
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Posts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Compose Box */}
                <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Start a discussion..."
                      className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-base"
                    />
                    <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
                
                {/* Posts */}
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                        {post.author.avatarUrl ? (
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          post.author.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-neutral-900">{post.author.name}</span>
                          <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                            {post.author.role}
                          </span>
                          <span className="text-sm text-neutral-500">· {post.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-sm text-indigo-600 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-4 text-base">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-neutral-600">
                          <button className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {post.replies} replies
                          </button>
                          <button className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-2 hover:text-neutral-900 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-medium text-neutral-900 mb-2">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{event.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Tab */}
      {activeTab === "events" && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-neutral-900 mb-12">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{event.title}</h3>
                  <div className="space-y-2 text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <p>{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learn More Tab */}
      {activeTab === "learn" && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-neutral-900 mb-8">Learn More</h2>
            <div className="bg-white rounded-xl p-8 border border-neutral-200 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">About Aspen Institute</h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  The Aspen Institute is a global nonprofit organization committed to realizing a free, just, and equitable society. 
                  For more than 70 years, the Institute has driven change through dialogue, leadership, and action to help solve 
                  the most critical challenges facing communities in the United States and around the world.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Our Approach</h3>
                <p className="text-lg text-neutral-700 leading-relaxed">
                  Through seminars, policy programs, conferences, and leadership development initiatives, the Institute and its 
                  international partners create opportunities for deep, reflective thinking and collaborative problem-solving.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Get Involved</h3>
                <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                  Join us in building a more just and equitable society through dialogue, leadership, and action.
                </p>
                <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Dialogues and Seminars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-neutral-900 mb-3">Upcoming Dialogues and Seminars</h2>
            <p className="text-xl text-neutral-600">
              Join us for thought-provoking conversations and learning opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dialogues.map((dialogue) => (
              <div
                key={dialogue.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {dialogue.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{dialogue.title}</h3>
                <p className="text-neutral-600 mb-4 line-clamp-2">{dialogue.description}</p>
                <div className="space-y-2 text-sm text-neutral-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{dialogue.date} at {dialogue.time}</span>
                  </div>
                  <p>{dialogue.location}</p>
                </div>
                <button className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Community Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-neutral-900 mb-3">Our Community</h2>
            <p className="text-xl text-neutral-600">
              Meet the fellows, leaders, and members shaping our conversations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {communityMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold mx-auto mb-4">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-sm text-indigo-600 mb-2">{member.role}</p>
                <p className="text-xs text-neutral-600 line-clamp-2">{member.bio}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
              View All Members
            </button>
          </div>
        </div>
      </section>

      {/* Ideas That Shape Society Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-neutral-900 mb-3">Ideas That Shape Society</h2>
            <p className="text-xl text-neutral-600">
              Insights, research, and perspectives from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
                    {idea.category}
                  </span>
                  <span className="text-sm text-neutral-500">{idea.date}</span>
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-3">{idea.title}</h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">{idea.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">By {idea.author}</span>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    Read More
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Become part of a community dedicated to thoughtful dialogue, ethical leadership, and civic renewal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              Join Our Community
            </button>
            <button className="px-8 py-4 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors border border-neutral-700">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

