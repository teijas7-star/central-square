import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ArcadeHomePage from "@/components/arcade-home-page";
import MemberArcadeJourney from "@/components/MemberArcadeJourney";
import LocalArcadePage from "@/components/LocalArcadePage";
import HostDashboard from "@/components/HostDashboard";

export default async function ArcadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch arcade and check membership
  const arcade = await prisma.arcade.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          handle: true,
        },
      },
      _count: {
        select: {
          memberships: true,
          posts: true,
        },
      },
    },
  });

  if (!arcade) {
    redirect("/discover");
  }

  const isMember = user
    ? await prisma.membership.findUnique({
        where: {
          arcadeId_userId: {
            arcadeId: id,
            userId: user.id,
          },
        },
      })
    : null;

  const isHost = user && arcade.hostId === user.id;

  // Role-based component rendering
  if (isHost) {
    // Host sees the full dashboard view
    return <ArcadeHomePage params={params} />;
  } else if (isMember) {
    // Member sees the member journey view
    return <MemberArcadeJourney arcadeId={id} arcadeName={arcade.name} />;
  } else {
    // Non-member sees the public local arcade page
    return <LocalArcadePage />;
  }
}