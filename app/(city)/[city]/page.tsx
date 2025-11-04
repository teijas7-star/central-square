import CityHome from "@/components/CityHome";

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <CityHome city={city} />;
}
