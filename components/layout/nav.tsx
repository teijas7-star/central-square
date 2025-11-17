"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { AnimatedRootsLogo } from "../CSLogos/animated-logos";

export default function Nav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAgoraPage = pathname?.startsWith("/agora");
  const isDashboardPage = pathname?.includes("/dashboard");
  const isAIHostPage = pathname === "/ai-host";
  const isAIHostRecommendationsPage = pathname === "/ai-host/recommendations";
  const isAIHostRelatedPage = isAIHostPage || isAIHostRecommendationsPage;
  const isProfilePage = pathname === "/profile";
  // Detect city pages (like /boston, /new-york, etc.)
  // City pages are routes that don't match known patterns
  const isCityPage = pathname && 
    pathname !== "/" && 
    !pathname.startsWith("/agora") && 
    !pathname.startsWith("/square") && 
    !pathname.startsWith("/global") && 
    !pathname.startsWith("/signin") && 
    !pathname.startsWith("/dashboard") && 
    !pathname.startsWith("/profile") && 
    !pathname.startsWith("/ai-host") && 
    !pathname.startsWith("/people") && 
    !pathname.startsWith("/events") && 
    !pathname.startsWith("/discover") && 
    !pathname.startsWith("/arcades") &&
    pathname.split("/").filter(Boolean).length === 1; // Only single-level paths like /boston

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    // Only set loading on initial load, otherwise keep previous state visible
    if (initialLoad) {
      setLoading(true);
    }
    
    fetch("/api/profiles", {
      credentials: 'include', // Ensure cookies are sent
      cache: 'no-store', // Don't cache auth checks
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // 401 means not authenticated, which is fine
        if (res.status === 401) {
          return null;
        }
        // For other errors, try to parse error message
        return res.json().catch(() => null);
      })
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        // Network error or other issues - don't clear user if we had one before
        // Only clear on initial load
        if (initialLoad) {
          console.error("Auth check error:", error);
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
        setInitialLoad(false);
      });
  }, [pathname]); // Re-check auth when pathname changes

  const handleSignOut = async () => {
    const res = await fetch("/api/auth/signout", {
      method: "POST",
    });
    if (res.ok) {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Make nav dark for all signed-out pages (excluding homepage)
  // Also make nav dark for all signed-in pages (for consistency)
  // During loading, assume signed out if pathname is not homepage
  const isDarkNavPage = (!loading && !user && pathname !== "/") || (loading && pathname && pathname !== "/") || (!loading && user);
  const isSignedOut = !user && !loading;

  return (
    <nav className={`border-b ${isDarkNavPage ? 'bg-neutral-900' : 'bg-white dark:bg-neutral-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Link href="/" className={`flex items-center gap-1.5 text-xl font-semibold ${isDarkNavPage ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <AnimatedRootsLogo size={36} />
            </div>
            <span className={isDarkNavPage ? 'text-white' : 'text-neutral-900 dark:text-white'}>Central Square</span>
          </Link>
          {user ? (
            <>
              {/* Signed-in navigation: Show toggle and Events/People links */}
              <div className={`flex items-center space-x-2 rounded-lg p-1 ${isDarkNavPage ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                {isAgoraPage ? (
                  <>
                    <Link href="/boston" className={`px-3 py-1.5 text-sm ${isDarkNavPage ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'}`}>
                      Your City
                    </Link>
                    <button className={`px-3 py-1.5 rounded-md text-sm font-medium ${isDarkNavPage ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'}`}>
                      Global Agora
                    </button>
                  </>
                ) : (
                  <>
                    <button className={`px-3 py-1.5 rounded-md text-sm font-medium ${isDarkNavPage ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'}`}>
                      Your City
                    </button>
                    <Link href="/agora" className={`px-3 py-1.5 text-sm ${isDarkNavPage ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'}`}>
                      Global Agora
                    </Link>
                  </>
                )}
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/events" className={`font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  Events
                </Link>
                <Link href="/people" className={`font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  People
                </Link>
              </nav>
            </>
          ) : (
            <>
              {/* Signed-out navigation: Show toggle and Events/People links */}
              <div className={`flex items-center space-x-2 rounded-lg p-1 ${isDarkNavPage ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                {isAgoraPage ? (
                  <>
                    <Link href="/boston" className={`px-3 py-1.5 text-sm ${isDarkNavPage ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'}`}>
                      Your City
                    </Link>
                    <button className={`px-3 py-1.5 rounded-md text-sm font-medium ${isDarkNavPage ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'}`}>
                      Global Agora
                    </button>
                  </>
                ) : (
                  <>
                    <button className={`px-3 py-1.5 rounded-md text-sm font-medium ${isDarkNavPage ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm'}`}>
                      Your City
                    </button>
                    <Link href="/agora" className={`px-3 py-1.5 text-sm ${isDarkNavPage ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900'}`}>
                      Global Agora
                    </Link>
                  </>
                )}
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/events" className={`font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  Events
                </Link>
                <Link href="/people" className={`font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  People
                </Link>
              </nav>
            </>
          )}
        </div>
        
        {/* Search Bar - Center */}
        {mounted && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkNavPage ? 'text-neutral-400' : 'text-neutral-400'}`}>
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communities, people, events..."
                className={`block w-full ${isDarkNavPage ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-neutral-600' : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:ring-neutral-900'} border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
            </div>
          </form>
        )}
        
        <div className="flex gap-4 flex-shrink-0">
          {loading ? (
            <>
              {/* Loading state - show signed out nav */}
              <div className="flex items-center space-x-4">
                <Link href="/signin" className={`text-sm font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  Sign In
                </Link>
                {(isAgoraPage || isCityPage) && (
                  <Link href="/signin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkNavPage ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                    Join
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              {user ? (
                <>
                  {/* Standardized signed-in navigation: Profile, AI Host, Sign Out */}
                  <Link href="/profile" className={`hover:underline ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                    Profile
                  </Link>
                  <Link href="/ai-host" className={`hover:underline ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                    AI Host
                  </Link>
                  <button onClick={handleSignOut} className={`hover:underline ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-900 dark:text-white'}`}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {isAgoraPage || isCityPage ? (
                    <>
                      <div className="flex items-center space-x-4">
                        <Link href="/signin" className={`text-sm font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                          Sign In
                        </Link>
                        <Link href="/signin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkNavPage ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                          Join
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className={`text-sm font-medium ${isDarkNavPage ? 'text-white hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'}`}>
                        Sign In
                      </Link>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

