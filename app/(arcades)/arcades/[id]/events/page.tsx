import ArcadeDashboardEvents from "@/components/ArcadeDashboardEvents";

export default function ArcadeDashboardEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeDashboardEvents params={params} />;
}
