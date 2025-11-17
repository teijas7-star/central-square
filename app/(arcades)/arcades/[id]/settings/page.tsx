import ArcadeDashboardSettings from "@/components/ArcadeDashboardSettings";

export default function ArcadeSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArcadeDashboardSettings params={params} />;
}