"use client";

import dynamic from "next/dynamic";
import React from "react";
import Nav from "@/components/layout/nav";

const CityFeed = dynamic(() => import("@/components/figma/CityFeed"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <p className="text-neutral-600">Loading feed...</p>
    </div>
  ),
});

export default function CityFeedPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  // Resolve params synchronously for client component
  const [city, setCity] = React.useState<string>("");

  React.useEffect(() => {
    params.then((resolved) => {
      setCity(resolved.city);
    });
  }, [params]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-neutral-50">
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 capitalize">
              {city ? `${city} Feed` : "City Feed"}
            </h1>
            <p className="text-neutral-600">
              Local conversations and community updates
            </p>
          </div>
          <CityFeed city={city} />
        </section>
      </main>
    </>
  );
}

