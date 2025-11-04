import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PublicLandingPage from "@/components/public-landing-page";

export default async function Home() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, check their profile
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    // If profile exists, check for city field
    // Note: This assumes city will be added to Profile schema
    // For now, we'll check if profile exists and redirect to default city
    if (profile) {
      // Check if profile has city property (type-safe check)
      const profileWithCity = profile as typeof profile & { city?: string | null };
      
      if (profileWithCity.city) {
        // Redirect to user's city page
        redirect(`/${profileWithCity.city.toLowerCase()}`);
      }
      
      // If no city set, show public page (city chooser)
      // This allows users to select their city
    }
  }

  // Show public city-chooser marketing page for:
  // - Unauthenticated users
  // - Authenticated users without a profile
  // - Authenticated users with profile but no city set
  return <PublicLandingPage />;
}