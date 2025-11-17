"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  MapPin,
  Globe,
  Users,
  X,
  Send,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Building2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
}

interface AIHost {
  id: string;
  name: string;
}

export default function AIHostPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiHost, setAIHost] = useState<AIHost | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sessionActive, setSessionActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestedPrompts = [
    "Find sustainability groups near me",
    "Show trending discussions in my city",
    "Who's hosting civic tech events this week?",
  ];

  useEffect(() => {
    loadConversationHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversationHistory = async () => {
    try {
      const res = await fetch("/api/ai-host/chat");
      if (res.ok) {
        const data = await res.json();
        setAIHost(data.aiHost);
        
        // If no messages, show demo conversation
        if (data.messages.length === 0) {
          setMessages([
            {
              id: "demo-1",
              role: "assistant",
              message: "👋 Hello! I'm your AI Host. What would you like to explore today?\n\nI can help you find local communities, discover global initiatives, or connect you with like-minded people in your area.",
              createdAt: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages(data.messages || []);
        }
      }
    } catch (error) {
      console.error("Failed to load conversation", error);
      // Show demo conversation on error
      setMessages([
        {
          id: "demo-1",
          role: "assistant",
          message: "👋 Hello! I'm your AI Host. What would you like to explore today?\n\nI can help you find local communities, discover global initiatives, or connect you with like-minded people in your area.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    let message = "";
    switch (action) {
      case "local":
        message = "Find Local Arcades";
        break;
      case "global":
        message = "Discover Global Topics";
        break;
      case "people":
        message = "Suggest People to Meet";
        break;
    }
    setInput(message);
    await handleSendMessage(message);
  };

  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || loading) return;

    setInput("");
    setLoading(true);

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch("/api/ai-host/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: Message = {
          id: `temp-${Date.now() + 1}`,
          role: "assistant",
          message: data.response,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        
        // Reload full history to get actual IDs
        setTimeout(() => {
          loadConversationHistory();
        }, 500);
      } else {
        setMessages((prev) => prev.slice(0, -1)); // Remove temp message on error
        const errorData = await res.json();
        // Show contextual error messages
        const errorMessages = [
          "Hmm, I'm having a moment processing that. Could you rephrase your question?",
          "I'm having trouble understanding that right now. Could you try asking it differently?",
          "Let me try a different approach - could you rephrase what you're looking for?",
          "I didn't quite catch that. Can you tell me more about what you're interested in?",
        ];
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1)); // Remove temp message on error
      console.error("Failed to send message", error);
      const networkErrorMessages = [
        "I'm having trouble connecting right now. Please try again in a moment.",
        "Connection issue on my end. Give me a second and try again?",
        "Something's not connecting properly. Let's try again in a moment.",
        "I'm experiencing a brief hiccup. Can you try sending that again?",
      ];
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        message: networkErrorMessages[Math.floor(Math.random() * networkErrorMessages.length)],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage();
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    handleSendMessage(prompt);
  };

  if (loadingHistory) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your AI Host...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left Sidebar */}
      <aside className="w-80 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col">
        {/* AI Host Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900">AI Host</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Always here to help</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            I'm here to help you explore communities, discover opportunities, and connect with people who share your civic interests.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleQuickAction("local")}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              <span className="text-sm text-neutral-700">Find Local Arcades</span>
            </button>
            <button
              onClick={() => handleQuickAction("global")}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              <span className="text-sm text-neutral-700">Discover Global Topics</span>
            </button>
            <button
              onClick={() => handleQuickAction("people")}
              disabled={loading}
              className="w-full flex items-center space-x-3 px-3 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              <span className="text-sm text-neutral-700">Suggest People to Meet</span>
            </button>
          </div>
        </div>

        {/* Session Status */}
        <div className="mt-auto p-6">
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-neutral-500">Session Active</p>
              <button
                onClick={() => setSessionActive(!sessionActive)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Close session"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${sessionActive ? "bg-green-500" : "bg-neutral-400"}`} />
              <p className="text-xs text-neutral-600">Ready to assist</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-neutral-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900">Your AI Host</h1>
                <p className="text-base text-neutral-600 mt-0.5">
                  Discovering conversations, communities, and opportunities that match your interests
                </p>
              </div>
            </div>
            <Link
              href="/ai-host/recommendations"
              className="bg-gradient-to-r from-neutral-600 to-neutral-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-neutral-700 hover:to-neutral-800 transition-all shadow-sm"
            >
              View My Recommendations
            </Link>
          </div>
        </header>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start space-x-3`}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-neutral-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl ${
                    msg.role === "user"
                      ? "bg-neutral-100 text-neutral-800 rounded-bl-[16px] rounded-br-[6px] rounded-tl-[16px] rounded-tr-[16px]"
                      : "bg-white border border-neutral-100 text-neutral-800 rounded-bl-[6px] rounded-br-[16px] rounded-tl-[6px] rounded-tr-[16px] shadow-sm"
                  }`}
                >
                  <div className="p-4">
                    <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    
                    {/* Arcade Suggestions */}
                    {msg.role === "assistant" && msg.message.toLowerCase().includes("sustainability") && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-neutral-50 border-l-4 border-neutral-400 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-neutral-900 mb-1">
                                Green City Collective
                              </h4>
                              <p className="text-sm text-neutral-600 mb-2">
                                Local urban gardening and clean energy advocacy
                              </p>
                              <div className="flex items-center text-xs text-neutral-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>2.3 miles away</span>
                              </div>
                            </div>
                            <Link
                              href="/global/arcades"
                              className="ml-4 text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                        <div className="bg-neutral-50 border-l-4 border-neutral-400 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-base font-medium text-neutral-900 mb-1">
                                Climate Action Network
                              </h4>
                              <p className="text-sm text-neutral-600 mb-2">
                                Community organizing for climate policy
                              </p>
                              <div className="flex items-center text-xs text-neutral-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>1.8 miles away</span>
                              </div>
                            </div>
                            <Link
                              href="/global/arcades"
                              className="ml-4 text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {msg.role === "assistant" && (
                    <div className="px-4 pb-2 flex items-center space-x-3">
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors" title="Copy">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors" title="Helpful">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors" title="Not helpful">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-neutral-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start items-start space-x-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="bg-white border border-neutral-100 rounded-2xl rounded-bl-[6px] rounded-br-[16px] rounded-tl-[6px] rounded-tr-[16px] shadow-sm">
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length > 0 && !loading && (
          <div className="px-6 py-3 border-t border-neutral-200 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    disabled={loading}
                    className="flex-shrink-0 bg-white border border-neutral-200 rounded-full px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-neutral-200 px-6 py-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI Host anything…"
                disabled={loading}
                className="w-full bg-white border border-neutral-300 rounded-full px-4 py-3 pr-12 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white w-8 h-8 rounded-full flex items-center justify-center hover:from-neutral-700 hover:to-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

