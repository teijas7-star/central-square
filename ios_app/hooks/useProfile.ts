import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { API_CONFIG } from "@/constants";

export interface Profile {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  interests: string[];
  createdAt: string;
}

interface ProfileResponse {
  profile: Profile | null;
}

interface UpdateProfileInput {
  name?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
}

// Fetch current user profile
export function useProfile() {
  const query = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: () => api.get<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILES),
  });

  return {
    ...query,
    profile: query.data?.profile,
  };
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api.post<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILES, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Create profile (for new users)
export function useCreateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { name: string; handle: string; bio?: string }) =>
      api.post<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILES, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    createProfile: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export { useProfile as default };
