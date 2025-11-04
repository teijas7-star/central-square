import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Nav from "@/components/layout/nav";
import Link from "next/link";

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
      name: true,
      description: true,
      tags: true,
      _count: {
        select: {
          memberships: true,
          posts: true,
        },
      },
    },
  });

  // Get arcades user is a member of (but not host)
  const memberships = await prisma.membership.findMany({
    where: { 
      userId: user.id,
      role: "member", // Exclude host role since we already have hostedArcades
    },
    include: {
      arcade: {
        select: {
          id: true,
          name: true,
          description: true,
          tags: true,
        },
      },
    },
  });

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Your communities and activity</p>
        </div>
        
        {/* Hosted Arcades Section */}
        {hostedArcades.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Arcades You Host</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {hostedArcades.map((arcade) => (
                <Link
                  key={arcade.id}
                  href={`/arcades/${arcade.id}`}
                  className="border-2 border-purple-300 rounded-xl p-5 hover:shadow-lg transition-all bg-white hover:border-purple-400 relative"
                >
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Host
                  </div>
                  <h3 className="font-semibold text-lg mb-2 pr-16">{arcade.name}</h3>
                  {arcade.description && (
                    <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">
                      {arcade.description}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap mb-2">
                    {arcade.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {arcade._count.memberships} members • {arcade._count.posts} posts
                  </div>
                  <div className="mt-3 text-sm text-purple-600 font-medium">
                    Manage Arcade →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Member Arcades Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Arcades</h2>
          {memberships.length === 0 && hostedArcades.length === 0 ? (
            <div className="border rounded-xl p-8 bg-gray-50 text-center">
              <p className="text-gray-600 mb-2">You haven't joined any arcades yet.</p>
              <div className="flex gap-4 justify-center mt-4">
                <Link
                  href="/discover"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Discover Arcades →
                </Link>
                <span className="text-gray-400">•</span>
                <Link
                  href="/arcades/create"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Create Arcade →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {memberships.map((membership) => (
                <Link
                  key={membership.arcade.id}
                  href={`/arcades/${membership.arcade.id}`}
                  className="border rounded-xl p-5 hover:shadow-lg transition-all bg-white hover:border-purple-300"
                >
                  <h3 className="font-semibold text-lg mb-2">{membership.arcade.name}</h3>
                  {membership.arcade.description && (
                    <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">
                      {membership.arcade.description}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {membership.arcade.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="border-t pt-6">
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/discover"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Discover Arcades →
            </Link>
            <Link
              href="/arcades/create"
              className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Create Arcade →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
