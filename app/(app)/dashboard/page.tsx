import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Nav from "@/components/layout/nav";

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

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
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
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Arcades</h2>
          {memberships.length === 0 ? (
            <div className="border rounded-xl p-8 bg-gray-50 text-center">
              <p className="text-gray-600 mb-2">You haven't joined any arcades yet.</p>
              <a
                href="/discover"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Discover Arcades →
              </a>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {memberships.map((membership) => (
                <a
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
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="border-t pt-6">
          <div className="flex gap-4 flex-wrap">
            <a
              href="/discover"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Discover Arcades →
            </a>
            <a
              href="/arcades/create"
              className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Create Arcade →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
