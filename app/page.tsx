import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import CityHome from "@/components/CityHome";

export default async function Home() {
  // Check if user is authenticated
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  // If authenticated, redirect to /square
  // Temporarily disabled for testing - uncomment to re-enable redirect
  // if (user) {
  //   redirect("/square");
  // }

  // Show city home page (for all users, including signed-in)
  return <CityHome city="Boston" />;
}
