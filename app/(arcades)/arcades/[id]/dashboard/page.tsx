import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HostDashboard from "@/components/HostDashboard";

export default async function HostDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const arcade = await prisma.arcade.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      hostId: true,
    },
  });

  if (!arcade) {
    redirect("/global/arcades");
  }

  if (arcade.hostId !== user.id) {
    redirect(`/arcades/${id}`);
  }

  return (
    <HostDashboard
      arcadeId={arcade.id}
      arcadeName={arcade.name}
    />
  );
}