import { API_CONFIG, APP_CONFIG } from "@/constants";
import { useAuthStore, supabase } from "@/stores/authStore";

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  return headers;
}

async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = APP_CONFIG.API_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers,
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(
        data.error || "Request failed",
        response.status,
        data
      );
    }

    return response.json();
  },

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(
        data.error || "Request failed",
        response.status,
        data
      );
    }

    return response.json();
  },

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();

    const response = await fetchWithTimeout(url, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(
        data.error || "Request failed",
        response.status,
        data
      );
    }

    return response.json();
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = await getAuthHeaders();

    const response = await fetchWithTimeout(url, {
      method: "DELETE",
      headers,
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new ApiError(
        data.error || "Request failed",
        response.status,
        data
      );
    }

    return response.json();
  },
};

export { ApiError };
