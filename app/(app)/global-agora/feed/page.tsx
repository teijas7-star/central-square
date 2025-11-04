"use client";

import dynamic from "next/dynamic";
import Nav from "@/components/layout/nav";

const GlobalFeed = dynamic(() => import("@/components/figma/GlobalFeed"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <p className="text-neutral-600">Loading feed...</p>
    </div>
  ),
});

export default function GlobalAgoraFeedPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-neutral-50">
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Global Agora Feed</h1>
            <p className="text-neutral-600">
              Discover conversations and connections from cities around the world
            </p>
          </div>
          <GlobalFeed />
        </section>
      </main>
    </>
  );
}

