import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import CreateArcadeForm from "@/components/create-arcade-form";

export default async function CreateArcadePage() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return <CreateArcadeForm />;
}