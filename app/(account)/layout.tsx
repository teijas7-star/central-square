import { sbServer } from "@/lib/supabase";
import Nav from "@/components/layout/nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <>
          <Nav />
          {children}
        </>
      ) : (
        <>
          <header className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <a href="/" className="text-xl font-semibold">
                Central Square
              </a>
            </div>
          </header>
          {children}
        </>
      )}
    </>
  );
}
