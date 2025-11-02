import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import ProfileSetup from "@/components/profile-setup";

export default async function CreateProfilePage() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return <ProfileSetup userId={user.id} userEmail={user.email || undefined} />;
}
