import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import AIHostPage from "@/components/ai-host-page";

export default async function AIHostPageRoute() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return <AIHostPage />;
}
