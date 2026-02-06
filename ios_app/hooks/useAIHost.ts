import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { API_CONFIG } from "@/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Recommendation {
  arcadeId: string;
  arcadeName: string;
  reason: string;
  confidence: number;
}

interface ChatResponse {
  response: string;
  aiHostId: string;
}

interface ConversationHistory {
  aiHost: {
    id: string;
    name: string;
  };
  messages: Array<{
    id: string;
    role: string;
    message: string;
    createdAt: string;
  }>;
}

interface RecommendationsResponse {
  recommendations: Array<{
    id: string;
    arcadeId: string;
    reason: string;
    confidence: number;
    arcade: {
      id: string;
      name: string;
    };
  }>;
}

export function useAIHost() {
  const queryClient = useQueryClient();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch conversation history
  const { data: history } = useQuery<ConversationHistory>({
    queryKey: ["ai-host-history"],
    queryFn: () => api.get<ConversationHistory>(API_CONFIG.ENDPOINTS.AI_HOST_CHAT),
    staleTime: 0, // Always fetch fresh data
  });

  // Fetch recommendations
  const { data: recommendationsData } = useQuery<RecommendationsResponse>({
    queryKey: ["ai-host-recommendations"],
    queryFn: () =>
      api.get<RecommendationsResponse>(API_CONFIG.ENDPOINTS.AI_HOST_RECOMMENDATIONS),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      api.post<ChatResponse>(API_CONFIG.ENDPOINTS.AI_HOST_CHAT, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-host-history"] });
      queryClient.invalidateQueries({ queryKey: ["ai-host-recommendations"] });
    },
  });

  // Combine history with local messages
  const messages: Message[] = [
    // Historical messages
    ...(history?.messages || []).map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.message,
      timestamp: new Date(msg.createdAt),
    })),
    // Local messages (for immediate UI feedback)
    ...localMessages,
  ];

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: `local-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      // Add user message immediately for UI feedback
      setLocalMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendMessageMutation.mutateAsync(content);

        // Add assistant response
        const assistantMessage: Message = {
          id: `local-${Date.now()}-response`,
          role: "assistant",
          content: response.response,
          timestamp: new Date(),
        };

        setLocalMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // Remove the user message if sending failed
        setLocalMessages((prev) =>
          prev.filter((msg) => msg.id !== userMessage.id)
        );
        throw error;
      } finally {
        setIsLoading(false);
        // Clear local messages after successful fetch
        setTimeout(() => {
          setLocalMessages([]);
        }, 100);
      }
    },
    [sendMessageMutation]
  );

  // Format recommendations
  const recommendations: Recommendation[] = (
    recommendationsData?.recommendations || []
  ).map((rec) => ({
    arcadeId: rec.arcadeId,
    arcadeName: rec.arcade.name,
    reason: rec.reason,
    confidence: rec.confidence,
  }));

  return {
    messages,
    recommendations,
    sendMessage,
    isLoading,
    aiHostName: history?.aiHost?.name || "AI Host",
  };
}

export { useAIHost as default };
