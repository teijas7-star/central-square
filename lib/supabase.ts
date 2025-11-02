import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// Server-side client for Route Handlers and Server Components
export async function sbServer(cookieStore?: ReadonlyRequestCookies) {
  const cs = cookieStore || await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cs.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cs.set(name, value, options)
            );
          } catch (error) {
            // The `cookies` object from Next.js's headers is read-only in Route Handlers.
            // This error is expected and can be ignored.
          }
        },
      },
    }
  );
}

// Browser client
export function sbBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
