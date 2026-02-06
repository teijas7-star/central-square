import { create } from "zustand";
import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@/constants";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// Platform-specific storage adapter
const createStorageAdapter = () => {
  // For web/browser, use localStorage
  if (isBrowser) {
    return {
      getItem: (key: string) => {
        try {
          const value = window.localStorage.getItem(key);
          return Promise.resolve(value);
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch {}
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch {}
        return Promise.resolve();
      },
    };
  }

  // For SSR/Node environment, use in-memory storage
  if (Platform.OS === "web") {
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
        return Promise.resolve();
      },
    };
  }

  // For native, use SecureStore
  const SecureStore = require("expo-secure-store");
  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
};

// Only create Supabase client if URL is configured
const supabase = SUPABASE_CONFIG.URL
  ? createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY, {
      auth: {
        storage: createStorageAdapter(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: isBrowser,
      },
    })
  : null;

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Helper to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    // If Supabase is not configured, just mark as loaded (no auth)
    if (!supabase) {
      console.log("Supabase not configured, skipping auth");
      set({ isLoading: false });
      return;
    }

    try {
      // Add 5 second timeout to prevent hanging
      const { data: { session } } = await withTimeout(
        supabase.auth.getSession(),
        5000
      );

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || "",
          },
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || "",
            },
            session,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      // On error or timeout, just proceed without auth
      set({
        isLoading: false,
        user: null,
        session: null,
        isAuthenticated: false,
      });
    }
  },

  signInWithEmail: async (email: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  verifyOtp: async (email: string, token: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        return { error };
      }

      if (data.session?.user) {
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || "",
          },
          session: data.session,
          isAuthenticated: true,
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));

export { supabase };
