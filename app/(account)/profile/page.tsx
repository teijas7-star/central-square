import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";

export default async function ProfilePageRoute() {
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

  return <ProfilePage />;
}




