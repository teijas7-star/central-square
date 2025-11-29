import ArcadeDashboardFeed from "@/components/ArcadeDashboardFeed";

export default function ArcadeDashboardFeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeDashboardFeed params={params} />;
}



