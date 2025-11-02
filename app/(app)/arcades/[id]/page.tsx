"use client";

import ArcadeHomePage from "@/components/arcade-home-page";

export default function ArcadePage({ params }: { params: Promise<{ id: string }> }) {
  return <ArcadeHomePage params={params} />;
}
