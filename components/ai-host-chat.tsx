"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function AIHostChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiHost, setAIHost] = useState<AIHost | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        setMessages(data.messages || []);
        
        // If no messages, send initial greeting
        if (data.messages.length === 0) {
          setTimeout(() => {
            sendInitialGreeting();
          }, 500);
        }
      }
    } catch (error) {
      console.error("Failed to load conversation", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendInitialGreeting = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-host/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello!" }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          { id: "temp-user", role: "user", message: "Hello!", createdAt: new Date().toISOString() },
          { id: "temp-ai", role: "assistant", message: data.response, createdAt: new Date().toISOString() },
        ]);
        loadConversationHistory();
      }
    } catch (error) {
      console.error("Failed to send initial greeting", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
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
        loadConversationHistory();
      } else {
        setMessages((prev) => prev.slice(0, -1)); // Remove temp message on error
        const errorData = await res.json();
        alert(errorData.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1)); // Remove temp message on error
      console.error("Failed to send message", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {/* Header */}
      <div className="border-b p-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              {aiHost?.name || "Your AI Host"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              I'm here to help you discover communities
            </p>
          </div>
          <Link
            href="/ai-host/recommendations"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium bg-white px-3 py-1.5 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
          >
            View Recommendations →
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation with your AI Host!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors font-medium"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

