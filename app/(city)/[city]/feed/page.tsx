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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {city.charAt(0).toUpperCase() + city.slice(1)} Feed
          </h1>
          <p className="text-neutral-600">
            Local conversations and updates from your city
          </p>
        </div>
        <CityFeed city={city} />
      </section>
    </main>
  );
}
