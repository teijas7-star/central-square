import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import AIHostRecommendations from "@/components/ai-host-recommendations";
import Nav from "@/components/layout/nav";

export default async function AIHostRecommendationsPageRoute() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <>
      <Nav />
      <AIHostRecommendations />
    </>
  );
}

