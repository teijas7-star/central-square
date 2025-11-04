import { sbServer } from "@/lib/supabase";
import { redirect } from "next/navigation";
import AIHostChat from "@/components/ai-host-chat";

export default async function AIHostPage() {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Your AI Host</h1>
        <p className="text-gray-600">
          Have a conversation with your AI Host to discover communities that match your interests.
        </p>
      </div>

      <AIHostChat />
    </main>
  );
}
