import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect("/profile/create");
  }

  // Get arcades user hosts
  const hostedArcades = await prisma.arcade.findMany({
    where: { hostId: user.id },
    select: {
      id: true,
    },
    take: 1,
  });

  // If user hosts an arcade, redirect to that arcade's dashboard
  if (hostedArcades.length > 0) {
    redirect(`/arcades/${hostedArcades[0].id}/dashboard`);
  }

  // Get arcades user is a member of (but not host)
  const memberships = await prisma.membership.findMany({
    where: { 
      userId: user.id,
      role: "member",
    },
    include: {
      arcade: {
        select: {
          id: true,
        },
      },
    },
    take: 1,
  });

  // If user is a member of an arcade, redirect to that arcade's dashboard
  if (memberships.length > 0) {
    redirect(`/arcades/${memberships[0].arcade.id}/dashboard`);
  }

  // If user has no arcades, redirect to home
  redirect("/");
}

