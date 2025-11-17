"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Link2,
  BarChart3,
  Settings,
  Globe,
  Plus,
  ChevronDown,
} from "lucide-react";

interface ArcadeDashboardLayoutProps {
  children: React.ReactNode;
  arcadeId: string;
  arcadeName: string;
  city?: string;
}

interface HostedArcade {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
}

export default function ArcadeDashboardLayout({
  children,
  arcadeId,
  arcadeName,
  city = "Boston, MA",
}: ArcadeDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/arcades/${arcadeId}`;
  const [hostedArcades, setHostedArcades] = useState<HostedArcade[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostedArcades();
  }, []);

  const loadHostedArcades = async () => {
    try {
      const res = await fetch("/api/users/hosted-arcades");
      if (res.ok) {
        const data = await res.json();
        setHostedArcades(data.arcades || []);
      }
    } catch (error) {
      console.error("Failed to load hosted arcades", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArcadeChange = (newArcadeId: string) => {
    // Get the current section from pathname
    const currentSection = pathname?.split("/").pop() || "dashboard";
    router.push(`/arcades/${newArcadeId}/${currentSection}`);
    setIsDropdownOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: `${basePath}/dashboard` },
    { id: "events", label: "Events", icon: Calendar, path: `${basePath}/events` },
    { id: "members", label: "Members", icon: Users, path: `${basePath}/members` },
    { id: "feed", label: "Feed", icon: MessageSquare, path: `${basePath}/feed` },
    { id: "collaborations", label: "Collaborations", icon: Link2, path: `${basePath}/collaborations` },
    { id: "insights", label: "Insights", icon: BarChart3, path: `${basePath}/insights` },
    { id: "settings", label: "Settings", icon: Settings, path: `${basePath}/settings` },
  ];

  const isActive = (path: string) => {
    if (path === `${basePath}/dashboard`) {
      return pathname === path || pathname === basePath;
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex-shrink-0">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Global Sync */}
        <div className="px-4 pt-4 border-t border-neutral-200">
          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                  <Globe className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-700">Global Sync</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-8 h-4 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neutral-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-neutral-800"></div>
              </label>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Connected to Climate Action Network
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Arcade Selector */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 bg-white"
                >
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {arcadeName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 3)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-lg font-semibold text-neutral-800">{arcadeName}</h1>
                    <p className="text-sm text-neutral-500">{city}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        {/* Create Arcade Button */}
                        <Link
                          href="/arcades/create"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200 mb-2"
                        >
                          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Plus className="w-5 h-5 text-neutral-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-neutral-900">Create New Arcade</p>
                            <p className="text-xs text-neutral-500">Start a new community</p>
                          </div>
                        </Link>

                        {/* Divider */}
                        {hostedArcades.length > 0 && (
                          <div className="border-t border-neutral-200 my-2" />
                        )}

                        {/* Arcade List */}
                        {loading ? (
                          <div className="px-3 py-4 text-center text-sm text-neutral-500">
                            Loading arcades...
                          </div>
                        ) : hostedArcades.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-neutral-500">
                            No arcades found
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {hostedArcades.map((arcade) => (
                              <button
                                key={arcade.id}
                                onClick={() => handleArcadeChange(arcade.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                                  arcade.id === arcadeId
                                    ? "bg-neutral-100 border border-neutral-300"
                                    : "hover:bg-neutral-50"
                                }`}
                              >
                                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-semibold">
                                    {arcade.name
                                      .split(" ")
                                      .map((word) => word[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 3)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-neutral-900 truncate">
                                    {arcade.name}
                                  </p>
                                  {arcade.description && (
                                    <p className="text-xs text-neutral-500 truncate">
                                      {arcade.description}
                                    </p>
                                  )}
                                </div>
                                {arcade.id === arcadeId && (
                                  <div className="w-2 h-2 bg-neutral-900 rounded-full flex-shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                href={`${basePath}/events?create=true`}
                className="bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
              <Link
                href={`${basePath}/feed?create=true`}
                className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Post Update</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}

