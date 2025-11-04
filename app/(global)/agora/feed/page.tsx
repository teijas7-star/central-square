import GlobalFeed from "@/components/figma/GlobalFeed";

export default function GlobalAgoraFeedPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Global Agora Feed
          </h1>
          <p className="text-neutral-600">
            Conversations and updates from cities around the world
          </p>
        </div>
        <GlobalFeed />
      </section>
    </main>
  );
}
