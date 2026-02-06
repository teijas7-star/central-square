import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { API_CONFIG } from "@/constants";

export interface Arcade {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  visibility: "open" | "invite";
  host: {
    id: string;
    name: string;
    handle: string;
  };
  _count: {
    memberships: number;
    posts: number;
  };
}

export interface ArcadeDetail extends Arcade {
  isMember: boolean;
  isHost: boolean;
}

interface ArcadesResponse {
  arcades: Arcade[];
}

interface ArcadeResponse {
  arcade: ArcadeDetail;
  isMember: boolean;
  isHost: boolean;
}

interface CreateArcadeInput {
  name: string;
  description?: string;
  tags?: string[];
  visibility?: "open" | "invite";
}

// Fetch all arcades
export function useArcades() {
  const query = useQuery<ArcadesResponse>({
    queryKey: ["arcades"],
    queryFn: () => api.get<ArcadesResponse>(API_CONFIG.ENDPOINTS.ARCADES),
  });

  return {
    ...query,
    arcades: query.data?.arcades || [],
  };
}

// Fetch single arcade
export function useArcade(id: string) {
  return useQuery<ArcadeResponse>({
    queryKey: ["arcade", id],
    queryFn: () => api.get<ArcadeResponse>(API_CONFIG.ENDPOINTS.ARCADE(id)),
    enabled: !!id,
  });
}

// Create new arcade
export function useCreateArcade() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateArcadeInput) =>
      api.post<{ arcade: Arcade }>(API_CONFIG.ENDPOINTS.ARCADES, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arcades"] });
    },
  });

  return {
    createArcade: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Join an arcade
export function useJoinArcade() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (arcadeId: string) =>
      api.post(API_CONFIG.ENDPOINTS.ARCADE_JOIN(arcadeId)),
    onSuccess: (_, arcadeId) => {
      queryClient.invalidateQueries({ queryKey: ["arcade", arcadeId] });
      queryClient.invalidateQueries({ queryKey: ["arcades"] });
    },
  });

  return {
    joinArcade: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Leave an arcade (or remove a member if host)
export function useLeaveArcade() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ arcadeId, userId }: { arcadeId: string; userId: string }) =>
      api.delete(
        `${API_CONFIG.ENDPOINTS.ARCADE_MEMBERS(arcadeId)}/${userId}`
      ),
    onSuccess: (_, { arcadeId }) => {
      queryClient.invalidateQueries({ queryKey: ["arcade", arcadeId] });
      queryClient.invalidateQueries({ queryKey: ["arcades"] });
    },
  });

  return {
    leaveArcade: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Discover arcades
export function useDiscoverArcades() {
  return useQuery<{ arcades: Arcade[] }>({
    queryKey: ["discover-arcades"],
    queryFn: () => api.get(API_CONFIG.ENDPOINTS.DISCOVERY),
  });
}

export { useArcades as default };
