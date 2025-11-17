import CityFeed from "@/components/figma/CityFeed";

export default async function CityFeedPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <CityFeed city={city} />
      </section>
    </main>
  );
}
