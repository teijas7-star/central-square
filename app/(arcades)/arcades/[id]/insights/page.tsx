import ArcadeDashboardInsights from "@/components/ArcadeDashboardInsights";

export default function ArcadeDashboardInsightsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeDashboardInsights params={params} />;
}


