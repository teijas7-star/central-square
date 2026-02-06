import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { API_CONFIG } from "@/constants";

export interface Post {
  id: string;
  body: string;
  createdAt: string;
  isLantern: boolean;
  author: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  replies: Post[];
  arcade?: {
    id: string;
    name: string;
  } | null;
}

interface PostsResponse {
  posts: Post[];
  pagination?: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}

interface CreatePostInput {
  body: string;
  arcadeId?: string | null;
  parentId?: string | null;
}

// Fetch posts (global feed or arcade-specific)
export function usePosts(arcadeId?: string) {
  const endpoint = arcadeId
    ? `${API_CONFIG.ENDPOINTS.POSTS}?arcadeId=${arcadeId}`
    : API_CONFIG.ENDPOINTS.FEED_SQUARE;

  const query = useQuery<PostsResponse>({
    queryKey: ["posts", arcadeId],
    queryFn: () => api.get<PostsResponse>(endpoint),
  });

  return {
    ...query,
    posts: query.data?.posts || [],
  };
}

// Create a new post
export function useCreatePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreatePostInput) =>
      api.post<{ post: Post }>(API_CONFIG.ENDPOINTS.POSTS, input),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (variables.arcadeId) {
        queryClient.invalidateQueries({
          queryKey: ["posts", variables.arcadeId],
        });
      }
    },
  });

  return {
    createPost: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Toggle lantern status
export function useToggleLantern() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId: string) =>
      api.post<{ isLantern: boolean }>(
        API_CONFIG.ENDPOINTS.POST_LANTERN(postId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    toggleLantern: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

// Re-export for simpler imports
export { usePosts as default };
