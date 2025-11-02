import { sbServer } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Nav from "@/components/layout/nav";

async function getArcade(id: string, userId: string) {
  const arcade = await prisma.arcade.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              handle: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!arcade || arcade.hostId !== userId) {
    return null;
  }

  return arcade;
}

export default async function ArcadeSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const arcade = await getArcade(id, user.id);

  if (!arcade) {
    redirect(`/arcades/${id}`);
  }

  async function removeMember(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    await fetch(`/api/arcades/${id}/members/${userId}`, {
      method: "DELETE",
    });
    redirect(`/arcades/${id}/settings`);
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Arcade Settings</h1>

        <section className="mb-8">
          <h2 className="text-xl font-medium mb-4">Members ({arcade.memberships.length})</h2>
          <div className="space-y-2">
            {arcade.memberships.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <div className="font-semibold">{membership.profile.name}</div>
                  <div className="text-sm text-gray-500">@{membership.profile.handle}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{membership.role}</span>
                  {membership.role === "member" && (
                    <form action={removeMember}>
                      <input type="hidden" name="userId" value={membership.userId} />
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Invite Link</h2>
          <form
            action={async () => {
              "use server";
              const res = await fetch(`/api/arcades/${id}/invite`, {
                method: "POST",
              });
              const data = await res.json();
              // In a real app, you'd show this in a modal or copy to clipboard
              alert(`Invite token: ${data.inviteToken}`);
            }}
          >
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Generate Invite Link
            </button>
          </form>
        </section>

        <div className="mt-6">
          <a href={`/arcades/${id}`} className="text-blue-600 hover:underline">
            ← Back to Arcade
          </a>
        </div>
      </main>
    </>
  );
}

