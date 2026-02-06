import ArcadeDashboardCollaborations from "@/components/ArcadeDashboardCollaborations";

export default function ArcadeDashboardCollaborationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeDashboardCollaborations params={params} />;
}




