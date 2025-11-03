"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/profiles")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.profile) {
          setUser(data.profile);
        }
      })
      .catch(() => {
        // Not authenticated
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="text-xl font-semibold">
          Central Square
        </Link>
        <div className="flex gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/square" className="hover:underline">
                    Square
                  </Link>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <Link href="/discover" className="hover:underline">
                    Discover
                  </Link>
                  <Link href="/global" className="hover:underline">
                    Global Agora
                  </Link>
                  <Link href="/ai-host" className="hover:underline">
                    AI Host
                  </Link>
                  <Link href="/arcades/create" className="hover:underline">
                    Create Arcade
                  </Link>
                  <button onClick={handleSignOut} className="hover:underline">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/square" className="hover:underline">
                    Square
                  </Link>
                  <Link href="/discover" className="hover:underline">
                    Discover
                  </Link>
                  <Link href="/signin" className="hover:underline">
                    Sign In
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

