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
    { id: "insights", label: "Intelligence", icon: BarChart3, path: `${basePath}/insights` },
    { id: "settings", label: "Settings", icon: Settings, path: `${basePath}/settings` },
  ];

  const isActive = (path: string) => {
    if (path === `${basePath}/dashboard`) {
      return pathname === path || pathname === basePath;
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[var(--burg-deep)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--burg-deep)] border-r border-[var(--burg-800)] flex-shrink-0 flex flex-col">
        <div className="p-4 flex flex-col flex-1">
          {/* Arcade Context Card */}
          <div className="mb-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-lg p-3 hover:bg-[var(--burg-800)] transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-[var(--cream)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--burg-deep)] text-xs font-semibold">
                        {arcadeName
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--cream)] truncate">{arcadeName}</p>
                      <p className="text-xs text-[var(--burg-400)] truncate">{city}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--burg-400)] transition-transform flex-shrink-0 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--burg-900)] border border-[var(--burg-800)] rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      {/* Create Arcade Button */}
                      <Link
                        href="/arcades/create"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[var(--burg-800)] transition-colors border border-[var(--burg-800)] mb-2"
                      >
                        <div className="w-10 h-10 bg-[var(--burg-800)] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Plus className="w-5 h-5 text-[var(--burg-300)]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-[var(--cream)]">Create New Arcade</p>
                          <p className="text-xs text-[var(--burg-400)]">Start a new community</p>
                        </div>
                      </Link>

                      {/* Divider */}
                      {hostedArcades.length > 0 && (
                        <div className="border-t border-[var(--burg-800)] my-2" />
                      )}

                      {/* Arcade List */}
                      {loading ? (
                        <div className="px-3 py-4 text-center text-sm text-[var(--burg-400)]">
                          Loading arcades...
                        </div>
                      ) : hostedArcades.length === 0 ? (
                        <div className="px-3 py-4 text-center text-sm text-[var(--burg-400)]">
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
                                  ? "bg-[var(--burg-800)] border border-[var(--burg-700)]"
                                  : "hover:bg-[var(--burg-800)]"
                              }`}
                            >
                              <div className="w-10 h-10 bg-[var(--cream)] rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-[var(--burg-deep)] text-xs font-semibold">
                                  {arcade.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--cream)] truncate">
                                  {arcade.name}
                                </p>
                                {arcade.description && (
                                  <p className="text-xs text-[var(--burg-400)] truncate">
                                    {arcade.description}
                                  </p>
                                )}
                              </div>
                              {arcade.id === arcadeId && (
                                <div className="w-2 h-2 bg-[var(--cream)] rounded-full flex-shrink-0" />
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
          <div className="mb-4 space-y-2">
            <Link
              href={`${basePath}/events?create=true`}
              className="w-full bg-[var(--cream)] text-[var(--burg-deep)] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--cream-dark)] transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
            <Link
              href={`${basePath}/feed?create=true`}
              className="w-full bg-transparent border border-[var(--burg-800)] text-[var(--burg-300)] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--burg-900)] transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Post Update</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? "bg-[var(--burg-800)] text-[var(--cream)]"
                          : "text-[var(--burg-400)] hover:bg-[var(--burg-900)] hover:text-[var(--burg-300)]"
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
          <div className="pt-4 border-t border-[var(--burg-800)] mt-auto">
            <div className="bg-[var(--burg-900)] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[var(--cream)] rounded-full flex items-center justify-center">
                    <Globe className="w-3 h-3 text-[var(--burg-deep)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--burg-300)]">Global Sync</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-8 h-4 bg-[var(--burg-700)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--burg-600)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--burg-800)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--burg-400)] after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--cream)] peer-checked:after:bg-[var(--burg-deep)]"></div>
                </label>
              </div>
              <p className="text-xs text-[var(--burg-500)] leading-relaxed">
                Connected to Climate Action Network
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[var(--burg-deep)]">
        {children}
      </main>
    </div>
  );
}
