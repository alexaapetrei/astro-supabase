import { createServerClient } from "@supabase/ssr";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {

  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies.get(key)?.value
        },
        set(key, value, options) {
          cookies.set(key, value, options)
        },
        remove(key, options) {
          cookies.delete(key, options)
        },
      },
    })

  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: true });
  console.log("WAT IS HERER data", { data, error })

  if (error) {
    return new Response(JSON.stringify({
      error: error.message,
    }), { status: 500 });
  }
  console.log("WAT IS HERER data", { data, error })
  return new Response(JSON.stringify(data));
};

export const POST: APIRoute = async ({ request, cookies }) => {

  console.log("Hello : Cookeis ", cookies)
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies.get(key)?.value
        },
        set(key, value, options) {
          cookies.set(key, value, options)
        },
        remove(key, options) {
          cookies.delete(key, options)
        },
      },
    })

  const { name, message } = await request.json();

  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name, message })
    .select()

  if (error) {
    return new Response(JSON.stringify({
      error: error.message,
    }), { status: 500 });
  }

  return new Response(JSON.stringify(data));
};
